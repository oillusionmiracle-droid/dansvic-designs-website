import "server-only";
import { SITE_IMAGES } from "./site-images";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements, blogPosts, faqItems, siteContent, testimonials } from "@/db/schema";

export const DEFAULT_CONTENT: Record<string, string> = {
  hero_eyebrow: "Embroidery · Monogramming · Print",
  hero_title: "Designs that make every outfit tell a story.",
  hero_subtitle:
    "Embroidery, monogramming and print illustration for your next creation. Explore the library or enquire about a custom design.",
  hero_cta_primary: "Explore the library",
  hero_cta_secondary: "Browse designs",
  about_blurb:
    "Dansvic Designs began in 2020 out of a love for embroidery and became a brand in 2021 with one belief: everyone deserves to look unique and special.",
  banner_text: "",
  banner_link: "",
  newsletter_title: "A little inspiration, in your inbox.",
  newsletter_subtitle: "Join the list and be the first to stitch them.",
  ...Object.fromEntries(SITE_IMAGES.map(image => [image.key, image.src])),
};

export async function getSiteContent() {
  const map = { ...DEFAULT_CONTENT };
  try {
    const rows = await db.select().from(siteContent);
    for (const r of rows) map[r.key] = r.value;
  } catch (err) {
    console.error("getSiteContent DB Error:", err);
  }
  return map;
}

export async function getActiveAnnouncement() {
  try {
    return (await db.query.announcements.findFirst({ where: eq(announcements.isActive, true), orderBy: [desc(announcements.createdAt)] })) ?? null;
  } catch (err) {
    console.error("getActiveAnnouncement DB Error:", err);
    return null;
  }
}

export async function getPublishedTestimonials(limit?: number) {
  try {
    return await db.query.testimonials.findMany({
      where: eq(testimonials.isPublished, true),
      orderBy: [desc(testimonials.createdAt)],
      limit,
    });
  } catch (err) {
    console.error("getPublishedTestimonials DB Error:", err);
    return [];
  }
}

export async function getPublishedPosts() {
  return db.query.blogPosts.findMany({ where: eq(blogPosts.isPublished, true), orderBy: [desc(blogPosts.createdAt)] });
}

export async function getFaqs() {
  return db.query.faqItems.findMany({ orderBy: [asc(faqItems.displayOrder), asc(faqItems.createdAt)] });
}
