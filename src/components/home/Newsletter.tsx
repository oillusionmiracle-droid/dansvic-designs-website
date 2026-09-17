"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Newsletter({ title, subtitle }: { title: string; subtitle: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }), headers: { "Content-Type": "application/json" } });
    setState(res.ok ? "done" : "error");
  }
  return (
    <div className="relative overflow-hidden rounded-xl3 bg-brand-600 text-white px-6 py-12 md:px-14 md:py-16">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="relative grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-white/80 text-lg font-serif">{subtitle}</p>
        </div>
        {state === "done" ? (
          <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-lg font-semibold">
            You’re on the list. Welcome to Dansvic Designs ✦
          </motion.p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="nl-email">Email address</label>
            <input
              id="nl-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-13 min-h-[52px] flex-1 rounded-full bg-white/15 border border-white/25 px-5 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button type="submit" size="lg" disabled={state === "loading"} className="!bg-white !text-brand-700 hover:!bg-brand-50">
              {state === "loading" ? "Joining…" : "Subscribe"}
            </Button>
            {state === "error" && <p className="text-sm text-white/80 sm:col-span-2">Please try again in a moment.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
