// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" lets us support redirecting to different destinations later
  // (e.g. password reset vs. signup confirmation) if needed.
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If the code is missing or invalid/expired, send the user to login
  // with an error flag rather than silently failing.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
