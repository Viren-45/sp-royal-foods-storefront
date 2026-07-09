// src/app/(site)/account/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import AccountLayout from "@/components/account/AccountLayout";

export default async function AccountRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard — redirect unauthenticated users to login.
  // Runs once for all /account/* routes via the shared layout.
  if (!user) {
    redirect("/login");
  }

  // Fetch profile data here so it's available to both the sidebar
  // (name/email/initials) and the ProfileInfoTab (pre-filled form)
  // without each making separate fetches.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <Navbar />
      <AccountLayout
        user={{
          id: user.id,
          email: user.email ?? "",
          full_name: profile?.full_name ?? null,
          phone: profile?.phone ?? null,
        }}
      >
        {children}
      </AccountLayout>
    </>
  );
}
