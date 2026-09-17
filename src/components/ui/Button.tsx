"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";
const sizes = { md: "h-11 px-5 text-[15px]", lg: "h-13 px-7 text-base min-h-[52px]", sm: "h-9 px-4 text-sm" };
const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:brightness-110 shadow-soft",
  secondary: "bg-surface-2 text-ink border border-line hover:bg-surface-3",
  ghost: "text-ink hover:bg-surface-3",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const tap = { whileTap: { scale: 0.96 }, transition: { type: "spring", stiffness: 500, damping: 30 } } as const;

type BtnProps = HTMLMotionProps<"button"> & { variant?: Variant; size?: keyof typeof sizes };
export function Button({ variant = "primary", size = "md", className, ...props }: BtnProps) {
  return <motion.button {...tap} className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span {...tap} className="inline-flex">
      <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
        {children}
      </Link>
    </motion.span>
  );
}
