// src/components/shop/CategoryTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProductCategory } from "@/types";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All Products", value: "all" },
  { label: "Makhana", value: "makhana" },
  { label: "Seeds", value: "seeds" },
  { label: "Honey", value: "honey" },
];

export default function CategoryTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {CATEGORIES.map((cat) => {
        const href = cat.value === "all" ? "/shop" : `/shop/${cat.value}`;
        const isActive = pathname === href;

        return (
          <Link
            key={cat.value}
            href={href}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1F3D2E] text-white"
                : "border border-[#D8D6C0] text-[#1B1B1B] hover:border-[#1F3D2E]"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
