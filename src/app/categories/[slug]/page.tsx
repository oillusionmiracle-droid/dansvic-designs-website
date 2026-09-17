import { notFound } from "next/navigation";
import { categoryFromSlug, EMBROIDERY_CATEGORIES } from "@/lib/constants";
import { BrowsePage, type SP } from "@/components/designs/BrowsePage";

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  const isEmb = (EMBROIDERY_CATEGORIES as readonly string[]).includes(category);
  const spType = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const type = spType === "print" || spType === "embroidery" ? spType : isEmb ? "embroidery" : "print";
  return (
    <BrowsePage
      sp={sp}
      forced={{ type, category }}
      eyebrow={type === "embroidery" ? "Embroidery category" : "Print category"}
      title={category}
      description={`All ${type} designs made for ${category}.`}
    />
  );
}
