import type { Metadata } from "next";
import { getCategoryCounts } from "@/lib/catalog";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Container, PageHero } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const cats = await getCategoryCounts();
  const emb = cats.filter((c) => c.type === "embroidery");
  const print = cats.filter((c) => c.type === "print");
  return (
    <>
      <PageHero eyebrow="Browse" title="Categories" description="Pick the garment, find the design." />
      <Container className="space-y-14">
        <section>
          <h2 className="text-2xl font-bold mb-5">Embroidery</h2>
          <CategoryGrid categories={emb} />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-5">Print</h2>
          <CategoryGrid categories={print} />
        </section>
      </Container>
    </>
  );
}
