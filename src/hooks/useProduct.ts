// src/hooks/useProduct.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProductBySlug } from "@/lib/supabase/queries/products";
import type { ProductWithDetails } from "@/types";

type UseProductResult = {
  product: ProductWithDetails | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Client-side hook for fetching a single product by slug.
 * Note: the actual Product Detail Page fetches server-side directly
 * via getProductBySlug() for better SEO/performance — this hook
 * exists for any client-side use case that might need it later
 * (e.g. a "quick view" modal).
 */
export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const data = await getProductBySlug(supabase, slug);
        if (!isCancelled) {
          setProduct(data);
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

    fetchProduct();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  return { product, isLoading, error };
}
