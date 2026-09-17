import type { Metadata } from "next";
import { BrowsePage, type SP } from "@/components/designs/BrowsePage";

export const metadata: Metadata = { title: "Print Designs" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (
    <BrowsePage
      sp={sp}
      forced={{ type: "print" }}
      eyebrow="CDR · PDF"
      title="Print Designs"
      description="Vector artwork ready for caps, t-shirts and trousers, with software compatibility listed on every design."
    />
  );
}
