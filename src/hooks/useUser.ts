// src/hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type UseUserResult = {
  user: User | null;
  isLoading: boolean;
};

/**
 * Client-side hook for accessing the current authenticated user.
 * Subscribes to auth state changes so it stays reactive across
 * login/logout events — even in other tabs.
 *
 * Use this in Client Components that need auth state (AccountMenu,
 * AccountSidebar, etc.). For Server Components, use
 * createClient() from lib/supabase/server.ts directly.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}
