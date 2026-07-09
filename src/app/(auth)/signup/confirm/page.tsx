// src/app/(auth)/signup/confirm/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirm Your Email | S.P Royal Foods",
};

export default function SignupConfirmPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E7D0]">
        <MailCheck size={28} className="text-[#1F3D2E]" />
      </div>

      <h1 className="mt-6 font-heading text-3xl font-medium text-[#1B1B1B]">
        Check your inbox
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5C4E]">
        We&apos;ve sent a confirmation link to your email address. Click the
        link to activate your account and start shopping.
      </p>
      <p className="mt-4 text-xs text-[#5C5C4E]">
        Didn&apos;t get an email? Check your spam folder, or{" "}
        <Link href="/signup" className="text-[#1F3D2E] hover:underline">
          try signing up again
        </Link>
        .
      </p>
    </div>
  );
}
