import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as Record<string, string | undefined>;
  if (!email || !password) return Response.json({ error: "Email and password are required." }, { status: 400 });
  const user = await db.query.profiles.findFirst({ where: eq(profiles.email, email.trim().toLowerCase()) });
  if (!user || !verifyPassword(password, user.passwordHash)) return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  if (user.isDisabled) return Response.json({ error: "This account has been disabled. Contact support." }, { status: 403 });
  await createSession(user.id);
  return Response.json({ ok: true });
}
