import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tracker } from "@/components/analytics/Tracker";
import { getCurrentUser } from "@/lib/auth";
import { getActiveAnnouncement } from "@/lib/content";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Embroidery & Print Designs`, template: `%s · ${SITE.name}` },
  description:
    "Free embroidery and print design files for Agbada, Danshiki, Aso-Oke, caps, tees and more. Crafted in Lagos for fashion designers worldwide.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0e" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [user, announcement] = await Promise.all([getCurrentUser(), getActiveAnnouncement()]);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col antialiased">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
          >
            Skip to content
          </a>
          <Navbar user={user ? { name: user.name, role: user.role } : null} announcement={announcement ?? null} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Tracker />
        </Providers>
      </body>
    </html>
  );
}
