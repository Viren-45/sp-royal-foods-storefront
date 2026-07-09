// src/app/(site)/account/profile/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProfileInfoTab from "@/components/account/tabs/ProfileInfoTab";

export const metadata: Metadata = {
  title: "Profile Info | S.P Royal Foods",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <ProfileInfoTab
      userId={user!.id}
      email={user!.email ?? ""}
      initialFullName={profile?.full_name ?? ""}
      initialPhone={profile?.phone ?? ""}
    />
  );
}
