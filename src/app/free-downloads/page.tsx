import type { Metadata } from "next";
import { BrowsePage, type SP } from "@/components/designs/BrowsePage";

export const metadata: Metadata = { title: "Free Downloads" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (
    <BrowsePage
      sp={sp}
      forced={{ free: true }}
      eyebrow="THE DOWNLOAD LIBRARY"
      title="Free Downloads"
      description="Verified free files, when available. Each listing shows its formats and specifications. More files will appear here as they are added."
    />
  );
}
