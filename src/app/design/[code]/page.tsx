import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { browseDesigns, getDesignByCode, getDesignReviews, getRatingSummary, isSaved } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { slugifyCategory } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";
import { Container, Badge, Stars, SectionHeader } from "@/components/ui/Section";
import { DesignHero } from "@/components/designs/DesignHero";
import { DesignActions } from "@/components/designs/DesignActions";
import { DesignRail } from "@/components/designs/DesignGrid";
import { ViewPing } from "@/components/designs/ViewPing";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const d = await getDesignByCode(code);
  return { title: d ? `${d.name} (${d.code})` : "Design" };
}

export default async function DesignPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const design = await getDesignByCode(code);
  if (!design) notFound();
  const user = await getCurrentUser();
  const [reviews, rating, saved, related] = await Promise.all([
    getDesignReviews(design.id),
    getRatingSummary(design.id),
    user ? isSaved(user.id, design.id) : Promise.resolve(false),
    browseDesigns({ type: design.type as "embroidery" | "print", category: design.category, limit: 7 }),
  ]);
  const myReview = user ? reviews.find((r) => r.userId === user.id) : undefined;
  const isEmb = design.type === "embroidery";

  const specs: [string, string][] = isEmb
    ? [
        ["Dimensions", design.dimensions ?? "—"],
        ["Stitch count", design.stitchCount ? design.stitchCount.toLocaleString() : "—"],
        ["Colours", design.colourCount ? String(design.colourCount) : "—"],
        ["Formats", design.files.map((f) => f.fileFormat).join(", ") || "—"],
      ]
    : [
        ["Software", design.softwareCompatibility ?? "—"],
        ["Formats", design.files.map((f) => f.fileFormat).join(", ") || "—"],
        ["Dimensions", design.dimensions ?? "Scalable vector"],
      ];

  return (
    <>
      <ViewPing designId={design.id} />
      <DesignHero image={design.previewImageUrl} secondary={design.secondaryPreviewUrl} name={design.name} />

      <Container className="relative -mt-24 md:-mt-40 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-10">
          <Reveal className="rounded-xl3 bg-surface-2 border border-line shadow-lift p-6 md:p-10">
            <nav className="text-sm text-ink-3 mb-4" aria-label="Breadcrumb">
              <Link href="/designs" className="hover:text-ink">Designs</Link> ›{" "}
              <Link href={isEmb ? "/embroidery" : "/print"} className="hover:text-ink capitalize">{design.type}</Link> ›{" "}
              <Link href={`/categories/${slugifyCategory(design.category)}?type=${design.type}`} className="hover:text-ink">{design.category}</Link>
            </nav>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-accent/10 text-accent">{design.code}</Badge>
              <Badge className="capitalize">{design.type}</Badge>
              {design.isFeatured && <Badge className="bg-accent text-accent-fg">Featured</Badge>}
              {design.isFree && <Badge>Free</Badge>}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{design.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-3">
              <span className="inline-flex items-center gap-2">
                <Stars value={rating.avg} />
                <span className="text-sm">{rating.count ? `${rating.avg.toFixed(1)} · ${rating.count} review${rating.count === 1 ? "" : "s"}` : "No reviews yet"}</span>
              </span>
              <span className="text-sm tabular-nums">↓ {formatNumber(design.downloadCount)} downloads</span>
              <span className="text-sm tabular-nums">◉ {formatNumber(design.viewCount)} views</span>
              <span className="text-sm">Added {formatDate(design.createdAt)}</span>
            </div>
            <p className="mt-6 font-serif text-lg leading-relaxed text-ink-2 whitespace-pre-line">{design.description}</p>

            <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {specs.map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-surface p-4 border border-line">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink-3">{k}</dt>
                  <dd className="mt-1 font-semibold text-[15px] break-words">{v}</dd>
                </div>
              ))}
            </dl>

            {design.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {design.tags.map((t) => (
                  <Link key={t.id} href={`/designs?q=${encodeURIComponent(t.tag)}`} className="rounded-full border border-line px-3 py-1 text-sm hover:bg-surface-3">
                    #{t.tag}
                  </Link>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal className="rounded-xl3 bg-surface-2 border border-line p-6 md:p-10">
            <h2 className="text-2xl font-bold">Reviews & ratings</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-ink-3">Be the first to rate this design after you download it.</p>
            ) : (
              <ul className="mt-6 space-y-5">
                {reviews.map((r) => (
                  <li key={r.id} className="border-t border-line pt-5 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-accent font-bold">{r.user.name.charAt(0)}</span>
                        <div>
                          <p className="font-semibold leading-tight">{r.user.name}</p>
                          <p className="text-xs text-ink-3">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} size="text-sm" />
                    </div>
                    {r.body && <p className="mt-3 font-serif text-ink-2 leading-relaxed">{r.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <DesignActions
            design={{ id: design.id, code: design.code, name: design.name, isFree: design.isFree }}
            files={design.files.map((f) => ({ id: f.id, format: f.fileFormat, size: f.fileSize }))}
            signedIn={!!user}
            initiallySaved={saved}
            myReview={myReview ? { rating: myReview.rating, body: myReview.body ?? "" } : null}
          />
          {design.secondaryPreviewUrl && (
            <div className="mt-5 relative aspect-[4/3] overflow-hidden rounded-xl3 border border-line">
              <Image src={design.secondaryPreviewUrl} alt={`${design.name} alternate view`} fill sizes="40vw" className="object-cover" />
            </div>
          )}
        </div>
      </Container>

      {related.filter((d) => d.id !== design.id).length > 0 && (
        <Container className="mt-24">
          <SectionHeader eyebrow="Keep browsing" title={`More ${design.category} designs`} href={`/categories/${slugifyCategory(design.category)}?type=${design.type}`} />
          <DesignRail designs={related.filter((d) => d.id !== design.id)} />
        </Container>
      )}
    </>
  );
}
