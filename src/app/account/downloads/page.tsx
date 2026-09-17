import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { designFiles, designs, downloads } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { AccountShell } from "@/components/account/AccountShell";
import { RedownloadButton } from "@/components/account/RedownloadButton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/downloads");
  const rows = await db
    .select({ id: downloads.id, at: downloads.downloadedAt, format: downloads.fileFormat, code: designs.code, name: designs.name, image: designs.previewImageUrl, type: designs.type, fileId: designFiles.id })
    .from(downloads)
    .innerJoin(designs, eq(designs.id, downloads.designId))
    .leftJoin(designFiles, and(eq(designFiles.designId, designs.id), eq(designFiles.fileFormat, downloads.fileFormat)))
    .where(eq(downloads.userId, user.id))
    .orderBy(desc(downloads.downloadedAt))
    .limit(200);

  return (
    <AccountShell active="/account/downloads" title="Download History">
      <p className="text-ink-3 mb-6">No limits — re-download any file, any time.</p>
      {rows.length === 0 ? (
        <div className="rounded-xl3 border border-dashed border-line p-14 text-center text-ink-3 text-lg">
          You haven’t downloaded anything yet. <Link href="/free-downloads" className="text-accent font-semibold">Start here →</Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-4 rounded-2xl bg-surface-2 border border-line p-3 md:p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-surface-3 shrink-0">
                <Image src={r.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/design/${r.code}`} className="font-semibold hover:text-accent line-clamp-1 text-[17px]">{r.name}</Link>
                <p className="text-sm text-ink-3">
                  {r.code} · <span className="capitalize">{r.type}</span> · <span className="font-semibold text-ink">{r.format}</span> · {formatDate(r.at)}
                </p>
              </div>
              {r.fileId ? <RedownloadButton fileId={r.fileId} /> : <span className="text-xs text-ink-3">File removed</span>}
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
