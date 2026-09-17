import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/lib/constants";

const cols = [
  {
    title: "Browse",
    links: [
      ["All Designs", "/designs"],
      ["Embroidery Designs", "/embroidery"],
      ["Print Designs", "/print"],
      ["Categories", "/categories"],
      ["Free Downloads", "/free-downloads"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Blog", "/blog"],
      ["Testimonials", "/testimonials"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms & Conditions", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Copyright Policy", "/copyright"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 mt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-bold text-lg tracking-tight">Dansvic Designs</span>
          </div>
          <p className="mt-4 max-w-sm text-ink-3">
            Embroidery, monogramming and print design illustration for attire. Made in {SITE.address}, for
            fashion lovers everywhere.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(SITE.socials).map(([k, v]) => (
              <a
                key={k}
                href={v}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium capitalize hover:bg-surface-3"
              >
                {k}
              </a>
            ))}
          </div>
          <div className="mt-5 text-sm text-ink-3 space-y-1">
            <p>
              <a href={`mailto:${SITE.email}`} className="hover:text-ink">{SITE.email}</a>
            </p>
            <p>
              <a href={SITE.whatsapp} className="hover:text-ink">WhatsApp {SITE.phoneDisplay}</a>
            </p>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-semibold mb-3">{c.title}</h3>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-ink-3 hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 py-5 text-sm text-ink-3 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Dansvic Designs. All rights reserved.</span>
          <span>Designs are for use on fabric & garments only.</span>
        </div>
      </div>
    </footer>
  );
}
