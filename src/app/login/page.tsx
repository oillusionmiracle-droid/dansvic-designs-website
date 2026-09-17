import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function Page() {
  if (await getCurrentUser()) redirect("/account");
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
