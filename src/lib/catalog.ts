import "server-only";
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { designFiles, designTags, designs, reviews, savedDesigns } from "@/db/schema";
import { SAMPLE_DESIGNS } from "./sampleData";

export type DesignCard = {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  previewImageUrl: string;
  secondaryPreviewUrl: string | null;
  isFeatured: boolean;
  isFree: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  formats: string[];
};

export type BrowseParams = {
  q?: string;
  type?: "embroidery" | "print";
  category?: string;
  format?: string;
  sort?: "newest" | "downloads" | "popular";
  popularity?: "trending" | "top" | "";
  free?: boolean;
  limit?: number;
  featured?: boolean;
};

const formatsAgg = sql<string[]>`coalesce(array_agg(distinct ${designFiles.fileFormat}) filter (where ${designFiles.fileFormat} is not null), '{}')`;

export async function browseDesigns(p: BrowseParams = {}): Promise<DesignCard[]> {
  const where: SQL[] = [eq(designs.isPublished, true)];
  if (p.type) where.push(eq(designs.type, p.type));
  if (p.category) where.push(eq(designs.category, p.category));
  if (p.free) where.push(eq(designs.isFree, true));
  if (p.featured) where.push(eq(designs.isFeatured, true));
  if (p.popularity === "top") where.push(sql`${designs.downloadCount} >= 50`);
  if (p.popularity === "trending") where.push(sql`${designs.viewCount} >= 100`);
  if (p.q) {
    const q = `%${p.q.trim()}%`;
    const tagged = db.select({ id: designTags.designId }).from(designTags).where(ilike(designTags.tag, q));
    where.push(or(ilike(designs.name, q), ilike(designs.code, q), ilike(designs.description, q), inArray(designs.id, tagged))!);
  }
  if (p.format) {
    const withFormat = db
      .select({ id: designFiles.designId })
      .from(designFiles)
      .where(eq(designFiles.fileFormat, p.format.toUpperCase()));
    where.push(inArray(designs.id, withFormat));
  }
  const order =
    p.sort === "downloads"
      ? [desc(designs.downloadCount), desc(designs.createdAt)]
      : p.sort === "popular"
        ? [desc(sql`${designs.viewCount} + ${designs.downloadCount} * 3`), desc(designs.createdAt)]
        : [desc(designs.createdAt)];

  try {
    const rows = await db
      .select({
        id: designs.id,
        code: designs.code,
        name: designs.name,
        type: designs.type,
        category: designs.category,
        previewImageUrl: designs.previewImageUrl,
        secondaryPreviewUrl: designs.secondaryPreviewUrl,
        isFeatured: designs.isFeatured,
        isFree: designs.isFree,
        downloadCount: designs.downloadCount,
        viewCount: designs.viewCount,
        createdAt: designs.createdAt,
        formats: formatsAgg,
      })
      .from(designs)
      .leftJoin(designFiles, eq(designFiles.designId, designs.id))
      .where(and(...where))
      .groupBy(designs.id)
      .orderBy(...order)
      .limit(p.limit ?? 200);
    return rows.length > 0 ? rows : SAMPLE_DESIGNS.filter(d => {
      if (p.type && d.type !== p.type) return false;
      if (p.free && !d.isFree) return false;
      if (p.featured && !d.isFeatured) return false;
      return true;
    });
  } catch (err) {
    console.error("browseDesigns DB Error:", err);
    return SAMPLE_DESIGNS;
  }
}

export async function getDesignByCode(code: string) {
  const design = await db.query.designs.findFirst({
    where: and(eq(designs.code, code.toUpperCase()), eq(designs.isPublished, true)),
    with: { files: true, tags: true },
  });
  return design ?? null;
}

export async function getDesignReviews(designId: string) {
  return db.query.reviews.findMany({
    where: eq(reviews.designId, designId),
    with: { user: { columns: { name: true } } },
    orderBy: [desc(reviews.createdAt)],
  });
}

export async function getRatingSummary(designId: string) {
  const [row] = await db
    .select({ avg: sql<number>`coalesce(avg(${reviews.rating}), 0)::float`, count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(eq(reviews.designId, designId));
  return { avg: Number(row?.avg ?? 0), count: Number(row?.count ?? 0) };
}

export async function isSaved(userId: string, designId: string) {
  const row = await db.query.savedDesigns.findFirst({
    where: and(eq(savedDesigns.userId, userId), eq(savedDesigns.designId, designId)),
  });
  return !!row;
}

export async function getCategoryCounts() {
  try {
    return await db
      .select({ type: designs.type, category: designs.category, count: sql<number>`count(*)::int` })
      .from(designs)
      .where(eq(designs.isPublished, true))
      .groupBy(designs.type, designs.category)
      .orderBy(asc(designs.type), asc(designs.category));
  } catch (err) {
    console.error("getCategoryCounts DB Error:", err);
    return [];
  }
}

export async function getAllTags(limit = 24) {
  return db
    .select({ tag: designTags.tag, count: sql<number>`count(*)::int` })
    .from(designTags)
    .groupBy(designTags.tag)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}
