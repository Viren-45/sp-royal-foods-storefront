// src/app/(site)/(main)/shop/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/supabase/queries/products";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata: Metadata = {
  title: "Shop | S.P Royal Foods",
  description: "Browse our full range of premium makhana, seeds, and honey.",
};

export default async function ShopPage() {
  const supabase = await createClient();
  const products = await getProducts(supabase);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
          Our Products
        </p>
        <h1 className="font-heading text-4xl font-medium text-[#1B1B1B] sm:text-5xl">
          Shop Our Collection
        </h1>
        <div className="mx-auto my-6 h-px w-16 bg-[#D8D6C0]" />
      </div>

      <div className="mt-10">
        <CategoryTabs />
      </div>

      <div className="mt-12">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
