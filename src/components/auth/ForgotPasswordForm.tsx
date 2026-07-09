// src/components/auth/ForgotPasswordForm.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    // Always show the success state, even if the email doesn't exist
    // in the system — this prevents leaking which emails are registered.
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E7D0]">
          <MailCheck size={28} className="text-[#1F3D2E]" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-medium text-[#1B1B1B]">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5C4E]">
          If an account exists with that email, we&apos;ve sent a link to reset
          your password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-[#1F3D2E] hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-medium text-[#1B1B1B]">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm text-[#5C5C4E]">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email" className="text-[#1B1B1B]">
                  Email address
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className="border-[#D8D6C0] py-5"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {serverError && (
            <p className="text-sm text-[#C0392B]">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1F3D2E] py-5 text-white hover:opacity-90"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-[#5C5C4E]">
        Remember your password?{" "}
        <Link href="/login" className="text-[#1F3D2E] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
