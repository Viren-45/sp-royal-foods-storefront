// src/app/(auth)/signup/page.tsx
import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | S.P Royal Foods",
};

export default function SignupPage() {
  return <SignupForm />;
}
