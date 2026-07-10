// src/app/(site)/(main)/checkout/success/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed | S.P Royal Foods",
};

type SuccessPageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/");

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) redirect("/");

  return (
    <main className="mx-auto max-w-lg px-6 pb-20 pt-32 text-center">
      <div className="rounded-2xl border border-[#D8D6C0] bg-white p-10">
        <CheckCircle2
          size={56}
          className="mx-auto text-[#2F7A3D]"
          strokeWidth={1.5}
        />

        <h1 className="mt-6 font-heading text-3xl font-medium text-[#1B1B1B]">
          Order Placed!
        </h1>

        <p className="mt-3 text-sm text-[#5C5C4E]">
          Thank you for your order. We&apos;re preparing it now and will send
          you a confirmation email shortly.
        </p>

        <div className="mt-6 rounded-xl bg-[#F1E7D0] px-5 py-4">
          <p className="text-xs text-[#5C5C4E]">Order ID</p>
          <p className="mt-1 font-heading text-lg font-medium text-[#1B1B1B]">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/account/orders">
            <Button className="w-full bg-[#1F3D2E] py-5 text-white hover:opacity-90">
              View My Orders
            </Button>
          </Link>
          <Link href="/shop">
            <Button
              variant="outline"
              className="w-full border-[#D8D6C0] py-5 text-[#1B1B1B]"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
