import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui/Section";
import { ContactForm } from "@/components/ui/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact us" description="Tell us what you need and we'll route it to the right person." />
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <aside className="space-y-4">
          {[
            ["Email", SITE.email, `mailto:${SITE.email}`],
            ["WhatsApp / Phone", SITE.phoneDisplay, SITE.whatsapp],
            ["Studio", SITE.address, undefined],
          ].map(([k, v, href]) => (
            <div key={k} className="rounded-xl3 bg-surface-2 border border-line p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">{k}</p>
              {href ? <a href={href} className="mt-1 block text-lg font-semibold hover:text-accent">{v}</a> : <p className="mt-1 text-lg font-semibold">{v}</p>}
            </div>
          ))}
          <div className="rounded-xl3 bg-surface-2 border border-line p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Follow</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(SITE.socials).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium capitalize hover:bg-surface-3">{k}</a>
              ))}
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
