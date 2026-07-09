// src/lib/supabase/queries/addresses.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Address } from "@/types";

/**
 * Fetches all addresses for the logged-in user,
 * default address always first.
 */
export async function getAddresses(client: SupabaseClient): Promise<Address[]> {
  const { data, error } = await client
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch addresses:", error.message);
    throw new Error("Could not load addresses.");
  }

  return (data ?? []) as Address[];
}

/**
 * Inserts a new address. If is_default is true,
 * clears the default flag on all other addresses first.
 */
export async function addAddress(
  client: SupabaseClient,
  userId: string,
  address: Omit<Address, "id" | "user_id" | "created_at">,
): Promise<void> {
  if (address.is_default) {
    await client
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { error } = await client
    .from("addresses")
    .insert({ ...address, user_id: userId });

  if (error) {
    console.error("Failed to add address:", error.message);
    throw new Error("Could not save address.");
  }
}

/**
 * Updates an existing address. If is_default is true,
 * clears the default flag on all other addresses first.
 */
export async function updateAddress(
  client: SupabaseClient,
  userId: string,
  addressId: string,
  address: Omit<Address, "id" | "user_id" | "created_at">,
): Promise<void> {
  if (address.is_default) {
    await client
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId)
      .neq("id", addressId);
  }

  const { error } = await client
    .from("addresses")
    .update(address)
    .eq("id", addressId);

  if (error) {
    console.error("Failed to update address:", error.message);
    throw new Error("Could not update address.");
  }
}

/**
 * Deletes an address. If it was the default,
 * the next most recent address becomes default automatically.
 */
export async function deleteAddress(
  client: SupabaseClient,
  userId: string,
  addressId: string,
  wasDefault: boolean,
): Promise<void> {
  const { error } = await client.from("addresses").delete().eq("id", addressId);

  if (error) {
    console.error("Failed to delete address:", error.message);
    throw new Error("Could not delete address.");
  }

  // If deleted address was default, make the next one default
  if (wasDefault) {
    const { data } = await client
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data) {
      await client
        .from("addresses")
        .update({ is_default: true })
        .eq("id", data.id);
    }
  }
}
