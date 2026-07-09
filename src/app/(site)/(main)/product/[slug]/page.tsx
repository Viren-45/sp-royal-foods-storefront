// src/app/(site)/(main)/product/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/lib/supabase/queries/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import BackButton from "@/components/product/BackButton";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProductBySlug(supabase, slug);

  if (!product) {
    return { title: "Product Not Found | S.P Royal Foods" };
  }

  return {
    title: `${product.name} | S.P Royal Foods`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProductBySlug(supabase, slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <BackButton />

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery
          images={product.product_images}
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>
    </main>
  );
}
