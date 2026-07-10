// src/app/(site)/(main)/checkout/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import { getAddresses } from "@/lib/supabase/queries/addresses";
import { getShippingSettings } from "@/lib/supabase/queries/settings";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | S.P Royal Foods",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Must be logged in to checkout — per project spec
  if (!user) {
    redirect("/login");
  }

  const [cartItems, addresses, shippingSettings] = await Promise.all([
    getCartItems(supabase),
    getAddresses(supabase),
    getShippingSettings(supabase),
  ]);

  // Nothing to checkout
  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingFee =
    subtotal >= shippingSettings.freeShippingThreshold
      ? 0
      : shippingSettings.flatShippingFee;
  const total = subtotal + shippingFee;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <h1 className="font-heading text-3xl font-medium text-[#1B1B1B] sm:text-4xl">
        Checkout
      </h1>
      <CheckoutClient
        cartItems={cartItems}
        addresses={addresses}
        userId={user.id}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
        shippingSettings={shippingSettings}
      />
    </main>
  );
}
