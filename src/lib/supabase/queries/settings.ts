// src/lib/supabase/queries/settings.ts
import type { SupabaseClient } from "@supabase/supabase-js";

type ShippingSettings = {
  flatShippingFee: number;
  freeShippingThreshold: number;
};

/**
 * Fetches shipping settings from the settings table.
 * Falls back to safe defaults if keys are missing.
 * Used on Cart, Checkout, and Order Summary.
 */
export async function getShippingSettings(
  client: SupabaseClient,
): Promise<ShippingSettings> {
  const { data, error } = await client
    .from("settings")
    .select("key, value")
    .in("key", ["flat_shipping_fee", "free_shipping_threshold"]);

  if (error) {
    console.error("Failed to fetch settings:", error.message);
    // Safe fallback — better to charge shipping than give it free
    // accidentally if settings table is unreachable
    return { flatShippingFee: 50, freeShippingThreshold: 1000 };
  }

  const map = Object.fromEntries(
    (data ?? []).map((row) => [row.key, Number(row.value)]),
  );

  return {
    flatShippingFee: map["flat_shipping_fee"] ?? 50,
    freeShippingThreshold: map["free_shipping_threshold"] ?? 1000,
  };
}
