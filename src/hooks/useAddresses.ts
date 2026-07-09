// src/hooks/useAddresses.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/supabase/queries/addresses";
import type { Address } from "@/types";

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at">;

export function useAddresses(userId: string) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create client once outside useCallback so it's stable
  // and doesn't need to be in the dependency array
  const supabase = createClient();

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAddresses(supabase);
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // supabase client is stable, userId is the real dependency

  // Use an async IIFE inside useEffect instead of calling
  // fetchAddresses directly — avoids the setState-in-effect warning
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAddresses(supabase);
        if (!isCancelled) {
          setAddresses(data);
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

    load();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleAdd = async (data: AddressFormData) => {
    await addAddress(supabase, userId, data);
    await fetchAddresses();
  };

  const handleUpdate = async (addressId: string, data: AddressFormData) => {
    await updateAddress(supabase, userId, addressId, data);
    await fetchAddresses();
  };

  const handleDelete = async (addressId: string, wasDefault: boolean) => {
    await deleteAddress(supabase, userId, addressId, wasDefault);
    await fetchAddresses();
  };

  return {
    addresses,
    isLoading,
    error,
    handleAdd,
    handleUpdate,
    handleDelete,
    refetch: fetchAddresses,
  };
}
