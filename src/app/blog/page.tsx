import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";
import { Container, PageHero } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHero eyebrow="Journal" title="Blog" description="Stitching tips, design stories and what's new at Dansvic Designs." />
      <Container>
        {posts.length === 0 ? (
          <p className="text-ink-3">No posts yet — check back soon.</p>
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group block rounded-xl3 overflow-hidden bg-surface-2 border border-line shadow-soft h-full">
                  <div className="relative aspect-[16/10] bg-surface-3 overflow-hidden">
                    {p.coverImageUrl && <Image src={p.coverImageUrl} alt="" fill sizes="33vw" className="object-cover transition-transform duration-[1500ms] group-hover:scale-105" />}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-ink-3">{formatDate(p.createdAt)}</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight group-hover:text-accent">{p.title}</h2>
                    <p className="mt-2 font-serif text-ink-2 line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </>
  );
}
