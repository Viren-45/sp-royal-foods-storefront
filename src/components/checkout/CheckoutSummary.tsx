// src/components/checkout/CheckoutSummary.tsx
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/currency";
import type { CartItemWithProduct } from "@/types";

type CheckoutSummaryProps = {
  cartItems: CartItemWithProduct[];
  subtotal: number;
  shippingFee: number;
  total: number;
  isPlacingOrder: boolean;
  canPlaceOrder: boolean;
  onPlaceOrder: () => void;
};

export default function CheckoutSummary({
  cartItems,
  subtotal,
  shippingFee,
  total,
  isPlacingOrder,
  canPlaceOrder,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="font-heading text-xl font-medium text-[#1B1B1B]">
        Order Summary
      </h2>

      {/* Cart items */}
      <div className="mt-4 space-y-4">
        {cartItems.map((item) => {
          const primaryImage =
            item.product.product_images.find((img) => img.is_primary) ??
            item.product.product_images[0];

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F1E7D0]">
                {primaryImage && (
                  <Image
                    src={primaryImage.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#1B1B1B]">
                  {item.product.name}
                </p>
                <p className="text-xs text-[#5C5C4E]">
                  {item.variant.size_label} × {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-[#1F3D2E]">
                {formatCurrency(item.product.price * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-3 border-t border-[#D8D6C0] pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#5C5C4E]">Subtotal</span>
          <span className="text-[#1B1B1B]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#5C5C4E]">Shipping</span>
          <span
            className={shippingFee === 0 ? "text-[#2F7A3D]" : "text-[#1B1B1B]"}
          >
            {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-[#D8D6C0] pt-3">
          <span className="font-medium text-[#1B1B1B]">Total</span>
          <span className="font-heading text-xl font-medium text-[#1F3D2E]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={onPlaceOrder}
        disabled={!canPlaceOrder || isPlacingOrder}
        className="mt-6 w-full rounded-md bg-[#1F3D2E] py-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPlacingOrder ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </button>

      {!canPlaceOrder && (
        <p className="mt-3 text-center text-xs text-[#C0392B]">
          Please select a delivery address to continue
        </p>
      )}

      <p className="mt-3 text-center text-xs text-[#5C5C4E]">
        🔒 Secured by Razorpay
      </p>
    </div>
  );
}
