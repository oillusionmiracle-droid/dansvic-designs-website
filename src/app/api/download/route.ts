import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { designFiles, designs, downloads } from "@/db/schema";
import { handle, requireUser } from "@/lib/auth";
import { signDownload } from "@/lib/storage";

/**
 * Issues a signed, time-limited URL for a design file. Requires auth.
 * Also records the download and increments download_count server-side.
 */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { fileId } = (await req.json()) as { fileId?: string };
  if (!fileId) return Response.json({ error: "fileId required" }, { status: 400 });
  const [row] = await db
    .select({ file: designFiles, design: designs })
    .from(designFiles)
    .innerJoin(designs, eq(designs.id, designFiles.designId))
    .where(eq(designFiles.id, fileId))
    .limit(1);
  if (!row || !row.design.isPublished) return Response.json({ error: "File not found" }, { status: 404 });
  if (!row.design.isFree) return Response.json({ error: "This design is not available for free download." }, { status: 402 });

  const fileName = `${row.design.code}-${row.design.name.replace(/[^a-z0-9]+/gi, "-")}.${row.file.fileFormat.toLowerCase()}`;
  await db.insert(downloads).values({ userId: user.id, designId: row.design.id, fileFormat: row.file.fileFormat });
  await db.update(designs).set({ downloadCount: sql`${designs.downloadCount} + 1` }).where(eq(designs.id, row.design.id));

  const token = signDownload(row.file.id, user.id, fileName);
  return Response.json({ url: `/api/files/${token}`, fileName, expiresIn: 600 });
});
