import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  if (user) {
    const next = (await searchParams).next;
    const safeNext = next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : null;
    redirect(safeNext ?? (user.role === "admin" ? "/admin" : "/account"));
  }
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
