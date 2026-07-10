// src/lib/supabase/queries/cart.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItemWithProduct, GuestCartItem } from "@/types";

/**
 * Fetches all cart items for the logged-in user,
 * joined with product and variant data.
 */
export async function getCartItems(
  client: SupabaseClient,
): Promise<CartItemWithProduct[]> {
  const { data, error } = await client
    .from("cart_items")
    .select(
      `
    *,
    product:products(
      *,
      product_variants(*),
      product_images(*)
    ),
    variant:product_variants(*)
  `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch cart:", error.message);
    throw new Error("Could not load cart.");
  }

  return (data ?? []) as CartItemWithProduct[];
}

/**
 * Adds an item to the cart or increments quantity if already exists.
 * Uses upsert to handle the unique(user_id, variant_id) constraint.
 */
export async function upsertCartItem(
  client: SupabaseClient,
  userId: string,
  productId: string,
  variantId: string,
  quantity: number,
): Promise<void> {
  // Check if item already exists
  const { data: existing } = await client
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("variant_id", variantId)
    .maybeSingle();

  if (existing) {
    // Increment existing quantity
    const { error } = await client
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);

    if (error) throw new Error("Could not update cart item.");
  } else {
    // Insert new cart item
    const { error } = await client.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      variant_id: variantId,
      quantity,
    });

    if (error) throw new Error("Could not add item to cart.");
  }
}

/**
 * Updates quantity of a specific cart item.
 */
export async function updateCartItemQuantity(
  client: SupabaseClient,
  cartItemId: string,
  quantity: number,
): Promise<void> {
  const { error } = await client
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) throw new Error("Could not update quantity.");
}

/**
 * Removes a specific item from the cart.
 */
export async function removeCartItem(
  client: SupabaseClient,
  cartItemId: string,
): Promise<void> {
  const { error } = await client
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw new Error("Could not remove item from cart.");
}

/**
 * Clears all items from the cart — used after merge or checkout.
 */
export async function clearCart(
  client: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await client
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error("Could not clear cart.");
}

/**
 * Merges guest cart (localStorage) into the user's Supabase cart
 * on login. For each guest item, upserts into cart_items —
 * incrementing quantity if already exists, inserting if not.
 */
export async function mergeGuestCart(
  client: SupabaseClient,
  userId: string,
  guestItems: GuestCartItem[],
): Promise<void> {
  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    await upsertCartItem(
      client,
      userId,
      item.product_id,
      item.variant_id,
      item.quantity,
    );
  }
}
