import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1600px] px-4 md:px-6", className)}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent mb-2">{eyebrow}</p>}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-ink-3 max-w-xl text-lg">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 font-semibold text-accent hover:underline underline-offset-4">
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <Container className="pt-12 md:pt-20 pb-8">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent mb-3">{eyebrow}</p>}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">{title}</h1>
      {description && <p className="mt-4 text-lg md:text-xl text-ink-3 max-w-2xl">{description}</p>}
      {children}
    </Container>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-surface-3 px-2.5 py-1 text-xs font-semibold tracking-wide", className)}>
      {children}
    </span>
  );
}

export function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-amber-500", size)} aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "" : "opacity-25"} aria-hidden>★</span>
      ))}
    </span>
  );
}
