import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { designFiles, designs, downloads, savedDesigns } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { AccountShell } from "@/components/account/AccountShell";
import { RedownloadButton } from "@/components/account/RedownloadButton";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const [[stats], recent] = await Promise.all([
    db
      .select({
        downloads: sql<number>`(select count(*) from ${downloads} where ${downloads.userId} = ${user.id})::int`,
        saved: sql<number>`(select count(*) from ${savedDesigns} where ${savedDesigns.userId} = ${user.id})::int`,
      })
      .from(sql`(select 1) as one`),
    db
      .select({ id: downloads.id, at: downloads.downloadedAt, format: downloads.fileFormat, code: designs.code, name: designs.name, image: designs.previewImageUrl, fileId: designFiles.id })
      .from(downloads)
      .innerJoin(designs, eq(designs.id, downloads.designId))
      .leftJoin(designFiles, and(eq(designFiles.designId, designs.id), eq(designFiles.fileFormat, downloads.fileFormat)))
      .where(eq(downloads.userId, user.id))
      .orderBy(desc(downloads.downloadedAt))
      .limit(5),
  ]);

  return (
    <AccountShell active="/account" title={`Hi, ${user.name.split(" ")[0]}`}>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-xl3 bg-surface-2 border border-line p-7">
          <h2 className="text-xl font-bold">Profile</h2>
          <dl className="mt-4 space-y-3">
            {[["Name", user.name], ["Email", user.email], ["Member since", formatDate(user.createdAt)], ["Role", user.role]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0">
                <dt className="text-ink-3">{k}</dt>
                <dd className="font-semibold capitalize text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/account/downloads" className="rounded-2xl bg-surface p-4 border border-line hover:border-accent">
              <p className="text-3xl font-bold text-accent">{stats?.downloads ?? 0}</p>
              <p className="text-sm text-ink-3">Downloads</p>
            </Link>
            <Link href="/account/saved" className="rounded-2xl bg-surface p-4 border border-line hover:border-accent">
              <p className="text-3xl font-bold text-accent">{stats?.saved ?? 0}</p>
              <p className="text-sm text-ink-3">Saved</p>
            </Link>
          </div>
        </section>
        <section className="rounded-xl3 bg-surface-2 border border-line p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recently downloaded</h2>
            <Link href="/account/downloads" className="text-sm font-semibold text-accent">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-ink-3">
              Nothing yet. <Link href="/free-downloads" className="text-accent font-semibold">Browse free designs →</Link>
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-surface-3 shrink-0">
                    <Image src={r.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/design/${r.code}`} className="font-semibold hover:text-accent line-clamp-1">{r.name}</Link>
                    <p className="text-sm text-ink-3">{r.code} · {r.format} · {formatDate(r.at)}</p>
                  </div>
                  {r.fileId && <RedownloadButton fileId={r.fileId} />}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AccountShell>
  );
}
