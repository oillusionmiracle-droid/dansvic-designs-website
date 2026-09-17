"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { DesignCard as DesignCardType } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import { spring } from "@/components/motion/Reveal";

const ratios = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[5/6]", "aspect-[4/5]", "aspect-[2/3]"];

export function DesignCard({ design, index = 0, masonry = true }: { design: DesignCardType; index?: number; masonry?: boolean }) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const ratio = masonry ? ratios[index % ratios.length] : "aspect-[4/5]";
  const alt = design.secondaryPreviewUrl;

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 30, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: spring } }}
      className="group relative"
    >
      <Link
        href={`/design/${design.code}`}
        className="block rounded-xl3 overflow-hidden bg-surface-2 shadow-soft focus-visible:outline-offset-4"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <div className={`relative ${ratio} overflow-hidden bg-surface-3`}>
          <motion.div
            className="absolute inset-0"
            animate={reduce ? {} : hover ? { scale: 1.08, x: 6, y: -4 } : { scale: 1, x: 0, y: 0 }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={design.previewImageUrl}
              alt={design.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
          {alt && (
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image src={alt} alt="" fill sizes="25vw" className="object-cover" />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="glass rounded-full px-2.5 py-1 text-xs font-bold tracking-wide text-ink">{design.code}</span>
            {design.isFeatured && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-fg">Featured</span>
            )}
          </div>
          {design.isFree && (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-black">FREE</span>
          )}
          <motion.div
            className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2"
            initial={false}
            animate={{ y: hover ? 0 : 6, opacity: hover ? 1 : 0.95 }}
            transition={spring}
          >
            <div className="flex gap-1.5 flex-wrap">
              {design.formats.slice(0, 3).map((f) => (
                <span key={f} className="rounded-md bg-white/15 backdrop-blur px-2 py-0.5 text-[11px] font-bold text-white border border-white/20">
                  {f}
                </span>
              ))}
            </div>
            <motion.span
              animate={{ scale: hover ? 1 : 0.9, opacity: hover ? 1 : 0 }}
              transition={spring}
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-fg shadow-lift"
              aria-hidden
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-snug text-[17px] line-clamp-2">{design.name}</h3>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-sm text-ink-3">
            <span className="capitalize">
              {design.type} · {design.category}
            </span>
            <span className="inline-flex items-center gap-2 tabular-nums">
              <span title="Downloads">↓ {formatNumber(design.downloadCount)}</span>
              <span title="Views">◉ {formatNumber(design.viewCount)}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
