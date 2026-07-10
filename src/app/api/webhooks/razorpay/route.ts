// src/app/api/webhooks/razorpay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { clearCart } from "@/lib/supabase/queries/cart";
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation";

/**
 * Admin Supabase client — uses service role key to bypass RLS.
 * Required here because the webhook is not a user request
 * (no session/cookie), so the regular server client can't
 * update orders or fetch user emails.
 */
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature — CRITICAL security check.
    // Never process webhook data without verifying this first.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createAdminClient();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;
      const razorpaySignature = signature;

      // Find our order by razorpay_order_id
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("razorpay_order_id", razorpayOrderId)
        .maybeSingle();

      if (orderError || !order) {
        console.error(
          "Order not found for razorpay_order_id:",
          razorpayOrderId,
        );
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Update order to confirmed + store payment details
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Failed to update order:", updateError.message);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 },
        );
      }

      // Clear the customer's cart
      await clearCart(supabase, order.user_id);

      // Fetch customer email from auth.users
      const { data: userData } = await supabase.auth.admin.getUserById(
        order.user_id,
      );
      const customerEmail = userData?.user?.email;

      // Send confirmation email
      if (customerEmail) {
        try {
          await sendOrderConfirmationEmail(order, customerEmail);
        } catch (emailError) {
          // Log but don't fail the webhook — order is confirmed,
          // email failure shouldn't roll back the payment confirmation
          console.error("Failed to send confirmation email:", emailError);
        }
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      // Mark order as cancelled on payment failure
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("razorpay_order_id", razorpayOrderId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
