import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Private file storage. Design files live OUTSIDE /public so they are never
 * served directly. Access happens only through /api/files/[token] after a
 * signed, time-limited token has been issued to an authenticated user.
 * Swap the fs calls for Supabase Storage / S3 later without touching callers.
 */
export const STORAGE_ROOT = path.join(process.cwd(), "storage");
const SECRET = process.env.DOWNLOAD_SIGNING_SECRET ?? "dansvic-dev-signing-secret-change-me";
const TTL_SECONDS = 10 * 60;

export function resolveStoragePath(relative: string) {
  const full = path.normalize(path.join(STORAGE_ROOT, relative));
  if (!full.startsWith(STORAGE_ROOT)) throw new Error("Invalid storage path");
  return full;
}

export async function saveDesignFile(designId: string, format: string, data: Buffer) {
  const dir = path.join(STORAGE_ROOT, "designs", designId);
  await fs.mkdir(dir, { recursive: true });
  const rel = path.join("designs", designId, `${format.toUpperCase()}-${Date.now()}.${format.toLowerCase()}`);
  await fs.writeFile(path.join(STORAGE_ROOT, rel), data);
  return rel;
}

export async function savePublicUpload(name: string, data: Buffer) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const file = `${Date.now()}-${safe}`;
  await fs.writeFile(path.join(dir, file), data);
  return `/uploads/${file}`;
}

type Payload = { f: string; u: string; n: string; exp: number };

function b64url(s: string) {
  return Buffer.from(s).toString("base64url");
}

export function signDownload(fileId: string, userId: string, fileName: string) {
  const payload: Payload = { f: fileId, u: userId, n: fileName, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyDownloadToken(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
