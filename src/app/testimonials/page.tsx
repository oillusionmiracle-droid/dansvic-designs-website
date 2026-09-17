import type { Metadata } from "next";
import { getPublishedTestimonials } from "@/lib/content";
import { Container, PageHero } from "@/components/ui/Section";
import { TestimonialCards } from "@/components/home/TestimonialCards";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await getPublishedTestimonials();
  return (
    <>
      <PageHero eyebrow="Kind words" title="Testimonials" description="From tailors, designers and fashion lovers who stitch with us." />
      <Container>{items.length ? <TestimonialCards items={items} /> : <p className="text-ink-3">No testimonials yet.</p>}</Container>
    </>
  );
}
