import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { AdminHeader, btnPrimary, btnSecondary, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default async function BlogAdmin() {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return (
    <>
      <AdminHeader title="Blog"><Link href="/admin/blog/new" className={btnPrimary}>+ New post</Link></AdminHeader>
      <Card className="p-0 divide-y divide-line">
        {rows.length === 0 && <p className="p-5 text-ink-3">No posts yet.</p>}
        {rows.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 p-4">
            <div><p className="font-semibold">{p.title}</p><p className="text-sm text-ink-3">/{p.slug} · {formatDate(p.createdAt)} · {p.isPublished ? "Published" : "Draft"}</p></div>
            <Link href={`/admin/blog/${p.id}`} className={btnSecondary}>Edit</Link>
          </div>
        ))}
      </Card>
    </>
  );
}
