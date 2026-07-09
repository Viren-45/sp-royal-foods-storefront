// src/app/(site)/(main)/shop/[category]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/supabase/queries/products";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ProductGrid from "@/components/shop/ProductGrid";
import type { ProductCategory } from "@/types";

const VALID_CATEGORIES: ProductCategory[] = ["makhana", "seeds", "honey"];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  makhana: "Makhana",
  seeds: "Seeds",
  honey: "Honey",
};

type ShopCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: ShopCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as ProductCategory] ?? "Shop";
  return {
    title: `${label} | S.P Royal Foods`,
  };
}

export default async function ShopCategoryPage({
  params,
}: ShopCategoryPageProps) {
  const { category } = await params;

  // Guard against invalid category slugs in the URL (e.g. /shop/pizza)
  if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
    notFound();
  }

  const validCategory = category as ProductCategory;

  const supabase = await createClient();
  const products = await getProducts(supabase, validCategory);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
          Our Products
        </p>
        <h1 className="font-heading text-4xl font-medium text-[#1B1B1B] sm:text-5xl">
          {CATEGORY_LABELS[validCategory]}
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
