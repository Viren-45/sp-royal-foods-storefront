// src/hooks/useProducts.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProducts } from "@/lib/supabase/queries/products";
import type { ProductCategory, ProductWithDetails } from "@/types";

type UseProductsResult = {
  products: ProductWithDetails[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Client-side hook for fetching products, optionally filtered by
 * category. Used on the Shop page for client-side category
 * switching without a full page reload.
 */
export function useProducts(category?: ProductCategory): UseProductsResult {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const data = await getProducts(supabase, category);
        if (!isCancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    // Prevents a race condition: if the category changes again before
    // the previous fetch resolves, we ignore the stale response
    // instead of overwriting newer data with older data.
    return () => {
      isCancelled = true;
    };
  }, [category]);

  return { products, isLoading, error };
}
