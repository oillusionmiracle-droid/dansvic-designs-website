import Image from "next/image";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { designs } from "@/db/schema";
import { AdminHeader, btnPrimary, btnSecondary, Card } from "@/components/admin/ui";
import { toggleDesignFlag } from "../actions";

export default async function AdminDesigns() {
  const rows = await db.select().from(designs).orderBy(desc(designs.createdAt));
  return (
    <>
      <AdminHeader title={`Designs (${rows.length})`}>
        <Link href="/admin/designs/new" className={btnPrimary}>+ Add design</Link>
      </AdminHeader>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-ink-3 border-b border-line">
            <tr>
              <th className="p-3">Design</th><th className="p-3">Type / Category</th><th className="p-3">Stats</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-3 shrink-0"><Image src={d.previewImageUrl} alt="" fill sizes="48px" className="object-cover" /></div>
                    <div><p className="font-semibold">{d.name}</p><p className="text-ink-3">{d.code}</p></div>
                  </div>
                </td>
                <td className="p-3 capitalize">{d.type}<br /><span className="text-ink-3">{d.category}</span></td>
                <td className="p-3 tabular-nums">↓ {d.downloadCount}<br /><span className="text-ink-3">◉ {d.viewCount}</span></td>
                <td className="p-3">
                  <div className="flex flex-col gap-1.5">
                    <form action={toggleDesignFlag.bind(null, d.id, "isPublished", !d.isPublished)}>
                      <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.isPublished ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-surface-3 text-ink-3"}`}>{d.isPublished ? "Published" : "Unpublished"}</button>
                    </form>
                    <form action={toggleDesignFlag.bind(null, d.id, "isFeatured", !d.isFeatured)}>
                      <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.isFeatured ? "bg-accent/15 text-accent" : "bg-surface-3 text-ink-3"}`}>{d.isFeatured ? "★ Featured" : "Not featured"}</button>
                    </form>
                  </div>
                </td>
                <td className="p-3 text-right"><Link href={`/admin/designs/${d.id}`} className={btnSecondary}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
