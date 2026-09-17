import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, email, password } = (await req.json()) as Record<string, string | undefined>;
  if (!name?.trim() || !email || !password) return Response.json({ error: "All fields are required." }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const normalized = email.trim().toLowerCase();
  const exists = await db.query.profiles.findFirst({ where: eq(profiles.email, normalized) });
  if (exists) return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  const [user] = await db.insert(profiles).values({ name: name.trim(), email: normalized, passwordHash: hashPassword(password) }).returning();
  await createSession(user.id);
  return Response.json({ ok: true });
}
