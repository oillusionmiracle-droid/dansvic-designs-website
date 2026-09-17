import Link from "next/link";
import { browseDesigns, getCategoryCounts } from "@/lib/catalog";
import { getPublishedTestimonials, getSiteContent } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TestimonialCards } from "@/components/home/TestimonialCards";
import { DesignGrid, DesignRail } from "@/components/designs/DesignGrid";
import { Container, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, categories, featured, newest, popular, embroidery, print, free, testimonials] = await Promise.all([
    getSiteContent(),
    getCategoryCounts(),
    browseDesigns({ featured: true, sort: "downloads", limit: 8 }),
    browseDesigns({ sort: "newest", limit: 8 }),
    browseDesigns({ sort: "popular", limit: 8 }),
    browseDesigns({ type: "embroidery", sort: "popular", limit: 6 }),
    browseDesigns({ type: "print", sort: "popular", limit: 6 }),
    browseDesigns({ free: true, sort: "downloads", limit: 8 }),
    getPublishedTestimonials(6),
  ]);
  const featuredList = featured.length ? featured : popular;

  return (
    <>
      <Hero content={content} categories={categories} previews={featuredList.map((d) => d.previewImageUrl)} />

      {content.banner_text && (
        <Container className="mt-6">
          <Link href={content.banner_link || "/designs"} className="block rounded-xl3 bg-brand-600 text-white px-6 py-5 text-lg font-semibold text-center hover:brightness-110">
            {content.banner_text}
          </Link>
        </Container>
      )}

      <Container className="mt-20 space-y-24">
        <section aria-labelledby="featured">
          <SectionHeader eyebrow="Curated" title="Featured Designs" description="Hand-picked from our most downloaded and most viewed work." href="/designs?sort=downloads" />
          <DesignGrid designs={featuredList} />
        </section>

        <section aria-labelledby="new">
          <SectionHeader eyebrow="Fresh off the hoop" title="New Designs" description="New files land several times a week." href="/designs?sort=newest" />
          <DesignRail designs={newest} />
        </section>

        <section>
          <SectionHeader eyebrow="Trending" title="Popular Designs" description="What designers around the world are stitching right now." href="/designs?sort=popular" />
          <DesignRail designs={popular} />
        </section>

        <section>
          <SectionHeader eyebrow="Machine files · EMB, DST, DSB" title="Embroidery Designs" description="Agbada, Danshiki, Aso-Oke, caps, tees and flap & pocket details." href="/embroidery" />
          <DesignGrid designs={embroidery} />
        </section>

        <section>
          <SectionHeader eyebrow="Vector files · CDR, PDF" title="Print Designs" description="Ready-to-print artwork for caps, t-shirts and trousers." href="/print" />
          <DesignGrid designs={print} />
        </section>

        <section>
          <Reveal>
            <div className="rounded-xl3 border border-line bg-surface-2 p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent mb-2">No limits, ever</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Free Downloads</h2>
                <p className="mt-2 text-ink-3 text-lg max-w-xl">
                  Every design is free right now. Create an account, download every format, and re-download any time from your history.
                </p>
              </div>
              <ButtonLink href="/free-downloads" size="lg">Download Free Designs</ButtonLink>
            </div>
          </Reveal>
          <div className="mt-8">
            <DesignRail designs={free} />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Browse" title="Categories" description="Find the right design for the garment in front of you." href="/categories" linkLabel="All categories" />
          <CategoryGrid categories={categories} />
        </section>

        <section>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent mb-2">About</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Dansvic Designs</h2>
                <p className="mt-4 font-serif text-xl leading-relaxed text-ink-2">{content.about_blurb}</p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink-3">
                  Our mission is simple: fashion should tell a personal story — through embroidery, monogramming and thoughtful design.
                </p>
                <div className="mt-6">
                  <ButtonLink href="/about" variant="secondary">Our story</ButtonLink>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["2020", "Founded out of a passion for embroidery"],
                  ["2021", "Became the Dansvic Designs brand"],
                  ["∞", "Designers worldwide, downloading free"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl3 bg-surface-2 border border-line p-5">
                    <p className="text-3xl font-bold text-accent">{k}</p>
                    <p className="mt-2 text-sm text-ink-3">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {testimonials.length > 0 && (
          <section>
            <SectionHeader eyebrow="Kind words" title="Testimonials" href="/testimonials" />
            <TestimonialCards items={testimonials} />
          </section>
        )}

        <section>
          <Reveal>
            <Newsletter title={content.newsletter_title} subtitle={content.newsletter_subtitle} />
          </Reveal>
        </section>
      </Container>
    </>
  );
}
