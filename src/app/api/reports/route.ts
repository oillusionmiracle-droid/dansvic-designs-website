import { db } from "@/db";
import { reports } from "@/db/schema";
import { handle, requireUser } from "@/lib/auth";

export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { designId, reason, details } = (await req.json()) as { designId?: string; reason?: string; details?: string };
  if (!designId || !reason) return Response.json({ error: "Invalid report" }, { status: 400 });
  await db.insert(reports).values({ designId, userId: user.id, reason, details: details?.trim() ?? "" });
  return Response.json({ ok: true });
});
