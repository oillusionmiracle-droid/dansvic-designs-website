import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { designs } from "@/db/schema";
import { AdminHeader, btnSecondary } from "@/components/admin/ui";
import { DesignForm } from "@/components/admin/DesignForm";

export default async function EditDesign({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const design = await db.query.designs.findFirst({ where: eq(designs.id, id), with: { files: true, tags: true } });
  if (!design) notFound();
  return (
    <>
      <AdminHeader title={`${design.code} · ${design.name}`}>
        <Link href={`/design/${design.code}`} className={btnSecondary} target="_blank">View live ↗</Link>
      </AdminHeader>
      {saved && <p className="mb-4 rounded-xl bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-3 text-sm font-medium">Saved.</p>}
      <DesignForm design={design} files={design.files} tags={design.tags.map((t) => t.tag)} />
    </>
  );
}
