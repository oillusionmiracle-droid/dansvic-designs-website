import { Suspense } from "react";
import { browseDesigns, type BrowseParams } from "@/lib/catalog";
import { EMBROIDERY_CATEGORIES, EMBROIDERY_FORMATS, PRINT_CATEGORIES, PRINT_FORMATS } from "@/lib/constants";
import { Container, PageHero } from "@/components/ui/Section";
import { BrowseControls } from "./BrowseControls";
import { DesignGrid } from "./DesignGrid";

export type SP = Record<string, string | string[] | undefined>;

export function parseBrowse(sp: SP, forced: Partial<BrowseParams> = {}): BrowseParams {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const type = (one("type") as BrowseParams["type"]) || undefined;
  return {
    q: one("q") || undefined,
    type: type === "embroidery" || type === "print" ? type : undefined,
    category: one("category") || undefined,
    format: one("format") || undefined,
    sort: (one("sort") as BrowseParams["sort"]) || "newest",
    popularity: (one("popularity") as BrowseParams["popularity"]) || "",
    ...forced,
  };
}

export async function BrowsePage({
  sp,
  forced,
  eyebrow,
  title,
  description,
}: {
  sp: SP;
  forced?: Partial<BrowseParams>;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const params = parseBrowse(sp, forced);
  const designs = await browseDesigns(params);
  const lockType = !!forced?.type;
  const categories =
    params.type === "embroidery" ? [...EMBROIDERY_CATEGORIES] : params.type === "print" ? [...PRINT_CATEGORIES] : [...EMBROIDERY_CATEGORIES, ...PRINT_CATEGORIES];
  const formats =
    params.type === "embroidery" ? [...EMBROIDERY_FORMATS] : params.type === "print" ? [...PRINT_FORMATS] : [...EMBROIDERY_FORMATS, ...PRINT_FORMATS];
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Container className="space-y-8 pb-10">
        <Suspense>
          <BrowseControls categories={categories} formats={formats} lockType={lockType} total={designs.length} />
        </Suspense>
        <DesignGrid designs={designs} />
      </Container>
    </>
  );
}
