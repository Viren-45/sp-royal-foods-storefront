// src/components/ScrollToTop.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets scroll position to the top on every route change.
 * Prevents the browser from restoring a previous scroll position
 * (e.g. from an anchor link like /#why-choose-us) when navigating
 * to a new page or revisiting the homepage.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
