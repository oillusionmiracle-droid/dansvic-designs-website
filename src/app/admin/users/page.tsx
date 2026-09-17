import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { downloads, profiles } from "@/db/schema";
import { AdminHeader, btnSecondary, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { setUserDisabled, setUserRole } from "../actions";

export default async function AdminUsers() {
  const rows = await db
    .select({ id: profiles.id, name: profiles.name, email: profiles.email, role: profiles.role, isDisabled: profiles.isDisabled, createdAt: profiles.createdAt, downloads: sql<number>`count(${downloads.id})::int`, last: sql<Date | null>`max(${downloads.downloadedAt})` })
    .from(profiles)
    .leftJoin(downloads, eq(downloads.userId, profiles.id))
    .groupBy(profiles.id)
    .orderBy(desc(profiles.createdAt));
  return (
    <>
      <AdminHeader title={`Users (${rows.length})`} />
      <Card className="mb-4 text-sm text-ink-3">
        <strong className="text-ink">Granting admin:</strong> use “Make admin” below, or run{" "}
        <code className="rounded bg-surface-3 px-1.5 py-0.5">UPDATE profiles SET role=&apos;admin&apos; WHERE email=&apos;you@example.com&apos;;</code> directly in the database.
      </Card>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-ink-3 border-b border-line"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Downloads</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((u) => (
              <tr key={u.id} className={u.isDisabled ? "opacity-60" : ""}>
                <td className="p-3"><p className="font-semibold">{u.name}</p><p className="text-ink-3">{u.email}</p></td>
                <td className="p-3">
                  <form action={setUserRole.bind(null, u.id, u.role === "admin" ? "customer" : "admin")}>
                    <button className="rounded-full bg-surface-3 px-2.5 py-1 text-xs font-semibold capitalize" title="Toggle role">{u.role} ⇄</button>
                  </form>
                </td>
                <td className="p-3 tabular-nums">{u.downloads}{u.last && <span className="block text-ink-3">last {formatDate(u.last)}</span>}</td>
                <td className="p-3">{formatDate(u.createdAt)}</td>
                <td className="p-3">
                  <form action={setUserDisabled.bind(null, u.id, !u.isDisabled)}>
                    <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.isDisabled ? "bg-red-500/15 text-red-600" : "bg-green-500/15 text-green-700 dark:text-green-400"}`}>{u.isDisabled ? "Disabled — enable" : "Active — disable"}</button>
                  </form>
                </td>
                <td className="p-3 text-right"><Link href={`/admin/users/${u.id}`} className={btnSecondary}>Activity</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
