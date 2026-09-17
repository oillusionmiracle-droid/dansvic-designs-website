import Link from "next/link";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { designs, downloads, pageViews, profiles } from "@/db/schema";
import { AdminHeader, Card } from "@/components/admin/ui";
import { formatNumber } from "@/lib/utils";

export default async function AdminHome() {
  const since = new Date(Date.now() - 30 * 86400_000);
  const [[totals], [visits], topViewed, topDownloaded, byCategory, sources, countries, dailyViews] = await Promise.all([
    db.select({
      designs: sql<number>`(select count(*) from ${designs})::int`,
      users: sql<number>`(select count(*) from ${profiles})::int`,
      downloads: sql<number>`(select count(*) from ${downloads})::int`,
      downloads30: sql<number>`(select count(*) from ${downloads} where ${downloads.downloadedAt} >= ${since})::int`,
    }).from(sql`(select 1) as one`),
    db.select({ views: sql<number>`count(*)::int`, visitors: sql<number>`count(distinct ${pageViews.visitorId})::int` }).from(pageViews).where(gte(pageViews.createdAt, since)),
    db.select({ code: designs.code, name: designs.name, n: designs.viewCount }).from(designs).orderBy(desc(designs.viewCount)).limit(6),
    db.select({ code: designs.code, name: designs.name, n: designs.downloadCount }).from(designs).orderBy(desc(designs.downloadCount)).limit(6),
    db.select({ category: designs.category, type: designs.type, n: sql<number>`coalesce(sum(${designs.downloadCount}),0)::int`, v: sql<number>`coalesce(sum(${designs.viewCount}),0)::int` }).from(designs).groupBy(designs.category, designs.type).orderBy(desc(sql`sum(${designs.downloadCount})`)),
    db.select({ source: pageViews.source, n: sql<number>`count(*)::int` }).from(pageViews).where(gte(pageViews.createdAt, since)).groupBy(pageViews.source).orderBy(desc(sql`count(*)`)).limit(8),
    db.select({ country: pageViews.country, n: sql<number>`count(distinct ${pageViews.visitorId})::int` }).from(pageViews).where(gte(pageViews.createdAt, since)).groupBy(pageViews.country).orderBy(desc(sql`count(distinct ${pageViews.visitorId})`)).limit(8),
    db.select({ day: sql<string>`to_char(date_trunc('day', ${pageViews.createdAt}), 'DD Mon')`, n: sql<number>`count(*)::int` }).from(pageViews).where(gte(pageViews.createdAt, new Date(Date.now() - 14 * 86400_000))).groupBy(sql`date_trunc('day', ${pageViews.createdAt})`).orderBy(sql`date_trunc('day', ${pageViews.createdAt})`),
  ]);
  void eq;
  const max = Math.max(1, ...dailyViews.map((d) => d.n));

  return (
    <>
      <AdminHeader title="Analytics" />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-5">
        {[
          ["Visitors (30d)", visits?.visitors ?? 0],
          ["Page views (30d)", visits?.views ?? 0],
          ["Downloads (30d)", totals?.downloads30 ?? 0],
          ["Total downloads", totals?.downloads ?? 0],
          ["Registered users", totals?.users ?? 0],
        ].map(([k, v]) => (
          <Card key={String(k)}>
            <p className="text-sm text-ink-3">{k}</p>
            <p className="mt-1 text-3xl font-bold">{formatNumber(Number(v))}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <h2 className="font-bold">Page views — last 14 days</h2>
        <div className="mt-4 flex items-end gap-1.5 h-32">
          {dailyViews.length === 0 && <p className="text-sm text-ink-3">No traffic recorded yet.</p>}
          {dailyViews.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1" title={`${d.day}: ${d.n}`}>
              <div className="w-full rounded-t-md bg-accent" style={{ height: `${Math.max(4, (d.n / max) * 100)}%` }} />
              <span className="text-[10px] text-ink-3 whitespace-nowrap">{d.day.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <RankCard title="Most viewed designs" rows={topViewed.map((r) => [`${r.code} · ${r.name}`, r.n, `/design/${r.code}`])} />
        <RankCard title="Most downloaded designs" rows={topDownloaded.map((r) => [`${r.code} · ${r.name}`, r.n, `/design/${r.code}`])} />
        <RankCard title="Popular categories (downloads)" rows={byCategory.map((r) => [`${r.category} · ${r.type}`, r.n])} />
        <RankCard title="Traffic sources (30d)" rows={sources.map((r) => [r.source, r.n])} note="Google Analytics can be added later for richer referrer data." />
        <RankCard title="Visitors by country (30d)" rows={countries.map((r) => [r.country, r.n])} note="Country comes from CDN geo headers in production; shows 'Unknown' locally." />
      </div>
    </>
  );
}

function RankCard({ title, rows, note }: { title: string; rows: (string | number | undefined)[][]; note?: string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r[1])));
  return (
    <Card>
      <h2 className="font-bold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-sm text-ink-3">No data yet.</li>}
        {rows.map((r, i) => (
          <li key={i} className="text-sm">
            <div className="flex justify-between gap-3">
              {r[2] ? <Link href={String(r[2])} className="truncate hover:text-accent">{r[0]}</Link> : <span className="truncate capitalize">{r[0]}</span>}
              <span className="font-semibold tabular-nums">{formatNumber(Number(r[1]))}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-surface-3"><div className="h-full rounded-full bg-accent" style={{ width: `${(Number(r[1]) / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-xs text-ink-3">{note}</p>}
    </Card>
  );
}
