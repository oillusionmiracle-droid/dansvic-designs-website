import { db } from "@/db";
import { pageViews } from "@/db/schema";

function sourceFrom(ref: string | undefined, host: string | null) {
  if (!ref) return "direct";
  try {
    const u = new URL(ref);
    if (host && u.host === host) return "internal";
    const h = u.hostname.replace(/^www\./, "");
    if (/google|bing|duckduckgo|yahoo/.test(h)) return "search";
    if (/instagram|facebook|tiktok|pinterest|twitter|x\.com|whatsapp|t\.co/.test(h)) return "social";
    return h;
  } catch {
    return "direct";
  }
}

export async function POST(req: Request) {
  try {
    const { path, referrer, visitorId } = (await req.json()) as { path?: string; referrer?: string; visitorId?: string };
    if (!path || !visitorId) return Response.json({ ok: false }, { status: 400 });
    const source = sourceFrom(referrer, req.headers.get("host"));
    if (source === "internal") return Response.json({ ok: true });
    // Country header is set by most edge/CDN providers (Vercel, Cloudflare). Falls back to Unknown locally.
    const country = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "Unknown";
    await db.insert(pageViews).values({ path, referrer: referrer || null, source, country, visitorId });
  } catch {
    /* tracking must never break the page */
  }
  return Response.json({ ok: true });
}
