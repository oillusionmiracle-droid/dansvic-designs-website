import type { Metadata } from "next";
import { BrowsePage, type SP } from "@/components/designs/BrowsePage";

export const metadata: Metadata = { title: "Embroidery Designs" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (
    <BrowsePage
      sp={sp}
      forced={{ type: "embroidery" }}
      eyebrow="EMB · DST · DSB"
      title="Embroidery Designs"
      description="Machine embroidery files with stitch counts, dimensions and colour counts — for Agbada, Danshiki, Aso-Oke, caps, tees and more."
    />
  );
}
