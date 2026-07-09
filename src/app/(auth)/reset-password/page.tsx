// src/app/(auth)/reset-password/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | S.P Royal Foods",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session at all — they didn't come through a valid reset link
  // (or it expired). Send them back to request a new one.
  if (!user) {
    redirect("/forgot-password");
  }

  return <ResetPasswordForm />;
}
