import { db } from "@/db";
import { reviews } from "@/db/schema";
import { handle, requireUser } from "@/lib/auth";

export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { designId, rating, body } = (await req.json()) as { designId?: string; rating?: number; body?: string };
  if (!designId || !rating || rating < 1 || rating > 5) return Response.json({ error: "Invalid review" }, { status: 400 });
  await db
    .insert(reviews)
    .values({ designId, userId: user.id, rating, body: body?.trim() || null })
    .onConflictDoUpdate({ target: [reviews.userId, reviews.designId], set: { rating, body: body?.trim() || null, createdAt: new Date() } });
  return Response.json({ ok: true });
});
