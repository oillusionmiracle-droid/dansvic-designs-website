import { Container, PageHero } from "@/components/ui/Section";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Last updated ${updated}`} />
      <Container className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <nav className="hidden lg:block sticky top-24 self-start" aria-label="On this page">
          <ul className="space-y-2 text-sm">
            {sections.map((s, i) => (
              <li key={i}><a href={`#s-${i}`} className="text-ink-3 hover:text-ink">{s.h}</a></li>
            ))}
          </ul>
        </nav>
        <article className="prose-dd font-serif">
          {sections.map((s, i) => (
            <section key={i} id={`s-${i}`}>
              <h2>{i + 1}. {s.h}</h2>
              {s.p.map((t, j) => <p key={j}>{t}</p>)}
            </section>
          ))}
        </article>
      </Container>
    </>
  );
}
