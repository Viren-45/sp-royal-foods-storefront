// src/lib/utils/cart.ts
import type { GuestCartItem } from "@/types";

const GUEST_CART_KEY = "sp_royal_guest_cart";

/**
 * Reads guest cart from localStorage.
 * Returns empty array if nothing stored or parsing fails.
 */
export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves guest cart to localStorage.
 */
export function saveGuestCart(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

/**
 * Clears guest cart from localStorage — called after merge on login.
 */
export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

/**
 * Adds or increments an item in the guest cart.
 */
export function addToGuestCart(
  items: GuestCartItem[],
  productId: string,
  variantId: string,
  quantity: number,
): GuestCartItem[] {
  const existing = items.find((i) => i.variant_id === variantId);
  if (existing) {
    return items.map((i) =>
      i.variant_id === variantId
        ? { ...i, quantity: i.quantity + quantity }
        : i,
    );
  }
  return [...items, { product_id: productId, variant_id: variantId, quantity }];
}

/**
 * Updates quantity of a guest cart item.
 */
export function updateGuestCartQuantity(
  items: GuestCartItem[],
  variantId: string,
  quantity: number,
): GuestCartItem[] {
  return items.map((i) =>
    i.variant_id === variantId ? { ...i, quantity } : i,
  );
}

/**
 * Removes an item from the guest cart.
 */
export function removeFromGuestCart(
  items: GuestCartItem[],
  variantId: string,
): GuestCartItem[] {
  return items.filter((i) => i.variant_id !== variantId);
}
