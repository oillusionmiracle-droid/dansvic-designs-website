import { desc } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { getSiteContent, DEFAULT_CONTENT } from "@/lib/content";
import { AdminHeader, btnPrimary, Card, Field, input, textarea } from "@/components/admin/ui";
import { saveAnnouncement, saveSiteContent } from "../actions";

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
      <div className="grid gap-5 lg:grid-cols-2">
        <form action={saveSiteContent}>
          <Card className="space-y-4">
            <h2 className="font-bold">Homepage content</h2>
            {Object.keys(DEFAULT_CONTENT).map((k) => (
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
