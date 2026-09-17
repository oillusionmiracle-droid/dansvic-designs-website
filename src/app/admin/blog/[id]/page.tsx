import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { AdminHeader, btnDanger, btnPrimary, Card, Field, input, textarea } from "@/components/admin/ui";
import { deletePost, savePost } from "../../actions";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = id === "new" ? undefined : await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, id) });
  if (id !== "new" && !post) notFound();
  return (
    <>
      <AdminHeader title={post ? "Edit post" : "New post"} />
      <form action={savePost} encType="multipart/form-data">
        <Card className="space-y-4">
          {post && <input type="hidden" name="id" value={post.id} />}
          {post?.coverImageUrl && <input type="hidden" name="existingCover" value={post.coverImageUrl} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><input name="title" required defaultValue={post?.title} className={input} /></Field>
            <Field label="Slug"><input name="slug" defaultValue={post?.slug} placeholder="auto from title" className={input} /></Field>
          </div>
          <Field label="Excerpt"><textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={textarea} /></Field>
          <Field label="Body (blank line between paragraphs, start a line with ## for a heading)"><textarea name="body" required rows={16} defaultValue={post?.body} className={`${textarea} font-serif`} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cover image (upload)"><input type="file" name="cover" accept="image/*" className="mt-1 block text-sm" /></Field>
            <Field label="…or image URL"><input name="cover_url" defaultValue={post?.coverImageUrl ?? ""} className={input} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" defaultChecked={post ? post.isPublished : true} className="h-4 w-4" /> Published</label>
          <div className="flex gap-3">
            <button className={btnPrimary}>{post ? "Save" : "Publish"}</button>
            {post && <button formAction={deletePost.bind(null, post.id)} className={btnDanger}>Delete</button>}
          </div>
        </Card>
      </form>
    </>
  );
}
