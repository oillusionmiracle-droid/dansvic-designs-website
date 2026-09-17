import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, designs, profiles, reports } from "@/db/schema";
import { AdminHeader, Card } from "@/components/admin/ui";
import { INQUIRY_TYPES, REPORT_REASONS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { setMessageStatus, setReportStatus } from "../actions";

export default async function Inbox() {
  const [reps, msgs] = await Promise.all([
    db.select({ r: reports, code: designs.code, name: designs.name, user: profiles.name, email: profiles.email }).from(reports).innerJoin(designs, eq(designs.id, reports.designId)).innerJoin(profiles, eq(profiles.id, reports.userId)).orderBy(desc(reports.createdAt)).limit(100),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(100),
  ]);
  return (
    <>
      <AdminHeader title="Reports & Messages" />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-0">
          <h2 className="font-bold p-4 border-b border-line">Design reports ({reps.filter((x) => x.r.status === "open").length} open)</h2>
          <ul className="divide-y divide-line">
            {reps.length === 0 && <li className="p-4 text-ink-3">No reports.</li>}
            {reps.map(({ r, code, name, user, email }) => (
              <li key={r.id} className="p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold"><Link href={`/design/${code}`} className="hover:text-accent">{code} · {name}</Link></p>
                  <form action={setReportStatus.bind(null, r.id, r.status === "open" ? "resolved" : "open")}>
                    <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "open" ? "bg-amber-500/15 text-amber-700" : "bg-green-500/15 text-green-700"}`}>{r.status} ⇄</button>
                  </form>
                </div>
                <p className="text-ink-3">{REPORT_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason} · {user} ({email}) · {formatDate(r.createdAt)}</p>
                <p className="mt-1">{r.details}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-0">
          <h2 className="font-bold p-4 border-b border-line">Contact messages</h2>
          <ul className="divide-y divide-line">
            {msgs.length === 0 && <li className="p-4 text-ink-3">No messages.</li>}
            {msgs.map((m) => (
              <li key={m.id} className="p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{m.name} <span className="font-normal text-ink-3">· {m.email}</span></p>
                  <form action={setMessageStatus.bind(null, m.id, m.status === "new" ? "handled" : "new")}>
                    <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.status === "new" ? "bg-accent/15 text-accent" : "bg-surface-3 text-ink-3"}`}>{m.status} ⇄</button>
                  </form>
                </div>
                <p className="text-ink-3"><span className="rounded bg-surface-3 px-1.5 py-0.5 font-semibold">{INQUIRY_TYPES.find((t) => t.value === m.inquiryType)?.label ?? m.inquiryType}</span> · {formatDate(m.createdAt)}</p>
                <p className="mt-1 whitespace-pre-line">{m.message}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
