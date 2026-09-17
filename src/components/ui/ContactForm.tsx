"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { INQUIRY_TYPES } from "@/lib/constants";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", inquiryType: "general", message: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setState(res.ok ? "done" : "error");
  }
  const field = "mt-1.5 w-full rounded-2xl border border-line bg-surface-2 px-4 text-base";
  if (state === "done")
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl3 bg-accent/10 border border-accent/30 p-10 text-center">
        <p className="text-3xl">✦</p>
        <h2 className="mt-2 text-2xl font-bold">Message sent</h2>
        <p className="mt-2 text-ink-3">Thanks {form.name.split(" ")[0]} — we’ll reply to {form.email} soon.</p>
      </motion.div>
    );
  return (
    <form onSubmit={submit} className="rounded-xl3 bg-surface-2 border border-line p-6 md:p-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-sm font-semibold">Name</label>
          <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${field} h-12`} />
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-semibold">Email</label>
          <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${field} h-12`} />
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-semibold">What is this about?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {INQUIRY_TYPES.map((t) => (
            <label key={t.value} className={`cursor-pointer rounded-2xl border px-4 py-3 text-[15px] font-medium ${form.inquiryType === t.value ? "border-accent bg-accent/10 text-accent" : "border-line hover:bg-surface-3"}`}>
              <input type="radio" name="inquiryType" value={t.value} checked={form.inquiryType === t.value} onChange={() => setForm({ ...form, inquiryType: t.value })} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="c-msg" className="text-sm font-semibold">Message</label>
        <textarea id="c-msg" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${field} py-3`} />
      </div>
      {state === "error" && <p className="text-sm text-red-600">Couldn’t send — please try again.</p>}
      <Button type="submit" size="lg" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
