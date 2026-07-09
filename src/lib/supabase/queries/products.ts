// src/lib/supabase/queries/products.ts
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { ProductCategory, ProductWithDetails } from "@/types";

const PRODUCT_SELECT = `
  *,
  product_variants (*),
  product_images (*)
`;

/**
 * Fetches all products, optionally filtered by category.
 * Works in both Server Components (pass no client) and Client
 * Components (pass a browser client) — see overloaded usage below.
 */
export async function getProducts(
  client:
    | ReturnType<typeof createBrowserClient>
    | Awaited<ReturnType<typeof createServerClient>>,
  category?: ProductCategory,
): Promise<ProductWithDetails[]> {
  let query = client
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not load products. Please try again.");
  }

  return (data ?? []) as ProductWithDetails[];
}

/**
 * Fetches a single product by its slug, including variants and images.
 * Returns null if not found (e.g. bad URL) rather than throwing —
 * lets the calling page decide whether to show a 404.
 */
export async function getProductBySlug(
  client:
    | ReturnType<typeof createBrowserClient>
    | Awaited<ReturnType<typeof createServerClient>>,
  slug: string,
): Promise<ProductWithDetails | null> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch product:", error.message);
    throw new Error("Could not load this product. Please try again.");
  }

  return data as ProductWithDetails | null;
}
