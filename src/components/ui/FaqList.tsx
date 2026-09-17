"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { snappy } from "@/components/motion/Reveal";

export function FaqList({ items }: { items: { id: string; q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <ul className="divide-y divide-line rounded-xl3 border border-line bg-surface-2">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : it.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-${it.id}`}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold hover:bg-surface-3/60"
            >
              {it.q}
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={snappy} className="text-2xl text-accent" aria-hidden>+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`faq-${it.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={snappy} className="overflow-hidden">
                  <p className="px-6 pb-6 font-serif text-ink-2 text-lg leading-relaxed whitespace-pre-line">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
