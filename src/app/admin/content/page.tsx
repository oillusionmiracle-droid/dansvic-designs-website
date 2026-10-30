import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { getSiteContent, DEFAULT_CONTENT } from "@/lib/content";
import { AdminHeader, btnPrimary, Card, Field, input, textarea } from "@/components/admin/ui";
import { saveAnnouncement, saveSiteContent, saveSiteImage } from "../actions";

const labels: Record<string, string> = {
  hero_eyebrow: "Hero eyebrow", hero_title: "Hero title", hero_subtitle: "Hero subtitle", hero_cta_primary: "Primary CTA label", hero_cta_secondary: "Secondary CTA label",
  about_blurb: "About blurb (homepage)", banner_text: "Promo banner text (blank = hidden)", banner_link: "Promo banner link", newsletter_title: "Newsletter title", newsletter_subtitle: "Newsletter subtitle",
};

export default async function ContentAdmin() {
  const content = await getSiteContent();
  const current = await db.query.announcements.findFirst({ orderBy: [desc(announcements.createdAt)] });
  return (
    <>
      <AdminHeader title="Homepage & Banners" />
      <Card className="mb-6">
        <h2 className="font-bold text-xl">Website images</h2>
        <p className="mt-2 text-sm text-ink-3">Change the hero, collection, story, category and style-reference photos here. Upload a JPG, PNG, WebP or AVIF up to 3 MB, or paste an image URL. Save each image separately. For individual design images, open Designs and edit that design.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SITE_IMAGES.map(image => <div key={image.key} className="border border-line p-4 space-y-3">
            <h3 className="font-semibold">{image.label}</h3>
            <div className="relative aspect-[4/3] bg-surface-3 overflow-hidden"><Image src={content[image.key]||image.src} alt={image.label} fill unoptimized sizes="(max-width: 768px) 90vw, 30vw" className="object-cover" /></div>
            <form action={saveSiteImage} className="space-y-3"><input type="hidden" name="key" value={image.key}/>
              <label className="block text-sm">Choose a new image<input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full mt-2 text-sm" /></label>
              <label className="block text-sm">Or paste an image URL<input type="url" name="image_url" placeholder="https://…" className={input}/></label>
              <button className={btnPrimary}>Save image</button>
            </form>
            <form action={saveSiteImage}><input type="hidden" name="key" value={image.key}/><input type="hidden" name="restore" value="true"/><button className="text-sm underline">Restore original image</button></form>
          </div>)}
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <form action={saveSiteContent}>
          <Card className="space-y-4">
            <h2 className="font-bold">Homepage content</h2>
            {Object.keys(DEFAULT_CONTENT).filter(k => !k.startsWith("image_")).map((k) => (
              <Field key={k} label={labels[k] ?? k}>
                {k.includes("subtitle") || k.includes("blurb") ? <textarea name={k} rows={3} defaultValue={content[k]} className={textarea} /> : <input name={k} defaultValue={content[k]} className={input} />}
              </Field>
            ))}
            <button className={btnPrimary}>Save homepage</button>
          </Card>
        </form>
        <form action={saveAnnouncement}>
          <Card className="space-y-4">
            <h2 className="font-bold">Announcement bar</h2>
            <p className="text-sm text-ink-3">Shown at the very top of every page. Leave the message blank to turn it off.</p>
            <Field label="Message"><input name="message" defaultValue={current?.isActive ? current.message : ""} className={input} /></Field>
            <Field label="Link URL"><input name="linkUrl" defaultValue={current?.linkUrl ?? ""} className={input} /></Field>
            <Field label="Link label"><input name="linkLabel" defaultValue={current?.linkLabel ?? ""} className={input} /></Field>
            <button className={btnPrimary}>Save announcement</button>
          </Card>
        </form>
      </div>
    </>
  );
}
