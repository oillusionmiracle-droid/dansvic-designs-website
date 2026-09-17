import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { Container } from "@/components/ui/Section";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return db.query.blogPosts.findFirst({ where: and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)) });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return { title: post?.title ?? "Post" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <Container className="pt-12 md:pt-20 max-w-4xl">
      <Link href="/blog" className="text-sm font-semibold text-accent">← All posts</Link>
      <p className="mt-6 text-sm text-ink-3">{formatDate(post.createdAt)}</p>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
      {post.excerpt && <p className="mt-4 font-serif text-xl text-ink-2">{post.excerpt}</p>}
      {post.coverImageUrl && (
        <div className="relative mt-8 aspect-[16/9] rounded-xl3 overflow-hidden">
          <Image src={post.coverImageUrl} alt="" fill sizes="900px" className="object-cover" priority />
        </div>
      )}
      <article className="prose-dd font-serif mt-10">
        {post.body.split(/\n{2,}/).map((para, i) =>
          para.startsWith("## ") ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>,
        )}
      </article>
    </Container>
  );
}
