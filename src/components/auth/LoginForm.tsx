// src/components/auth/LoginForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (error) {
      // Supabase returns a generic message for invalid credentials —
      // surfaced as-is rather than guessed at, since a friendlier
      // custom message risks leaking whether an email exists.
      setServerError(error.message);
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-medium text-[#1B1B1B]">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-[#5C5C4E]">
        Sign in to your account to continue
      </p>

      <div className="mt-8">
        <GoogleAuthButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#D8D6C0]" />
        <span className="text-xs uppercase tracking-wide text-[#5C5C4E]">
          or
        </span>
        <span className="h-px flex-1 bg-[#D8D6C0]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-[#1B1B1B]">
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#1F3D2E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="border-[#D8D6C0] pr-10 py-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5C4E] cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
            className="w-full bg-[#1F3D2E] text-white hover:opacity-90 py-5"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-[#5C5C4E]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#1F3D2E] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
