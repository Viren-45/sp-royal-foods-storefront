// src/components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { CartItemWithProduct } from "@/types";

type CartItemProps = {
  item: CartItemWithProduct;
  onUpdateQuantity: (
    cartItemId: string,
    variantId: string,
    quantity: number,
  ) => Promise<void>;
  onRemove: (cartItemId: string, variantId: string) => Promise<void>;
};

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const primaryImage =
    item.product.product_images?.find((img) => img.is_primary) ??
    item.product.product_images?.[0];

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 sm:p-5">
      {/* Product image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F1E7D0] sm:h-28 sm:w-28"
      >
        {primaryImage && (
          <Image
            src={primaryImage.image_url}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="font-heading text-base font-medium text-[#1B1B1B] hover:text-[#1F3D2E]"
            >
              {item.product.name}
            </Link>
            <p className="mt-0.5 text-xs text-[#5C5C4E]">
              {item.variant.size_label}
            </p>
          </div>
          <p className="font-heading text-base font-medium text-[#1F3D2E]">
            {formatCurrency(item.product.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity selector */}
          <div className="flex items-center rounded-lg border border-[#D8D6C0]">
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.variant_id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="p-2 text-[#1B1B1B] transition-colors hover:text-[#1F3D2E] disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-[#1B1B1B]">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.variant_id, item.quantity + 1)
              }
              className="p-2 text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id, item.variant_id)}
            className="flex cursor-pointer items-center gap-1.5 text-xs text-[#C0392B] transition-opacity hover:opacity-70"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
