// src/app/(site)/account/addresses/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AddressesTab from "@/components/account/tabs/addresses";

export const metadata: Metadata = {
  title: "Addresses | S.P Royal Foods",
};

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <AddressesTab userId={user!.id} />;
}
