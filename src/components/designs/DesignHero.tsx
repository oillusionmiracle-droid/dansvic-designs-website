"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function DesignHero({ image, secondary, name }: { image: string; secondary: string | null; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  return (
    <div ref={ref} className="relative h-[62vh] min-h-[420px] md:h-[78vh] overflow-hidden bg-surface-3">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={image} alt={name} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        {secondary && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 14, times: [0, 0.5, 0.58, 0.92, 1], repeat: Infinity, repeatDelay: 2 }}
          >
            <Image src={secondary} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-surface" />
    </div>
  );
}
