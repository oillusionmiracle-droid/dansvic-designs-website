import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrivacyChoices } from "@/components/analytics/PrivacyChoices";
import { Tracker } from "@/components/analytics/Tracker";
import { getCurrentUser } from "@/lib/auth";
import { getActiveAnnouncement } from "@/lib/content";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://dansvic-designs-website-eight.vercel.app"),
  openGraph: { type: "website", siteName: "Dansvic Designs", title: "Dansvic Designs — Tradition, in every thread.", description: "Embroidery, monogramming and print artwork for your next creation.", images: [{url:"/opengraph-image",width:1200,height:630}] },
  twitter: {card:"summary_large_image", title:"Dansvic Designs",description:"Tradition, in every thread.",images:["/opengraph-image"]},
  title: { default: `${SITE.name} — Embroidery & Print Designs`, template: `%s · ${SITE.name}` },
  description:
    "Explore embroidery, monogramming and print artwork for Agbada, Danshiki, Aso-Oke, caps and tees. Custom design enquiries welcome.",
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
          <Tracker /><PrivacyChoices />
        </Providers>
      </body>
    </html>
  );
}
