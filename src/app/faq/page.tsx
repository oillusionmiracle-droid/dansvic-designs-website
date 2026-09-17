import type { Metadata } from "next";
import { getFaqs } from "@/lib/content";
import { Container, PageHero } from "@/components/ui/Section";
import { FaqList } from "@/components/ui/FaqList";

export const metadata: Metadata = { title: "FAQ" };
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <PageHero eyebrow="Help" title="Frequently asked questions" description="Downloads, formats, usage rights and more." />
      <Container className="max-w-3xl">
        <FaqList items={faqs.map((f) => ({ id: f.id, q: f.question, a: f.answer }))} />
      </Container>
    </>
  );
}
