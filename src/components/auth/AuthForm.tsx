"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { spring } from "@/components/motion/Reveal";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/designs";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    router.refresh();
    router.push(next);
  }

  const field = "mt-1.5 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-base focus:bg-surface-2";
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring} className="glass rounded-xl3 border border-line shadow-lift p-7 md:p-9">
        <Logo className="h-11 w-11" />
        <h1 className="mt-5 text-3xl font-bold tracking-tight">{mode === "login" ? "Welcome back" : "Create your free account"}</h1>
        <p className="mt-2 text-ink-3">
          {mode === "login" ? "Log in to download designs and see your history." : "Unlimited free downloads, saved designs and re-downloads — forever."}
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="text-sm font-semibold">Full name</label>
              <input id="name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">Password</label>
            <input id="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={field} />
            {mode === "register" && <p className="mt-1 text-xs text-ink-3">At least 8 characters.</p>}
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 text-sm font-medium">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "One moment…" : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-3">
          {mode === "login" ? (
            <>New here? <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-accent">Create an account</Link></>
          ) : (
            <>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent">Log in</Link></>
          )}
        </p>
        <p className="mt-4 text-center text-xs text-ink-3">By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </motion.div>
    </div>
  );
}
