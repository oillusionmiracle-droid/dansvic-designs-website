"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { announcements, blogPosts, contactMessages, designFiles, designTags, designs, faqItems, profiles, reports, siteContent, testimonials } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { saveDesignFile, savePublicUpload } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { ALL_FORMATS } from "@/lib/constants";

async function admin() {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") throw new Error("Admin access required");
  return u;
}
const str = (fd: FormData, k: string) => (fd.get(k) as string | null)?.toString().trim() ?? "";
const num = (fd: FormData, k: string) => (str(fd, k) ? Number(str(fd, k)) : null);
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const refreshAll = () => {
  revalidatePath("/", "layout");
};

async function nextCode() {
  const [row] = await db.select({ max: sql<string | null>`max(${designs.code})` }).from(designs);
  const n = row?.max ? parseInt(row.max.replace(/\D/g, ""), 10) + 1 : 1;
  return `DD-${String(n).padStart(4, "0")}`;
}

async function handleFiles(designId: string, fd: FormData) {
  for (const format of ALL_FORMATS) {
    const f = fd.get(`file_${format}`);
    if (f instanceof File && f.size > 0) {
      const buf = Buffer.from(await f.arrayBuffer());
      const rel = await saveDesignFile(designId, format, buf);
      await db.delete(designFiles).where(and(eq(designFiles.designId, designId), eq(designFiles.fileFormat, format)));
      await db.insert(designFiles).values({ designId, fileFormat: format, storagePath: rel, fileSize: buf.length });
    }
  }
}

async function handleImage(fd: FormData, key: string, fallback: string | null) {
  const f = fd.get(key);
  if (f instanceof File && f.size > 0) return savePublicUpload(f.name, Buffer.from(await f.arrayBuffer()));
  return str(fd, `${key}_url`) || fallback;
}

export async function saveDesign(fd: FormData) {
  await admin();
  const id = str(fd, "id");
  const preview = await handleImage(fd, "preview", null);
  const secondary = await handleImage(fd, "secondary", null);
  const values = {
    name: str(fd, "name"),
    type: str(fd, "type"),
    category: str(fd, "category"),
    description: str(fd, "description"),
    dimensions: str(fd, "dimensions") || null,
    stitchCount: num(fd, "stitchCount"),
    colourCount: num(fd, "colourCount"),
    softwareCompatibility: str(fd, "softwareCompatibility") || null,
    isFeatured: bool(fd, "isFeatured"),
    isPublished: bool(fd, "isPublished"),
    isFree: bool(fd, "isFree"),
  };
  let designId = id;
  if (id) {
    await db
      .update(designs)
      .set({ ...values, ...(preview ? { previewImageUrl: preview } : {}), secondaryPreviewUrl: secondary })
      .where(eq(designs.id, id));
  } else {
    const [d] = await db
      .insert(designs)
      .values({ ...values, code: str(fd, "code") || (await nextCode()), previewImageUrl: preview ?? "/images/hero.jpg", secondaryPreviewUrl: secondary })
      .returning({ id: designs.id });
    designId = d.id;
  }
  const tags = str(fd, "tags").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  await db.delete(designTags).where(eq(designTags.designId, designId));
  if (tags.length) await db.insert(designTags).values(tags.map((tag) => ({ designId, tag })));
  await handleFiles(designId, fd);
  refreshAll();
  redirect(`/admin/designs/${designId}?saved=1`);
}

export async function toggleDesignFlag(id: string, flag: "isPublished" | "isFeatured", value: boolean) {
  await admin();
  await db.update(designs).set({ [flag]: value }).where(eq(designs.id, id));
  refreshAll();
}

export async function deleteDesign(id: string) {
  await admin();
  await db.delete(designs).where(eq(designs.id, id));
  refreshAll();
  redirect("/admin/designs");
}

export async function deleteDesignFile(fileId: string) {
  await admin();
  await db.delete(designFiles).where(eq(designFiles.id, fileId));
  refreshAll();
}

export async function setUserDisabled(id: string, disabled: boolean) {
  await admin();
  await db.update(profiles).set({ isDisabled: disabled }).where(eq(profiles.id, id));
  revalidatePath("/admin/users");
}

export async function setUserRole(id: string, role: "admin" | "customer") {
  await admin();
  await db.update(profiles).set({ role }).where(eq(profiles.id, id));
  revalidatePath("/admin/users");
}

export async function saveSiteContent(fd: FormData) {
  await admin();
  for (const [k, v] of Array.from(fd.entries())) {
    if (typeof v !== "string") continue;
    await db.insert(siteContent).values({ key: k, value: v }).onConflictDoUpdate({ target: siteContent.key, set: { value: v, updatedAt: new Date() } });
  }
  refreshAll();
}

export async function saveAnnouncement(fd: FormData) {
  await admin();
  await db.update(announcements).set({ isActive: false });
  if (str(fd, "message")) await db.insert(announcements).values({ message: str(fd, "message"), linkUrl: str(fd, "linkUrl") || null, linkLabel: str(fd, "linkLabel") || null, isActive: true });
  refreshAll();
}

export async function saveTestimonial(fd: FormData) {
  await admin();
  const id = str(fd, "id");
  const v = { name: str(fd, "name"), title: str(fd, "title") || null, body: str(fd, "body"), rating: num(fd, "rating") ?? 5, isPublished: bool(fd, "isPublished") };
  if (id) await db.update(testimonials).set(v).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values(v);
  refreshAll();
}
export async function deleteTestimonial(id: string) {
  await admin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  refreshAll();
}

export async function saveFaq(fd: FormData) {
  await admin();
  const id = str(fd, "id");
  const v = { question: str(fd, "question"), answer: str(fd, "answer"), displayOrder: num(fd, "displayOrder") ?? 0 };
  if (id) await db.update(faqItems).set(v).where(eq(faqItems.id, id));
  else await db.insert(faqItems).values(v);
  refreshAll();
}
export async function deleteFaq(id: string) {
  await admin();
  await db.delete(faqItems).where(eq(faqItems.id, id));
  refreshAll();
}

export async function savePost(fd: FormData) {
  await admin();
  const id = str(fd, "id");
  const cover = await handleImage(fd, "cover", str(fd, "existingCover") || null);
  const v = { title: str(fd, "title"), slug: slugify(str(fd, "slug") || str(fd, "title")), excerpt: str(fd, "excerpt"), body: str(fd, "body"), coverImageUrl: cover, isPublished: bool(fd, "isPublished") };
  if (id) await db.update(blogPosts).set(v).where(eq(blogPosts.id, id));
  else await db.insert(blogPosts).values(v);
  refreshAll();
  redirect("/admin/blog");
}
export async function deletePost(id: string) {
  await admin();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  refreshAll();
  redirect("/admin/blog");
}

export async function setReportStatus(id: string, status: string) {
  await admin();
  await db.update(reports).set({ status }).where(eq(reports.id, id));
  revalidatePath("/admin/inbox");
}
export async function setMessageStatus(id: string, status: string) {
  await admin();
  await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/inbox");
}
