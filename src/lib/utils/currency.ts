// src/lib/utils/currency.ts
/**
 * Formats a number as Indian Rupees, e.g. 249 -> "₹249", 1499.5 -> "₹1,499.50"
 * Used anywhere a price is displayed: Shop grid, Product page, Cart, Checkout.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
