// src/hooks/useCarousel.ts

import { useState } from "react";

/**
 * Generic carousel state hook — index tracking with circular
 * (infinite-loop) next/prev navigation. Reusable across any
 * fixed-length carousel (Why Choose Us, Customer Feedback, etc.)
 */
export function useCarousel(itemCount: number, initialIndex: number = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = () => setCurrentIndex((prev) => (prev + 1) % itemCount);

  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);

  const goTo = (index: number) => setCurrentIndex(index);

  return { currentIndex, next, prev, goTo };
}
