import "server-only";
import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { profiles, sessions } from "@/db/schema";
import { cache } from "react";

const COOKIE = "dd_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.insert(sessions).values({ userId, token, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.token, token));
  jar.delete(COOKIE);
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isDisabled: boolean;
  createdAt: Date;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      email: profiles.email,
      role: profiles.role,
      isDisabled: profiles.isDisabled,
      createdAt: profiles.createdAt,
    })
    .from(sessions)
    .innerJoin(profiles, eq(sessions.userId, profiles.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const user = rows[0];
  if (!user || user.isDisabled) return null;
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Response(JSON.stringify({ error: "Please sign in to continue." }), { status: 401 });
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin")
    throw new Response(JSON.stringify({ error: "Admin access required." }), { status: 403 });
  return user;
}

/** Wrap a route handler so thrown Response objects become the response. */
export function handle<T extends unknown[]>(fn: (...args: T) => Promise<Response>) {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof Response) return e;
      console.error(e);
      return Response.json({ error: "Something went wrong." }, { status: 500 });
    }
  };
}
