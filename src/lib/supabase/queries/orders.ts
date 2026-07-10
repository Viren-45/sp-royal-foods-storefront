// src/lib/supabase/queries/orders.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Order,
  OrderWithItems,
  OrderItem,
  ShippingAddress,
  CartItemWithProduct,
} from "@/types";

/**
 * Fetches all orders for the logged-in user, newest first.
 */
export async function getOrders(client: SupabaseClient): Promise<Order[]> {
  const { data, error } = await client
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error.message);
    throw new Error("Could not load orders.");
  }

  return (data ?? []) as Order[];
}

/**
 * Fetches a single order with its items by order ID.
 * Only returns the order if it belongs to the logged-in user
 * (enforced by RLS policy).
 */
export async function getOrderById(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderWithItems | null> {
  const { data, error } = await client
    .from("orders")
    .select(
      `
      *,
      order_items (*)
    `,
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch order:", error.message);
    throw new Error("Could not load order.");
  }

  return data as OrderWithItems | null;
}

/**
 * Creates a pending order in the database before payment.
 * Returns the created order ID — used to create the Razorpay
 * order and associate it with this DB record.
 */
export async function createOrder(
  client: SupabaseClient,
  userId: string,
  params: {
    addressId: string;
    shippingAddress: ShippingAddress;
    cartItems: CartItemWithProduct[];
    subtotal: number;
    shippingFee: number;
    total: number;
  },
): Promise<string> {
  // Create the order row first
  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending",
      address_id: params.addressId,
      shipping_address: params.shippingAddress,
      subtotal: params.subtotal,
      shipping_fee: params.shippingFee,
      total: params.total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError?.message);
    throw new Error("Could not create order.");
  }

  // Insert order items — snapshot product name, variant, price
  const orderItems: Omit<OrderItem, "id" | "created_at">[] =
    params.cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
      product_name: item.product.name,
      variant_label: item.variant.size_label,
    }));

  const { error: itemsError } = await client
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to insert order items:", itemsError.message);
    throw new Error("Could not save order items.");
  }

  return order.id;
}
