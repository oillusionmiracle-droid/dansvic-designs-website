import { getFaqs } from "@/lib/content";
import type { FaqItem } from "@/db/schema";
import { AdminHeader, btnDanger, btnPrimary, Card, Field, input, textarea } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "../actions";

export default async function FaqAdmin() {
  const rows = await getFaqs();
  return (
    <>
      <AdminHeader title="FAQ" />
      <div className="grid gap-5">
        <Card><h2 className="font-bold mb-3">Add question</h2><FForm order={rows.length + 1} /></Card>
        {rows.map((f) => <Card key={f.id}><FForm f={f} order={f.displayOrder} /></Card>)}
      </div>
    </>
  );
}

function FForm({ f, order }: { f?: FaqItem; order: number }) {
  return (
    <form action={saveFaq} className="grid gap-3 sm:grid-cols-[1fr_90px]">
      {f && <input type="hidden" name="id" value={f.id} />}
      <Field label="Question"><input name="question" required defaultValue={f?.question} className={input} /></Field>
      <Field label="Order"><input name="displayOrder" type="number" defaultValue={order} className={input} /></Field>
      <Field label="Answer" className="sm:col-span-2"><textarea name="answer" required rows={3} defaultValue={f?.answer} className={textarea} /></Field>
      <div className="sm:col-span-2 flex gap-3">
        <button className={btnPrimary}>{f ? "Save" : "Add"}</button>
        {f && <button formAction={deleteFaq.bind(null, f.id)} className={btnDanger}>Delete</button>}
      </div>
    </form>
  );
}
