// src/app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay/client";
import { createOrder } from "@/lib/supabase/queries/orders";
import { getShippingSettings } from "@/lib/supabase/queries/settings";
import { getCartItems } from "@/lib/supabase/queries/cart";
import type { ShippingAddress } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, shippingAddress } = body as {
      addressId: string;
      shippingAddress: ShippingAddress;
    };

    if (!addressId || !shippingAddress) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    // Fetch cart and shipping settings server-side —
    // never trust amounts sent from the client
    const [cartItems, shippingSettings] = await Promise.all([
      getCartItems(supabase),
      getShippingSettings(supabase),
    ]);

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals server-side
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const shippingFee =
      subtotal >= shippingSettings.freeShippingThreshold
        ? 0
        : shippingSettings.flatShippingFee;
    const total = subtotal + shippingFee;

    // Create order in DB first (status: pending)
    const orderId = await createOrder(supabase, user.id, {
      addressId,
      shippingAddress,
      cartItems,
      subtotal,
      shippingFee,
      total,
    });

    // Create Razorpay order — amount in paise (INR × 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: orderId,
      notes: {
        order_id: orderId,
        user_id: user.id,
      },
    });

    // Store razorpay_order_id on our DB order
    await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", orderId);

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
