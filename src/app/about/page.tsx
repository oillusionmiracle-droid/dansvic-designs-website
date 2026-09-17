import type { Metadata } from "next";
import Image from "next/image";
import { Container, PageHero } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Everyone deserves to look unique and special." />
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
        <Reveal>
          <article className="prose-dd font-serif">
            <p>
              Dansvic Designs began in 2020 in Festac Town, Lagos, out of a simple passion for embroidery — the quiet
              satisfaction of watching thread turn plain fabric into something personal. What started as late-night
              experiments on a single machine grew, stitch by stitch, into a body of work friends and clients kept asking for.
            </p>
            <p>
              In 2021 we became a formal brand, built on one idea: <strong>everyone deserves to look unique and special.</strong>{" "}
              A well-placed monogram, a bold Agbada neckline, a subtle flap-and-pocket detail — these are the touches that
              make a garment yours and nobody else’s.
            </p>
            <h2>Our mission</h2>
            <p>
              Fashion should tell a personal story. We create embroidery, monogramming and print designs that help fashion
              designers and enthusiasts anywhere in the world say something with what they wear — and we give the files
              away free, so the only limit is your imagination.
            </p>
            <h2>What we make</h2>
            <ul>
              <li><strong>Embroidery designs</strong> — production-ready EMB, DST and DSB files for Agbada, Flap & Pocket, Danshiki, Aso-Oke, caps and t-shirts, each with dimensions, stitch and colour counts.</li>
              <li><strong>Print designs</strong> — clean CDR and PDF artwork for caps, t-shirts and trousers.</li>
              <li><strong>Custom monogramming</strong> — bespoke lettering and crests, on request.</li>
            </ul>
            <h2>How we work</h2>
            <p>
              New designs are released several times a week. Every file is tested before it’s published, and if something
              doesn’t stitch out the way it should, you can report it from the design page and we’ll fix it.
            </p>
          </article>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/designs" size="lg">See My Designs</ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">Talk to us</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-xl3 overflow-hidden col-span-2"><Image src="/images/hero.jpg" alt="Embroidery in progress" fill sizes="50vw" className="object-cover" /></div>
            <div className="relative aspect-square rounded-xl3 overflow-hidden"><Image src="/images/designs/agbada.jpg" alt="Agbada embroidery" fill sizes="25vw" className="object-cover" /></div>
            <div className="relative aspect-square rounded-xl3 overflow-hidden"><Image src="/images/designs/cap.jpg" alt="Embroidered cap" fill sizes="25vw" className="object-cover" /></div>
          </div>
          <div className="mt-6 rounded-xl3 bg-surface-2 border border-line p-6">
            <h3 className="font-bold text-lg">Find us</h3>
            <p className="mt-2 text-ink-3">{SITE.address}</p>
            <p className="text-ink-3"><a href={`mailto:${SITE.email}`} className="hover:text-ink">{SITE.email}</a></p>
            <p className="text-ink-3"><a href={SITE.whatsapp} className="hover:text-ink">WhatsApp {SITE.phoneDisplay}</a></p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
