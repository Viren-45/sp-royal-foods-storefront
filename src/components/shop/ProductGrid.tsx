// src/components/shop/ProductGrid.tsx
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithDetails } from "@/types";

type ProductGridProps = {
  products: ProductWithDetails[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-base text-[#5C5C4E]">
          No products found in this category yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
