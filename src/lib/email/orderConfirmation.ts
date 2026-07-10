// src/lib/email/orderConfirmation.ts
import { Resend } from "resend";
import type { OrderWithItems } from "@/types";
import { formatCurrency } from "@/lib/utils/currency";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in environment variables.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an order confirmation email via Resend.
 * Called from the Razorpay webhook handler after payment is verified.
 * Never called client-side.
 */
export async function sendOrderConfirmationEmail(
  order: OrderWithItems,
  customerEmail: string,
): Promise<void> {
  const address = order.shipping_address;

  const itemRows = order.order_items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #D8D6C0;">
          <strong style="color: #1B1B1B;">${item.product_name}</strong>
          <br/>
          <span style="color: #5C5C4E; font-size: 13px;">
            ${item.variant_label} × ${item.quantity}
          </span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #D8D6C0; text-align: right; color: #1F3D2E; font-weight: 600;">
          ${formatCurrency(item.price_at_purchase * item.quantity)}
        </td>
      </tr>
    `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #EDEFDD; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EDEFDD; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; max-width: 600px; width: 100%;">

              <!-- Header -->
              <tr>
                <td style="background-color: #1F3D2E; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 1px;">
                    S.P Royal Foods
                  </h1>
                  <p style="margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                    Pure by Nature
                  </p>
                </td>
              </tr>

              <!-- Order confirmed banner -->
              <tr>
                <td style="background-color: #F1E7D0; padding: 24px 40px; text-align: center;">
                  <p style="margin: 0; font-size: 28px;">✅</p>
                  <h2 style="margin: 8px 0 4px; color: #1B1B1B; font-size: 22px;">
                    Order Confirmed!
                  </h2>
                  <p style="margin: 0; color: #5C5C4E; font-size: 14px;">
                    Thank you for your order. We'll get it packed and shipped soon.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px 40px;">

                  <!-- Order ID -->
                  <p style="margin: 0 0 24px; color: #5C5C4E; font-size: 13px;">
                    Order ID: <strong style="color: #1B1B1B;">#${order.id.slice(0, 8).toUpperCase()}</strong>
                  </p>

                  <!-- Order items -->
                  <h3 style="margin: 0 0 16px; color: #1B1B1B; font-size: 16px;">
                    Your Order
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemRows}
                    <!-- Subtotal -->
                    <tr>
                      <td style="padding: 12px 0 4px; color: #5C5C4E; font-size: 14px;">
                        Subtotal
                      </td>
                      <td style="padding: 12px 0 4px; text-align: right; color: #1B1B1B; font-size: 14px;">
                        ${formatCurrency(order.subtotal)}
                      </td>
                    </tr>
                    <!-- Shipping -->
                    <tr>
                      <td style="padding: 4px 0; color: #5C5C4E; font-size: 14px;">
                        Shipping
                      </td>
                      <td style="padding: 4px 0; text-align: right; color: ${order.shipping_fee === 0 ? "#2F7A3D" : "#1B1B1B"}; font-size: 14px;">
                        ${order.shipping_fee === 0 ? "Free" : formatCurrency(order.shipping_fee)}
                      </td>
                    </tr>
                    <!-- Total -->
                    <tr>
                      <td style="padding: 12px 0 0; border-top: 2px solid #D8D6C0; color: #1B1B1B; font-size: 16px; font-weight: 700;">
                        Total
                      </td>
                      <td style="padding: 12px 0 0; border-top: 2px solid #D8D6C0; text-align: right; color: #1F3D2E; font-size: 18px; font-weight: 700;">
                        ${formatCurrency(order.total)}
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery address -->
                  <h3 style="margin: 32px 0 12px; color: #1B1B1B; font-size: 16px;">
                    Delivering To
                  </h3>
                  <div style="background-color: #F9F9F9; border-radius: 8px; padding: 16px; border: 1px solid #D8D6C0;">
                    <p style="margin: 0; color: #1B1B1B; font-weight: 600;">
                      ${address.full_name}
                    </p>
                    <p style="margin: 6px 0 0; color: #5C5C4E; font-size: 14px; line-height: 1.6;">
                      ${address.address_line1}
                      ${address.address_line2 ? `, ${address.address_line2}` : ""}
                      <br/>
                      ${address.city}, ${address.state} - ${address.pincode}
                      <br/>
                      ${address.phone}
                    </p>
                  </div>

                  <!-- What happens next -->
                  <h3 style="margin: 32px 0 12px; color: #1B1B1B; font-size: 16px;">
                    What Happens Next?
                  </h3>
                  <p style="margin: 0; color: #5C5C4E; font-size: 14px; line-height: 1.7;">
                    We'll prepare your order and ship it soon. You'll receive
                    another email with your tracking details once it's on the way.
                    For any questions, reply to this email or contact us at
                    <a href="mailto:sproyalfood@gmail.com" style="color: #1F3D2E;">
                      sproyalfood@gmail.com
                    </a>.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F1E7D0; padding: 24px 40px; text-align: center;">
                  <p style="margin: 0; color: #5C5C4E; font-size: 12px;">
                    © ${new Date().getFullYear()} S.P Royal Foods. All rights reserved.
                  </p>
                  <p style="margin: 8px 0 0; color: #5C5C4E; font-size: 12px;">
                    Himatnagar, Gujarat, India
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const { error } = await resend.emails.send({
    from: "S.P Royal Foods <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()} | S.P Royal Foods`,
    html,
  });

  if (error) {
    console.error("Failed to send confirmation email:", error);
    throw new Error("Could not send confirmation email.");
  }
}
