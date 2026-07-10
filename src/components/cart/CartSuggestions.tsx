// src/components/cart/CartSuggestions.tsx
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import type { ProductWithDetails } from "@/types";

type CartSuggestionsProps = {
  products: ProductWithDetails[];
  cartProductIds: string[];
};

export default function CartSuggestions({
  products,
  cartProductIds,
}: CartSuggestionsProps) {
  // Show products not already in the cart
  const suggestions = products
    .filter((p) => !cartProductIds.includes(p.id))
    .slice(0, 8);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="text-xs font-medium uppercase tracking-widest text-[#5C5C4E]">
        You Might Also Like
      </p>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {suggestions.map((product) => {
          const primaryImage =
            product.product_images.find((img) => img.is_primary) ??
            product.product_images[0];

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl bg-white"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#F1E7D0]">
                {primaryImage && (
                  <Image
                    src={primaryImage.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="160px"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-medium text-[#1B1B1B]">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-[#5C5C4E]">
                  {product.weight_label}
                </p>
                <p className="mt-1 font-heading text-sm font-medium text-[#1F3D2E]">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
