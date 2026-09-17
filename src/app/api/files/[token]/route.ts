import { eq } from "drizzle-orm";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { db } from "@/db";
import { designFiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { resolveStoragePath, verifyDownloadToken } from "@/lib/storage";

/** Streams a private file only when presented with a valid, unexpired signed token belonging to the current user. */
export async function GET(_: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const payload = verifyDownloadToken(token);
  if (!payload) return new Response("Link expired or invalid. Please request the download again.", { status: 403 });
  const user = await getCurrentUser();
  if (!user || user.id !== payload.u) return new Response("Please sign in to download.", { status: 401 });

  const file = await db.query.designFiles.findFirst({ where: eq(designFiles.id, payload.f) });
  if (!file) return new Response("File not found", { status: 404 });
  const full = resolveStoragePath(file.storagePath);
  try {
    const info = await stat(full);
    const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(info.size),
        "Content-Disposition": `attachment; filename="${payload.n}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("File missing on storage", { status: 404 });
  }
}
