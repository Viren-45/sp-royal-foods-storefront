// src/components/product/ProductInfo.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import type { ProductWithDetails } from "@/types";

type ProductInfoProps = {
  product: ProductWithDetails;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock_status === "out_of_stock";

  const handleAddToCart = () => {
    // TODO (Phase 3): wire up real cart logic — guest cart via
    // localStorage when logged out, Supabase cart_items when
    // logged in. For now this is a non-persisted UI stub.
    alert(
      `Added ${quantity} × ${product.name} to cart (cart not wired up yet)`,
    );
  };

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
        {product.category}
      </p>

      <h1 className="mt-2 font-heading text-3xl font-medium text-[#1B1B1B] sm:text-4xl">
        {product.name}
      </h1>

      <p className="mt-1 text-sm text-[#5C5C4E]">{product.weight_label}</p>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-heading text-2xl font-medium text-[#1F3D2E]">
          {formatCurrency(product.price)}
        </span>
        {isOutOfStock && (
          <span className="rounded-full bg-[#C0392B]/10 px-3 py-1 text-xs font-medium text-[#C0392B]">
            Out of Stock
          </span>
        )}
      </div>

      {product.description && (
        <p className="mt-6 text-base leading-relaxed text-[#5C5C4E]">
          {product.description}
        </p>
      )}

      {product.marketing_badges.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {product.marketing_badges.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 rounded-full border border-[#1F3D2E]/20 px-3 py-1.5 text-xs text-[#1B1B1B]"
            >
              <Leaf size={12} className="text-[#1F3D2E]" />
              {badge}
            </span>
          ))}
        </div>
      )}

      {product.nutrition_info && (
        <div className="mt-8">
          <h3 className="text-sm font-medium uppercase tracking-wide text-[#1B1B1B]">
            Nutrition Information
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(product.nutrition_info).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-[#D8D6C0] px-4 py-3"
              >
                <dt className="text-xs capitalize text-[#5C5C4E]">{key}</dt>
                <dd className="mt-1 text-sm font-medium text-[#1B1B1B]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center rounded-md border border-[#D8D6C0]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            className="p-3 text-[#1B1B1B] disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-medium text-[#1B1B1B]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={isOutOfStock}
            className="p-3 text-[#1B1B1B] disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 bg-[#1F3D2E] py-5 text-white hover:opacity-90 disabled:opacity-40"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
