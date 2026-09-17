"use client";
import { motion } from "framer-motion";
import type { DesignCard as DesignCardType } from "@/lib/catalog";
import { DesignCard } from "./DesignCard";

export function DesignGrid({
  designs,
  masonry = true,
  emptyMessage = "No designs match yet. Try a different filter.",
}: {
  designs: DesignCardType[];
  masonry?: boolean;
  emptyMessage?: string;
}) {
  if (!designs.length)
    return (
      <div className="rounded-xl3 border border-dashed border-line bg-surface-2 p-14 text-center text-ink-3 text-lg">{emptyMessage}</div>
    );
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className={masonry ? "masonry" : "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}
    >
      {designs.map((d, i) => (
        <DesignCard key={d.id} design={d} index={i} masonry={masonry} />
      ))}
    </motion.div>
  );
}

/** Horizontal scroll rail used on the homepage. */
export function DesignRail({ designs }: { designs: DesignCardType[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2"
    >
      {designs.map((d, i) => (
        <div key={d.id} className="snap-start shrink-0 w-[78vw] sm:w-[320px]">
          <DesignCard design={d} index={i} masonry={false} />
        </div>
      ))}
    </motion.div>
  );
}
