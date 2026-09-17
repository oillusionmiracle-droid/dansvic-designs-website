"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  ["/admin", "Analytics"],
  ["/admin/designs", "Designs"],
  ["/admin/users", "Users"],
  ["/admin/content", "Homepage & Banners"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/faq", "FAQ"],
  ["/admin/blog", "Blog"],
  ["/admin/inbox", "Reports & Messages"],
];

export function AdminNav() {
  const p = usePathname();
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="Admin">
      {items.map(([href, label]) => {
        const active = href === "/admin" ? p === href : p.startsWith(href);
        return (
          <Link key={href} href={href} className={cn("rounded-xl px-3 py-2 text-[15px] font-medium whitespace-nowrap", active ? "bg-accent text-accent-fg" : "hover:bg-surface-3")}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
