"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type Props = {
  user: { name: string; role: string } | null;
  announcement: { message: string; linkUrl: string | null; linkLabel: string | null } | null;
};

const links = [
  { href: "/designs", label: "All Designs" },
  { href: "/embroidery", label: "Embroidery" },
  { href: "/print", label: "Print" },
  { href: "/categories", label: "Categories" },
  { href: "/free-downloads", label: "Free" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

export function Navbar({ user, announcement }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/designs?q=${encodeURIComponent(q)}`);
  };

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50">
      {announcement && (
        <div className="bg-accent text-accent-fg text-center text-sm font-medium px-4 py-2">
          {announcement.message}{" "}
          {announcement.linkUrl && (
            <Link href={announcement.linkUrl} className="underline underline-offset-4 ml-1">
              {announcement.linkLabel ?? "Learn more"}
            </Link>
          )}
        </div>
      )}
      <div className="glass border-b border-line">
        <div className="mx-auto flex h-16 md:h-[72px] max-w-[1600px] items-center gap-3 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Dansvic Designs home">
            <Logo className="h-9 w-9" />
            <span className="hidden sm:block font-bold tracking-tight text-lg">Dansvic Designs</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Primary">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                    active ? "text-ink" : "text-ink-3 hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-surface-3"
                      transition={spring}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <form onSubmit={submit} role="search" className="ml-auto hidden md:flex flex-1 max-w-md">
            <label className="sr-only" htmlFor="nav-search">
              Search designs
            </label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden>
                ⌕
              </span>
              <input
                id="nav-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search designs, codes, tags…"
                className="h-11 w-full rounded-full border border-line bg-surface-3/60 pl-10 pr-4 text-[15px] placeholder:text-ink-3 focus:bg-surface-2 transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenu((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menu}
                  className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-fg font-bold"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, scale: 0.92, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={spring}
                      style={{ transformOrigin: "top right" }}
                      className="glass absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line p-1.5 shadow-lift"
                    >
                      <div className="px-3 py-2 text-sm text-ink-3">Signed in as <span className="text-ink font-medium">{user.name}</span></div>
                      {[
                        { href: "/account", label: "My Account" },
                        { href: "/account/downloads", label: "Download History" },
                        { href: "/account/saved", label: "Saved Designs" },
                        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Panel" }] : []),
                      ].map((i) => (
                        <Link key={i.href} href={i.href} role="menuitem" className="block rounded-xl px-3 py-2.5 text-[15px] hover:bg-surface-3">
                          {i.label}
                        </Link>
                      ))}
                      <button type="button" role="menuitem" onClick={logout} className="w-full text-left rounded-xl px-3 py-2.5 text-[15px] text-red-600 dark:text-red-400 hover:bg-surface-3">
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex h-10 items-center rounded-full px-4 text-[15px] font-medium hover:bg-surface-3">
                  Log in
                </Link>
                <Link href="/register" className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-[15px] font-semibold text-accent-fg hover:brightness-110">
                  Sign up
                </Link>
              </>
            )}
            <button
              type="button"
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-2"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="text-xl leading-none" aria-hidden>{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={spring}
              className="lg:hidden overflow-hidden border-t border-line"
            >
              <div className="px-4 py-4 space-y-1">
                <form onSubmit={submit} role="search" className="mb-3 md:hidden">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search designs…"
                    aria-label="Search designs"
                    className="h-12 w-full rounded-full border border-line bg-surface-3/60 px-5 text-base"
                  />
                </form>
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-surface-3">
                    {l.label}
                  </Link>
                ))}
                {!user && (
                  <Link href="/login" className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-surface-3">
                    Log in
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
