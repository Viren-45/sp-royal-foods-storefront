// src/components/cart/CartClient.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartSuggestions from "./CartSuggestions";
import type { ProductWithDetails } from "@/types";

type CartClientProps = {
  suggestions: ProductWithDetails[];
  userId: string | null;
};

export default function CartClient({ suggestions, userId }: CartClientProps) {
  const {
    cartItems,
    guestItems,
    totalCount,
    isLoading,
    updateQuantity,
    removeItem,
  } = useCart();

  const isGuest = !userId;
  const isEmpty = isGuest ? guestItems.length === 0 : cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const cartProductIds = cartItems.map((item) => item.product_id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-[#5C5C4E]">Loading your cart...</p>
      </div>
    );
  }

  // Empty cart
  if (isEmpty && !isGuest) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingCart size={48} className="text-[#D8D6C0]" />
        <h1 className="mt-6 font-heading text-3xl font-medium text-[#1B1B1B]">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-[#5C5C4E]">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop">
          <Button className="mt-8 bg-[#1F3D2E] py-5 text-white hover:opacity-90">
            Start Shopping
          </Button>
        </Link>
        <div className="mt-12 w-full">
          <CartSuggestions products={suggestions} cartProductIds={[]} />
        </div>
      </div>
    );
  }

  // Guest cart
  if (isGuest) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-medium text-[#1B1B1B] sm:text-4xl">
          My Cart
        </h1>
        {guestItems.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart size={48} className="text-[#D8D6C0]" />
            <p className="mt-4 font-medium text-[#1B1B1B]">
              Your cart is empty
            </p>
            <Link href="/shop">
              <Button className="mt-6 bg-[#1F3D2E] py-5 text-white hover:opacity-90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#D8D6C0] p-8 text-center">
            <p className="font-medium text-[#1B1B1B]">
              Sign in to view your full cart
            </p>
            <p className="mt-2 text-sm text-[#5C5C4E]">
              You have {guestItems.length}{" "}
              {guestItems.length === 1 ? "item" : "items"} saved. Sign in to see
              product details and checkout.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link href="/login">
                <Button className="bg-[#1F3D2E] py-5 text-white hover:opacity-90">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="border-[#D8D6C0] py-5 text-[#1B1B1B]"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}
        <CartSuggestions products={suggestions} cartProductIds={[]} />
      </div>
    );
  }

  // Logged-in cart with items
  return (
    <div>
      <h1 className="font-heading text-3xl font-medium text-[#1B1B1B] sm:text-4xl">
        My Cart
        <span className="ml-3 font-sans text-lg font-normal text-[#5C5C4E]">
          ({totalCount} {totalCount === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          <CartSuggestions
            products={suggestions}
            cartProductIds={cartProductIds}
          />
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <CartSummary subtotal={subtotal} itemCount={totalCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
