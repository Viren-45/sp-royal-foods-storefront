// src/components/auth/SignupForm.tsx

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

const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // Read by the handle_new_user() trigger to populate
        // the profiles.full_name column automatically.
        data: { full_name: values.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    // If email confirmation is enabled in Supabase, the user won't
    // have a session yet — send them to a "check your email" state
    // rather than assuming they're logged in.
    router.push("/signup/confirm");
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-medium text-[#1B1B1B]">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-[#5C5C4E]">
        Start shopping premium makhana, seeds, and honey today
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
            name="fullName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName" className="text-[#1B1B1B]">
                  Full name
                </FieldLabel>
                <Input
                  {...field}
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
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
                <FieldLabel htmlFor="password" className="text-[#1B1B1B]">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="border-[#D8D6C0] py-5 pr-10"
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

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-[#1B1B1B]"
                >
                  Confirm password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="border-[#D8D6C0] py-5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5C4E] cursor-pointer"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
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
            className="w-full bg-[#1F3D2E] py-5 text-white hover:opacity-90 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-[#5C5C4E]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#1F3D2E] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
