// src/app/(site)/(main)/cart/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/supabase/queries/products";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "My Cart | S.P Royal Foods",
};

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const suggestions = await getProducts(supabase);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <CartClient suggestions={suggestions} userId={user?.id ?? null} />
    </main>
  );
}
