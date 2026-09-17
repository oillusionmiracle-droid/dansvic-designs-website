import { desc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { AdminHeader, btnDanger, btnPrimary, Card, Field, input, textarea } from "@/components/admin/ui";
import { deleteTestimonial, saveTestimonial } from "../actions";

export default async function TestimonialsAdmin() {
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  return (
    <>
      <AdminHeader title="Testimonials" />
      <div className="grid gap-5">
        <Card>
          <h2 className="font-bold mb-3">Add testimonial</h2>
          <TForm />
        </Card>
        {rows.map((t) => (
          <Card key={t.id}>
            <TForm t={t} />
          </Card>
        ))}
      </div>
    </>
  );
}

function TForm({ t }: { t?: typeof testimonials.$inferSelect }) {
  return (
    <form action={saveTestimonial} className="grid gap-3 sm:grid-cols-[1fr_1fr_100px]">
      {t && <input type="hidden" name="id" value={t.id} />}
      <Field label="Name"><input name="name" required defaultValue={t?.name} className={input} /></Field>
      <Field label="Title / location"><input name="title" defaultValue={t?.title ?? ""} className={input} /></Field>
      <Field label="Rating"><input name="rating" type="number" min={1} max={5} defaultValue={t?.rating ?? 5} className={input} /></Field>
      <Field label="Quote" className="sm:col-span-3"><textarea name="body" required rows={3} defaultValue={t?.body} className={textarea} /></Field>
      <div className="sm:col-span-3 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" defaultChecked={t ? t.isPublished : true} className="h-4 w-4" /> Published</label>
        <button className={btnPrimary}>{t ? "Save" : "Add"}</button>
        {t && <button formAction={deleteTestimonial.bind(null, t.id)} className={btnDanger}>Delete</button>}
      </div>
    </form>
  );
}
