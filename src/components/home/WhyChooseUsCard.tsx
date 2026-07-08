// // src/components/home/WhyChooseUscard.tsx

import Image from "next/image";

type WhyChooseUsCardProps = {
  image: string;
  title: string;
  description: string;
  variant: "desktop" | "mobile";
};

export default function WhyChooseUsCard({
  image,
  title,
  description,
  variant,
}: WhyChooseUsCardProps) {
  if (variant === "mobile") {
    // Mobile: image with title overlaid at bottom, glass panel treatment
    // (same pattern used on Collections mobile cards)
    return (
      <div className="relative h-105 w-full shrink-0 snap-center overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/20 px-5 py-4 text-center backdrop-blur-md">
          <p className="font-heading text-lg font-medium text-white">{title}</p>
        </div>
      </div>
    );
  }

  // Desktop: image left, text right
  return (
    <div className="flex h-105 w-full items-stretch overflow-hidden rounded-2xl bg-[#F1E7D0]">
      <div className="relative w-1/2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="50vw"
        />
      </div>
      <div className="flex w-1/2 flex-col justify-center px-10">
        <h3 className="font-heading text-2xl font-medium text-[#1B1B1B]">
          {title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[#5C5C4E]">
          {description}
        </p>
      </div>
    </div>
  );
}
