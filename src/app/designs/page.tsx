import type { Metadata } from "next";
import { BrowsePage, type SP } from "@/components/designs/BrowsePage";

export const metadata: Metadata = { title: "All Designs" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (
    <BrowsePage
      sp={sp}
      eyebrow="Catalog"
      title="All Designs"
      description="Every embroidery and print file we've released. Search by name, code or tag, then filter to the format you need."
    />
  );
}
