// src/components/shop/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import type { ProductWithDetails } from "@/types";

type ProductCardProps = {
  product: ProductWithDetails;
};

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];

  const isOutOfStock = product.stock_status === "out_of_stock";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl bg-[#F1E7D0]"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#D8D6C0] text-sm text-[#5C5C4E]">
            No image available
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[#C0392B]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-medium text-[#1B1B1B]">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-[#5C5C4E]">{product.weight_label}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading text-lg font-medium text-[#1F3D2E]">
            {formatCurrency(product.price)}
          </span>
        </div>

        {product.marketing_badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.marketing_badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#1F3D2E]/20 px-2.5 py-1 text-xs text-[#5C5C4E]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
