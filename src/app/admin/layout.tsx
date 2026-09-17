import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/account");
  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-6 py-8 grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 self-start">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-2">Admin</p>
        <AdminNav />
        <Link href="/" className="mt-6 block text-sm text-ink-3 hover:text-ink">← Back to site</Link>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
