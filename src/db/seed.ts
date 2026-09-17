import { config } from "dotenv";
import path from "node:path";
import fs from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in .env.local");
}

const parsedDatabaseUrl = new URL(databaseUrl);
const isSupabase = parsedDatabaseUrl.hostname.endsWith("supabase.com");

parsedDatabaseUrl.searchParams.delete("sslmode");
parsedDatabaseUrl.searchParams.delete("uselibpqcompat");

const pool = new Pool({
  connectionString: parsedDatabaseUrl.toString(),
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});
const db = drizzle(pool, { schema });
const STORAGE = path.join(process.cwd(), "storage");

function hash(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

const E = "embroidery" as const;
const P = "print" as const;
const designs = [
  { name: "Royal Agbada Neckline — Ìlú Crest", type: E, category: "Agbada", img: "agbada", alt: "asooke", dims: "320 × 260 mm", stitches: 48200, colours: 3, featured: true, tags: ["agbada", "neckline", "royal", "gold", "wedding"], desc: "A regal neckline composition inspired by traditional Yoruba court dress. Dense satin borders with an open running-stitch fill keep the fabric supple while delivering a bold, ceremonial presence. Digitised for heavyweight brocade and Aso-Oke." },
  { name: "Ẹlẹ́gbà Danshiki Chest Panel", type: E, category: "Danshiki", img: "danshiki", alt: "tshirt", dims: "240 × 210 mm", stitches: 36750, colours: 4, featured: true, tags: ["danshiki", "geometric", "chest", "bold"], desc: "Interlocking geometric motif for the classic danshiki chest panel. Underlay tuned for medium-weight cotton and linen; colour stops arranged to minimise trims." },
  { name: "Fila Bloom — Velvet Cap Motif", type: E, category: "Caps", img: "cap", alt: null, dims: "95 × 70 mm", stitches: 12400, colours: 3, featured: true, tags: ["cap", "fila", "floral", "velvet"], desc: "A compact floral crest sized for the front panel of a fila or abeti-aja cap. Includes a knockdown underlay for napped fabrics like velvet." },
  { name: "Monogram Crest — Interlocked Initials", type: E, category: "T-Shirts", img: "tshirt", alt: null, dims: "60 × 60 mm", stitches: 6800, colours: 2, featured: false, tags: ["monogram", "initials", "crest", "left chest", "minimal"], desc: "Clean left-chest monogram frame with interlocking initials. Swap the letters in your software — the frame is left as a separate colour block for easy editing." },
  { name: "Aso-Oke Border Run — Ìlà Pattern", type: E, category: "Aso-Oke", img: "asooke", alt: "agbada", dims: "400 × 90 mm", stitches: 52300, colours: 2, featured: true, tags: ["aso-oke", "border", "repeat", "metallic"], desc: "Continuous border strip designed to repeat seamlessly along hems and wrappers. Test-stitched with metallic thread at reduced speed; a matte-thread colourway is included." },
  { name: "Senator Flap & Pocket — Tonal Vine", type: E, category: "Flap & Pocket", img: "flap", alt: "danshiki", dims: "150 × 110 mm", stitches: 18900, colours: 1, featured: false, tags: ["senator", "kaftan", "pocket", "flap", "tonal", "subtle"], desc: "Understated tone-on-tone vine that wraps a senator pocket flap. Single colour, low density — perfect for a quiet, premium finish." },
  { name: "Agbada Sleeve Cuff — Sun Rays", type: E, category: "Agbada", img: "agbada", alt: "cap", dims: "280 × 120 mm", stitches: 31200, colours: 3, featured: false, tags: ["agbada", "cuff", "sleeve", "rays"], desc: "Radiating sun-ray cuff piece that pairs with the Ìlú Crest neckline. Mirrored left/right versions included in every format." },
  { name: "Danshiki Hem Band — Adire Dots", type: E, category: "Danshiki", img: "danshiki", alt: null, dims: "350 × 80 mm", stitches: 27600, colours: 2, featured: false, tags: ["danshiki", "hem", "adire", "dots", "repeat"], desc: "Adire-inspired dotted band for danshiki hems and sleeve openings. Repeats cleanly at 350 mm." },
  { name: "Abeti-Aja Cap Side Swirl", type: E, category: "Caps", img: "cap", alt: "flap", dims: "80 × 55 mm", stitches: 9100, colours: 2, featured: false, tags: ["cap", "abeti-aja", "swirl", "side"], desc: "Small swirl accent for the folded ‘ears’ of an abeti-aja cap. Left and right mirrored variants included." },
  { name: "Statement Tee — Lagos Skyline Stitch", type: E, category: "T-Shirts", img: "tshirt", alt: "print-tee", dims: "200 × 140 mm", stitches: 22800, colours: 4, featured: false, tags: ["t-shirt", "lagos", "skyline", "streetwear"], desc: "Line-art Lagos skyline built from bean and triple-run stitches so it stays soft on jersey. Great on heavyweight tees and sweatshirts." },
  { name: "Ankara Panel Cap Print", type: P, category: "Cap", img: "print-cap", alt: null, software: "CorelDRAW X7+, Adobe Illustrator, Inkscape", featured: true, tags: ["cap", "ankara", "pattern", "panel", "sublimation"], desc: "Vector Ankara-inspired panel artwork laid out for 6-panel cap templates. Fully editable colour swatches; CMYK-ready PDF included." },
  { name: "Abstract Adire Tee Graphic", type: P, category: "T-shirt", img: "print-tee", alt: "tshirt", software: "CorelDRAW X7+, Adobe Illustrator, Affinity Designer", featured: true, tags: ["t-shirt", "adire", "abstract", "dtf", "screen print"], desc: "Bold abstract composition drawing on adire resist-dye motifs. Supplied as separated spot colours for screen printing and a flattened version for DTF." },
  { name: "Line-Art Symbols Trouser Repeat", type: P, category: "Trouser", img: "print-trouser", alt: null, software: "CorelDRAW X6+, Adobe Illustrator", featured: false, tags: ["trouser", "repeat", "line art", "symbols", "fabric print"], desc: "All-over repeating tile of hand-drawn adire symbols for trouser fabric printing. Tile size 300 × 300 mm, seamless on all edges." },
  { name: "Minimal Wordmark Cap Print — ‘Èkó’", type: P, category: "Cap", img: "print-cap", alt: "cap", software: "CorelDRAW X7+, Adobe Illustrator, Inkscape", featured: false, tags: ["cap", "wordmark", "typography", "minimal"], desc: "Minimal typographic front-panel print. Outlined text so no fonts are required; includes a one-colour and two-colour variant." },
  { name: "Gradient Bloom Tee Print", type: P, category: "T-shirt", img: "print-tee", alt: null, software: "Adobe Illustrator, CorelDRAW 2019+", featured: false, tags: ["t-shirt", "floral", "gradient", "dtg"], desc: "Soft gradient floral bloom prepared for DTG and sublimation. High-resolution PDF plus editable CDR source." },
];

const testimonials = [
  { name: "Adaeze Okonkwo", title: "Bespoke tailor, Surulere", body: "The Agbada neckline stitched out perfectly the first time — no thread breaks, and the density was spot on for my brocade. My client cried at the fitting.", rating: 5 },
  { name: "Tunde Bakare", title: "Fashion designer, Abuja", body: "I download from Dansvic several times a week. The stitch counts and dimensions being listed upfront saves me so much guesswork.", rating: 5 },
  { name: "Grace Mensah", title: "Embroidery studio, Accra", body: "Clean files, sensible colour stops, and the DST versions run beautifully on our Tajima. Hard to believe they’re free.", rating: 5 },
  { name: "Marcus Lee", title: "Streetwear brand, London", body: "The print files are genuinely production-ready — separated spot colours, outlined type. Dropped straight into our screen print workflow.", rating: 4 },
];

const faqs = [
  { q: "Are the designs really free?", a: "Yes. Every design on the site is currently free to download with no limits. You just need a free account so we can keep your download history and let you re-download any time." },
  { q: "Which file formats do you provide?", a: "Embroidery designs come in EMB, DST and DSB. Print designs come in CDR and PDF. You can download every available format for a design." },
  { q: "Can I use the designs on garments I sell?", a: "Absolutely — you may embroider or print our designs onto fabric and garments for personal or commercial garment production, in unlimited quantities. What you can’t do is resell or share the digital files themselves." },
  { q: "Can I modify a design?", a: "Light modification (resizing, colour changes, small edits for placement) is fine. Heavy modification or rebranding of a design so as to present it as your own original work is not permitted. See our Copyright Policy." },
  { q: "A file won’t open or stitches badly. What should I do?", a: "Use the “Report issue” button on the design page and tell us the format and software/machine you’re using. We test every fix and update the file for everyone." },
  { q: "How often are new designs added?", a: "Several times a week. Subscribe to the newsletter or follow us on Instagram, TikTok and Pinterest to see them first." },
  { q: "Why do download links expire?", a: "Download links are signed and expire after 10 minutes to protect the files from being shared publicly. You can always generate a fresh link from your Download History." },
];

const posts = [
  { title: "How to stitch metallic thread without the headaches", slug: "metallic-thread-tips", cover: "/images/designs/asooke.jpg", excerpt: "Metallic thread makes Aso-Oke borders sing — and makes machines sulk. Here’s how we test and run it in the studio.", body: "Metallic thread is beautiful and temperamental in equal measure. Over four years of running it on Aso-Oke borders and Agbada necklines, we’ve landed on a routine that keeps breaks to a minimum.\n\n## Slow down\nDrop your machine speed to 500–600 spm. Metallic thread is a film wrapped around a core; heat and friction from high speed is what shreds it.\n\n## Use a topstitch or metallic needle\nA 90/14 topstitch needle has a longer eye and deeper groove, which gives the thread room to move. Change it more often than you think you need to.\n\n## Loosen top tension\nBack the top tension off slightly and let the bobbin do the work. Our Ìlà Pattern border file has already been digitised with slightly longer stitch lengths for exactly this reason.\n\n## Stabilise generously\nOn open-weave Aso-Oke, a cut-away stabiliser plus a light spray adhesive stops the fabric shifting between colour passes." },
  { title: "Why every design on Dansvic is free (for now)", slug: "why-free", cover: "/images/hero.jpg", excerpt: "We get asked this a lot. The short answer: we’d rather see our work on a thousand garments than sell a hundred files.", body: "When Dansvic Designs became a brand in 2021, we had a choice: sell each file for a few thousand naira, or give them away and build something bigger.\n\n## Fashion should tell a personal story\nOur mission has always been about the garments, not the files. A monogram on a groom’s agbada, a crest on a school cap — those moments are the point. Free files remove the last excuse not to try.\n\n## What we ask in return\nUse the designs on fabric and garments as much as you like. Don’t resell or share the digital files, and don’t rebrand a design as your own. That’s it.\n\n## What’s next\nWe’re exploring premium collections and custom design services later on, but the core library will stay free. If you want to support us, tell a designer friend and tag us when you post your stitch-outs." },
  { title: "Choosing between EMB, DST and DSB", slug: "emb-dst-dsb", cover: "/images/designs/danshiki.jpg", excerpt: "Three formats, one design. Which should you download?", body: "Every embroidery design on Dansvic comes in three formats. Here’s when to use which.\n\n## EMB\nWilcom’s native format. If you use Wilcom (or Hatch), download EMB — it keeps object data so you can resize and re-sequence without losing quality.\n\n## DST\nThe universal Tajima format. Almost every commercial machine reads it. It stores stitches, not objects, so resize sparingly (±10%).\n\n## DSB\nBarudan’s stitch format. If you run a Barudan machine, this is the one — it will read colour changes exactly as we sequenced them." },
];

async function writeFile(designId: string, format: string, seedText: string) {
  const dir = path.join(STORAGE, "designs", designId);
  await fs.mkdir(dir, { recursive: true });
  const rel = path.join("designs", designId, `${format}.${format.toLowerCase()}`);
  const header = Buffer.from(`DANSVIC-${format}-SAMPLE\n${seedText}\n`);
  const body = randomBytes(24_000 + Math.floor(Math.random() * 80_000));
  await fs.writeFile(path.join(STORAGE, rel), Buffer.concat([header, body]));
  return { rel, size: header.length + body.length };
}

async function main() {
  await db.execute(sql`truncate table page_views, contact_messages, newsletter_subscribers, reports, reviews, saved_designs, downloads, design_tags, design_files, designs, sessions, profiles, testimonials, blog_posts, faq_items, announcements, site_content restart identity cascade`);
  await fs.rm(path.join(STORAGE, "designs"), { recursive: true, force: true });

  const [admin, demo, ...others] = await db
    .insert(schema.profiles)
    .values([
      { name: "Dansvic Admin", email: "admin@dansvicdesigns.com", passwordHash: hash("admin1234"), role: "admin" },
      { name: "Demo Designer", email: "demo@dansvicdesigns.com", passwordHash: hash("demo1234") },
      { name: "Adaeze Okonkwo", email: "adaeze@example.com", passwordHash: hash("password123") },
      { name: "Tunde Bakare", email: "tunde@example.com", passwordHash: hash("password123") },
      { name: "Grace Mensah", email: "grace@example.com", passwordHash: hash("password123") },
    ])
    .returning();

  const inserted: schema.Design[] = [];
  for (let i = 0; i < designs.length; i++) {
    const d = designs[i];
    const code = `DD-${String(i + 1).padStart(4, "0")}`;
    const daysAgo = designs.length - i;
    const [row] = await db
      .insert(schema.designs)
      .values({
        code,
        name: d.name,
        type: d.type,
        category: d.category,
        description: d.desc,
        previewImageUrl: `/images/designs/${d.img}.jpg`,
        secondaryPreviewUrl: d.alt ? `/images/designs/${d.alt}.jpg` : null,
        dimensions: "dims" in d ? d.dims : d.type === P ? "Scalable vector" : null,
        stitchCount: "stitches" in d ? d.stitches : null,
        colourCount: "colours" in d ? d.colours : null,
        softwareCompatibility: "software" in d ? d.software : null,
        isFeatured: d.featured,
        downloadCount: Math.floor(40 + Math.random() * 400 + (d.featured ? 300 : 0)),
        viewCount: Math.floor(300 + Math.random() * 2500 + (d.featured ? 1500 : 0)),
        createdAt: new Date(Date.now() - daysAgo * 2.3 * 86400_000),
      })
      .returning();
    inserted.push(row);
    const formats = d.type === E ? ["EMB", "DST", "DSB"] : ["CDR", "PDF"];
    for (const f of formats) {
      const { rel, size } = await writeFile(row.id, f, `${code} ${d.name}`);
      await db.insert(schema.designFiles).values({ designId: row.id, fileFormat: f, storagePath: rel, fileSize: size });
    }
    await db.insert(schema.designTags).values(d.tags.map((tag) => ({ designId: row.id, tag })));
  }

  // Sample activity
  const reviewers = [others[0], others[1], others[2], demo];
  const bodies = ["Stitched out beautifully on my first try.", "Great density, no thread breaks.", "Exactly what my client wanted.", null, "Clean file, sensible colour order."];
  for (const [i, d] of inserted.entries()) {
    for (const [j, u] of reviewers.entries()) {
      if ((i + j) % 3 === 0) {
        await db.insert(schema.reviews).values({ designId: d.id, userId: u.id, rating: 4 + ((i + j) % 2), body: bodies[(i + j) % bodies.length] });
      }
      if ((i + j) % 2 === 0) {
        const fmt = d.type === E ? "DST" : "PDF";
        await db.insert(schema.downloads).values({ userId: u.id, designId: d.id, fileFormat: fmt, downloadedAt: new Date(Date.now() - (i * 7 + j) * 3600_000) });
      }
    }
  }
  await db.insert(schema.savedDesigns).values([{ userId: demo.id, designId: inserted[0].id }, { userId: demo.id, designId: inserted[10].id }]);
  await db.insert(schema.testimonials).values(testimonials);
  await db.insert(schema.faqItems).values(faqs.map((f, i) => ({ question: f.q, answer: f.a, displayOrder: i + 1 })));
  await db.insert(schema.blogPosts).values(posts.map((p) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt, body: p.body, coverImageUrl: p.cover })));
  await db.insert(schema.announcements).values({ message: "New this week: 3 fresh Agbada necklines — all free.", linkUrl: "/designs?sort=newest", linkLabel: "See what’s new" });

  // Sample analytics
  const paths = ["/", "/designs", "/embroidery", "/print", "/design/DD-0001", "/design/DD-0011", "/free-downloads", "/about"];
  const sources = ["direct", "social", "search", "pinterest.com", "instagram.com"];
  const countries = ["NG", "GH", "GB", "US", "KE", "ZA", "CA"];
  const rows = [];
  for (let i = 0; i < 400; i++) {
    rows.push({ path: paths[i % paths.length], source: sources[i % sources.length], country: countries[(i * 7) % countries.length], visitorId: `seed-${i % 90}`, referrer: null, createdAt: new Date(Date.now() - Math.random() * 14 * 86400_000) });
  }
  await db.insert(schema.pageViews).values(rows);

  console.log(`Seeded ${inserted.length} designs. Admin: ${admin.email} / admin1234 · Demo: ${demo.email} / demo1234`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
