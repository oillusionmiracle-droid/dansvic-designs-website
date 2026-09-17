import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { designs } from "@/db/schema";

// Server-side increment only. Clients cannot write view_count directly.
export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.update(designs).set({ viewCount: sql`${designs.viewCount} + 1` }).where(eq(designs.id, id));
  return Response.json({ ok: true });
}
