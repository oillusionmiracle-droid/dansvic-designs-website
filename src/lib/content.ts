import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements, blogPosts, faqItems, siteContent, testimonials } from "@/db/schema";

export const DEFAULT_CONTENT: Record<string, string> = {
  hero_eyebrow: "Embroidery · Monogramming · Print",
  hero_title: "Designs that make every outfit tell a story.",
  hero_subtitle:
    "Free, production-ready embroidery and print files for Agbada, Danshiki, Aso-Oke, caps, tees and more — crafted in Lagos, downloaded worldwide.",
  hero_cta_primary: "Download Free Designs",
  hero_cta_secondary: "See My Designs",
  about_blurb:
    "Dansvic Designs began in 2020 out of a love for embroidery and became a brand in 2021 with one belief: everyone deserves to look unique and special.",
  banner_text: "",
  banner_link: "",
  newsletter_title: "New designs land several times a week.",
  newsletter_subtitle: "Join the list and be the first to stitch them.",
};

export async function getSiteContent() {
  const rows = await db.select().from(siteContent);
  const map = { ...DEFAULT_CONTENT };
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getActiveAnnouncement() {
  return db.query.announcements.findFirst({ where: eq(announcements.isActive, true), orderBy: [desc(announcements.createdAt)] });
}

export async function getPublishedTestimonials(limit?: number) {
  return db.query.testimonials.findMany({
    where: eq(testimonials.isPublished, true),
    orderBy: [desc(testimonials.createdAt)],
    limit,
  });
}

export async function getPublishedPosts() {
  return db.query.blogPosts.findMany({ where: eq(blogPosts.isPublished, true), orderBy: [desc(blogPosts.createdAt)] });
}

export async function getFaqs() {
  return db.query.faqItems.findMany({ orderBy: [asc(faqItems.displayOrder), asc(faqItems.createdAt)] });
}
