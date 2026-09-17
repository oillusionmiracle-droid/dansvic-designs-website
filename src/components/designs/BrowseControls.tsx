"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { snappy } from "@/components/motion/Reveal";

type Props = {
  categories: string[];
  formats: string[];
  lockType?: boolean;
  total: number;
};

export function BrowseControls({ categories, formats, lockType, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(sp.get("q") ?? "");

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [sp, router, pathname],
  );

  const sort = sp.get("sort") ?? "newest";
  const category = sp.get("category") ?? "";
  const format = sp.get("format") ?? "";
  const popularity = sp.get("popularity") ?? "";
  const type = sp.get("type") ?? "";
  const activeCount = [category, format, popularity, !lockType && type].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: q || null });
          }}
          className="relative flex-1"
          role="search"
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden>⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, code (DD-0001) or tag…"
            aria-label="Search designs"
            className="h-12 w-full rounded-full border border-line bg-surface-2 pl-11 pr-24 text-base shadow-soft"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 h-9 rounded-full bg-accent px-4 text-sm font-semibold text-accent-fg">
            Search
          </button>
        </form>
        <div className="flex gap-2 items-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={snappy}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn(
              "h-12 rounded-full border px-5 font-semibold inline-flex items-center gap-2",
              open || activeCount ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface-2",
            )}
          >
            Filters {activeCount > 0 && <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs text-accent-fg">{activeCount}</span>}
          </motion.button>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => set({ sort: e.target.value })}
            className="h-12 rounded-full border border-line bg-surface-2 px-4 font-semibold"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={snappy}
            className="overflow-hidden"
          >
            <div className="rounded-xl3 border border-line bg-surface-2 p-5 grid gap-5 md:grid-cols-3">
              {!lockType && (
                <Group label="Type">
                  <Chip active={!type} onClick={() => set({ type: null, category: null })}>All</Chip>
                  <Chip active={type === "embroidery"} onClick={() => set({ type: "embroidery", category: null })}>Embroidery</Chip>
                  <Chip active={type === "print"} onClick={() => set({ type: "print", category: null })}>Print</Chip>
                </Group>
              )}
              <Group label="Category">
                <Chip active={!category} onClick={() => set({ category: null })}>All</Chip>
                {categories.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => set({ category: c })}>{c}</Chip>
                ))}
              </Group>
              <Group label="File format">
                <Chip active={!format} onClick={() => set({ format: null })}>Any</Chip>
                {formats.map((f) => (
                  <Chip key={f} active={format === f} onClick={() => set({ format: f })}>{f}</Chip>
                ))}
              </Group>
              <Group label="Popularity">
                <Chip active={!popularity} onClick={() => set({ popularity: null })}>Everything</Chip>
                <Chip active={popularity === "top"} onClick={() => set({ popularity: "top" })}>Top downloads</Chip>
                <Chip active={popularity === "trending"} onClick={() => set({ popularity: "trending" })}>Trending views</Chip>
              </Group>
              {activeCount > 0 && (
                <div className="md:col-span-3">
                  <button type="button" onClick={() => set({ category: null, format: null, popularity: null, type: lockType ? type : null })} className="text-sm font-semibold text-accent underline underline-offset-4">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-sm text-ink-3" aria-live="polite">
        {pending ? "Updating…" : `${total} design${total === 1 ? "" : "s"}`}
        {sp.get("q") && (
          <>
            {" "}for “{sp.get("q")}”{" "}
            <button type="button" className="text-accent font-semibold ml-1" onClick={() => { setQ(""); set({ q: null }); }}>Clear</button>
          </>
        )}
      </p>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-3 mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={snappy}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors",
        active ? "bg-accent text-accent-fg border-accent" : "bg-surface border-line hover:bg-surface-3",
      )}
    >
      {children}
    </motion.button>
  );
}
