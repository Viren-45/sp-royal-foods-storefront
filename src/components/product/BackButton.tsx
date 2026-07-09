// src/components/product/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-medium text-[#5C5C4E] transition-colors hover:text-[#1F3D2E] cursor-pointer"
    >
      <ArrowLeft size={16} />
      Back to Shop
    </button>
  );
}
