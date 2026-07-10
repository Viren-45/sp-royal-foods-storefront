// src/components/checkout/CheckoutClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressSelector from "./AddressSelector";
import CheckoutSummary from "./CheckoutSummary";
import type { Address, CartItemWithProduct } from "@/types";

type CheckoutClientProps = {
  cartItems: CartItemWithProduct[];
  addresses: Address[];
  userId: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingSettings: {
    flatShippingFee: number;
    freeShippingThreshold: number;
  };
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CheckoutClient({
  cartItems,
  addresses,
  userId,
  subtotal,
  shippingFee,
  total,
}: CheckoutClientProps) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.find((a) => a.is_default) ?? addresses[0] ?? null,
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setError(null);
    setIsPlacingOrder(true);

    try {
      // Step 1: Create order in DB + Razorpay order server-side
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          shippingAddress: {
            full_name: selectedAddress.full_name,
            phone: selectedAddress.phone,
            address_line1: selectedAddress.address_line1,
            address_line2: selectedAddress.address_line2,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            label: selectedAddress.label,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create order");
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "S.P Royal Foods",
        description: "Premium Makhana, Seeds & Honey",
        handler: async function () {
          // Payment succeeded on client — redirect to success page.
          // The webhook will handle confirming the order server-side.
          // We never trust this client callback alone for order status.
          router.push(`/checkout/success?orderId=${data.orderId}`);
        },
        prefill: {
          name: selectedAddress.full_name,
          contact: selectedAddress.phone,
        },
        theme: {
          color: "#1F3D2E",
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      {/* Load Razorpay checkout script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: address selection */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#D8D6C0] bg-white p-6">
            <AddressSelector
              addresses={addresses}
              selectedId={selectedAddress?.id ?? null}
              onSelect={setSelectedAddress}
              userId={userId}
            />
          </div>

          {error && <p className="mt-4 text-sm text-[#C0392B]">{error}</p>}
        </div>

        {/* Right: order summary + pay */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isPlacingOrder={isPlacingOrder}
              canPlaceOrder={!!selectedAddress}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </>
  );
}
