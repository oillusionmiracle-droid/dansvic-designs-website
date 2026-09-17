import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { INQUIRY_TYPES } from "@/lib/constants";

export async function POST(req: Request) {
  const { name, email, inquiryType, message } = (await req.json()) as Record<string, string | undefined>;
  if (!name || !email || !message || !inquiryType) return Response.json({ error: "All fields are required." }, { status: 400 });
  if (!INQUIRY_TYPES.some((t) => t.value === inquiryType)) return Response.json({ error: "Invalid inquiry type" }, { status: 400 });
  await db.insert(contactMessages).values({ name, email, inquiryType, message });
  // Routing: each inquiry type is tagged so the admin inbox can filter it; hook up
  // email forwarding per type (e.g. Resend) here when a mail provider is chosen.
  return Response.json({ ok: true });
}
