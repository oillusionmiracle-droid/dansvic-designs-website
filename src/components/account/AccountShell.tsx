import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/account", label: "Profile" },
  { href: "/account/downloads", label: "Download History" },
  { href: "/account/saved", label: "Saved Designs" },
];

export function AccountShell({ active, title, children }: { active: string; title: string; children: React.ReactNode }) {
  return (
    <Container className="pt-12 md:pt-16 pb-10">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent mb-2">My Account</p>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
      <nav className="mt-8 flex gap-2 overflow-x-auto no-scrollbar" aria-label="Account sections">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn("rounded-full px-4 py-2 text-[15px] font-semibold whitespace-nowrap border", active === t.href ? "bg-accent text-accent-fg border-accent" : "border-line bg-surface-2 hover:bg-surface-3")}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </Container>
  );
}
