"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { spring } from "@/components/motion/Reveal";
import { slugifyCategory } from "@/lib/constants";

type Props = {
  content: Record<string, string>;
  categories: { category: string; type: string; count: number }[];
  previews: string[];
};

export function Hero({ content, categories, previews }: Props) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/hero.jpg" alt="" fill priority className="object-cover opacity-30 dark:opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/80 to-surface" />
      </div>
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 pt-14 md:pt-24 pb-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-accent"
          >
            {content.hero_eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.08 }}
            className="mt-4 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            {content.hero_title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg md:text-xl text-ink-2 font-serif"
          >
            {content.hero_subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/free-downloads" size="lg">{content.hero_cta_primary}</ButtonLink>
            <ButtonLink href="/designs" size="lg" variant="secondary">{content.hero_cta_secondary}</ButtonLink>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-2"
            aria-label="Browse by category"
          >
            {categories.slice(0, 9).map((c) => (
              <Link
                key={`${c.type}-${c.category}`}
                href={`/categories/${slugifyCategory(c.category)}?type=${c.type}`}
                className="rounded-full border border-line bg-surface-2/70 backdrop-blur px-3.5 py-1.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                {c.category} <span className="text-ink-3">{c.count}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]" aria-hidden>
          {previews.slice(0, 5).map((src, i) => {
            const pos = [
              "left-[4%] top-[6%] w-[46%] aspect-[4/5]",
              "right-[2%] top-[0%] w-[42%] aspect-[3/4]",
              "left-[18%] bottom-[2%] w-[40%] aspect-square",
              "right-[8%] bottom-[8%] w-[36%] aspect-[4/5]",
              "left-[44%] top-[34%] w-[26%] aspect-[3/4]",
            ][i];
            return (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 4 : -4 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                transition={{ ...spring, delay: 0.15 + i * 0.1 }}
                className={`absolute ${pos} rounded-xl3 overflow-hidden shadow-lift ring-1 ring-line`}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={reduce ? {} : { y: [0, i % 2 ? -10 : 10, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src={src} alt="" fill sizes="30vw" className="object-cover" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
