import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Users / auth ----------
// `profiles` in the spec. Password hashes live here since auth is self-hosted
// on PostgreSQL (scrypt). `role` gates the admin panel: 'customer' | 'admin'.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  isDisabled: boolean("is_disabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Catalog ----------
export const designs = pgTable(
  "designs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(), // DD-0001
    name: text("name").notNull(),
    type: text("type").notNull(), // 'embroidery' | 'print'
    category: text("category").notNull(),
    description: text("description").notNull().default(""),
    previewImageUrl: text("preview_image_url").notNull(),
    secondaryPreviewUrl: text("secondary_preview_url"),
    dimensions: text("dimensions"),
    stitchCount: integer("stitch_count"),
    colourCount: integer("colour_count"),
    softwareCompatibility: text("software_compatibility"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    isFree: boolean("is_free").notNull().default(true),
    price: integer("price"), // reserved for future paid designs (kobo)
    downloadCount: integer("download_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("designs_type_idx").on(t.type), index("designs_category_idx").on(t.category)],
);

export const designFiles = pgTable("design_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  designId: uuid("design_id")
    .notNull()
    .references(() => designs.id, { onDelete: "cascade" }),
  fileFormat: text("file_format").notNull(), // EMB | DST | DSB | CDR | PDF
  storagePath: text("storage_path").notNull(), // relative path inside private ./storage dir
  fileSize: integer("file_size").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const designTags = pgTable(
  "design_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => [index("design_tags_tag_idx").on(t.tag)],
);

// ---------- User activity ----------
export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    fileFormat: text("file_format").notNull(),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("downloads_user_idx").on(t.userId)],
);

export const savedDesigns = pgTable(
  "saved_designs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("saved_designs_unique").on(t.userId, t.designId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    body: text("body"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("reviews_unique").on(t.userId, t.designId)],
);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  designId: uuid("design_id")
    .notNull()
    .references(() => designs.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(), // 'download_problem' | 'file_issue' | 'other'
  details: text("details").notNull().default(""),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Content ----------
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  rating: integer("rating").notNull().default(5),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull(),
  coverImageUrl: text("cover_image_url"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  linkUrl: text("link_url"),
  linkLabel: text("link_label"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Key/value store for editable homepage copy and banners.
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  inquiryType: text("inquiry_type").notNull(), // general | download | technical | other
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Analytics ----------
// First-party page-view tracking. Google Analytics can be layered on later
// for richer traffic-source / geo data (see src/components/analytics/Tracker.tsx).
export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    source: text("source").notNull().default("direct"),
    country: text("country").notNull().default("Unknown"),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("page_views_created_idx").on(t.createdAt)],
);

// ---------- Relations ----------
export const designsRelations = relations(designs, ({ many }) => ({
  files: many(designFiles),
  tags: many(designTags),
  reviews: many(reviews),
}));

export const designFilesRelations = relations(designFiles, ({ one }) => ({
  design: one(designs, { fields: [designFiles.designId], references: [designs.id] }),
}));

export const designTagsRelations = relations(designTags, ({ one }) => ({
  design: one(designs, { fields: [designTags.designId], references: [designs.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  design: one(designs, { fields: [reviews.designId], references: [designs.id] }),
  user: one(profiles, { fields: [reviews.userId], references: [profiles.id] }),
}));

export type Design = typeof designs.$inferSelect;
export type DesignFile = typeof designFiles.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type FaqItem = typeof faqItems.$inferSelect;
