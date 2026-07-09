// src/components/product/ProductGallery.tsx

import Image from "next/image";
import type { ProductImage } from "@/types";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  // TODO (future phase): once products have multiple images, extend
  // this into a full gallery — thumbnail row + main image swap on
  // click/hover. For now, just show the primary (or first) image.
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F1E7D0]">
      {primaryImage ? (
        <Image
          src={primaryImage.image_url}
          alt={productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-[#5C5C4E]">
          No image available
        </div>
      )}
    </div>
  );
}
