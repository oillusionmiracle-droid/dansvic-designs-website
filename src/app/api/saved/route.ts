import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { savedDesigns } from "@/db/schema";
import { handle, requireUser } from "@/lib/auth";

export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { designId } = (await req.json()) as { designId?: string };
  if (!designId) return Response.json({ error: "designId required" }, { status: 400 });
  const existing = await db.query.savedDesigns.findFirst({ where: and(eq(savedDesigns.userId, user.id), eq(savedDesigns.designId, designId)) });
  if (existing) {
    await db.delete(savedDesigns).where(eq(savedDesigns.id, existing.id));
    return Response.json({ saved: false });
  }
  await db.insert(savedDesigns).values({ userId: user.id, designId });
  return Response.json({ saved: true });
});
