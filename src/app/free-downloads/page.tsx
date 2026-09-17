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
      eyebrow="100% free · no limits"
      title="Free Downloads"
      description="Every free design in one place. Create an account, download all formats, and re-download any time."
    />
  );
}
