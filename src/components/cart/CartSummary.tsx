// src/components/cart/CartSummary.tsx
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  shippingSettings: {
    flatShippingFee: number;
    freeShippingThreshold: number;
  };
};

export default function CartSummary({
  subtotal,
  itemCount,
  shippingSettings,
}: CartSummaryProps) {
  const { flatShippingFee, freeShippingThreshold } = shippingSettings;

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : flatShippingFee;
  const total = subtotal + shippingFee;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="font-heading text-xl font-medium text-[#1B1B1B]">
        Order Summary
      </h2>

      {/* Free shipping progress */}
      {subtotal > 0 && subtotal < freeShippingThreshold && (
        <div className="mt-4 rounded-xl bg-[#F1E7D0] px-4 py-3">
          <p className="text-xs text-[#1F3D2E]">
            Add{" "}
            <span className="font-semibold">
              {formatCurrency(amountToFreeShipping)}
            </span>{" "}
            more for free shipping!
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#D8D6C0]">
            <div
              className="h-full rounded-full bg-[#1F3D2E] transition-all"
              style={{
                width: `${Math.min(
                  (subtotal / freeShippingThreshold) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {subtotal >= freeShippingThreshold && (
        <div className="mt-4 rounded-xl bg-[#1F3D2E]/10 px-4 py-3">
          <p className="text-xs font-medium text-[#1F3D2E]">
            🎉 You&apos;ve unlocked free shipping!
          </p>
        </div>
      )}

      {/* Line items */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5C5C4E]">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-[#1B1B1B]">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5C5C4E]">Shipping</span>
          <span
            className={`font-medium ${
              shippingFee === 0 ? "text-[#2F7A3D]" : "text-[#1B1B1B]"
            }`}
          >
            {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
          </span>
        </div>
        <div className="border-t border-[#D8D6C0] pt-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#1B1B1B]">Total</span>
            <span className="font-heading text-xl font-medium text-[#1F3D2E]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link href="/checkout">
        <Button className="mt-6 w-full bg-[#1F3D2E] py-5 text-white hover:opacity-90">
          <ShoppingBag size={16} className="mr-2" />
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        href="/shop"
        className="mt-4 block text-center text-sm text-[#5C5C4E] hover:text-[#1F3D2E]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
