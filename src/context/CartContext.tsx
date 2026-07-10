// src/context/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import {
  getCartItems,
  upsertCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  mergeGuestCart,
} from "@/lib/supabase/queries/cart";
import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
} from "@/lib/utils/cart";
import type { CartItemWithProduct, GuestCartItem } from "@/types";

type CartContextType = {
  cartItems: CartItemWithProduct[];
  guestItems: GuestCartItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => Promise<void>;
  updateQuantity: (
    cartItemId: string,
    variantId: string,
    quantity: number,
  ) => Promise<void>;
  removeItem: (cartItemId: string, variantId: string) => Promise<void>;
  clearAllItems: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isUserLoading } = useUser();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMerged, setHasMerged] = useState(false);

  const supabase = createClient();

  // TODO (Phase 5): Replace fetchCart() calls with optimistic updates
  // for instant UI response. Pattern: update state immediately,
  // call DB in background, rollback on error.
  // Currently re-fetches from Supabase after each mutation which
  // causes a brief loading flash — functional but not ideal UX.

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCartItems(supabase);
      setCartItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load cart.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Load guest cart on mount
  useEffect(() => {
    async function loadGuestCart() {
      const stored = getGuestCart();
      setGuestItems(stored);
    }
    loadGuestCart();
  }, []);

  // Handle auth state + merge
  useEffect(() => {
    if (isUserLoading) return;

    async function initCart() {
      if (user && !hasMerged) {
        setIsLoading(true);
        try {
          const guest = getGuestCart();
          if (guest.length > 0) {
            await mergeGuestCart(supabase, user.id, guest);
            clearGuestCart();
            setGuestItems([]);
          }
          setHasMerged(true);
          await fetchCart();
        } catch (err) {
          console.error("Cart merge failed:", err);
          await fetchCart();
        }
      } else if (user) {
        await fetchCart();
      } else {
        async function resetCart() {
          setCartItems([]);
          setIsLoading(false);
        }
        resetCart();
      }
    }

    initCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isUserLoading]);

  const addToCart = async (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    if (user) {
      await upsertCartItem(supabase, user.id, productId, variantId, quantity);
      await fetchCart();
      // removed: router.refresh()
    } else {
      const updated = addToGuestCart(
        guestItems,
        productId,
        variantId,
        quantity,
      );
      setGuestItems(updated);
      saveGuestCart(updated);
    }
  };

  const updateQuantity = async (
    cartItemId: string,
    variantId: string,
    quantity: number,
  ) => {
    if (user) {
      await updateCartItemQuantity(supabase, cartItemId, quantity);
      await fetchCart();
      // removed: router.refresh()
    } else {
      const updated = updateGuestCartQuantity(guestItems, variantId, quantity);
      setGuestItems(updated);
      saveGuestCart(updated);
    }
  };

  const removeItem = async (cartItemId: string, variantId: string) => {
    if (user) {
      await removeCartItem(supabase, cartItemId);
      await fetchCart();
      // removed: router.refresh()
    } else {
      const updated = removeFromGuestCart(guestItems, variantId);
      setGuestItems(updated);
      saveGuestCart(updated);
    }
  };

  const clearAllItems = async () => {
    if (user) {
      await clearCart(supabase, user.id);
      await fetchCart();
      // removed: router.refresh()
    } else {
      clearGuestCart();
      setGuestItems([]);
    }
  };

  const totalCount = user
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : guestItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        guestItems,
        totalCount,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
