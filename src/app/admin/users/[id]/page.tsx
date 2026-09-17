import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { designs, downloads, profiles } from "@/db/schema";
import { AdminHeader, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default async function UserActivity({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.query.profiles.findFirst({ where: eq(profiles.id, id) });
  if (!user) notFound();
  const rows = await db
    .select({ id: downloads.id, at: downloads.downloadedAt, format: downloads.fileFormat, code: designs.code, name: designs.name })
    .from(downloads).innerJoin(designs, eq(designs.id, downloads.designId)).where(eq(downloads.userId, id)).orderBy(desc(downloads.downloadedAt)).limit(300);
  return (
    <>
      <AdminHeader title={user.name}><span className="text-ink-3">{user.email}</span></AdminHeader>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-ink-3 border-b border-line"><tr><th className="p-3">When</th><th className="p-3">Design</th><th className="p-3">Format</th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td className="p-4 text-ink-3" colSpan={3}>No downloads yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}><td className="p-3">{formatDate(r.at)}</td><td className="p-3"><Link href={`/design/${r.code}`} className="hover:text-accent">{r.code} · {r.name}</Link></td><td className="p-3 font-semibold">{r.format}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
