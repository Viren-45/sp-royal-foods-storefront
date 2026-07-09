// src/components/home/WhyChooseUs.tsx
import Image from "next/image";

type WhyChooseUsItem = {
  image: string;
  title: string;
  description: string;
};

const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    image: "/images/why-farm-sourced.png",
    title: "Farm Sourced, Family Trusted",
    description:
      "Every batch begins at the source — grown with care by farmers we know, and trusted by families across India for generations.",
  },
  {
    image: "/images/why-natural.png",
    title: "100% Natural, No Preservatives",
    description:
      "No shortcuts, no additives. Just makhana, seeds, and honey exactly as nature intended them to be.",
  },
  {
    image: "/images/why-hygienic.png",
    title: "Hygienically Packed & Quality Assured",
    description:
      "Every pouch is sealed with care under strict hygiene standards, so freshness reaches you exactly as it left us.",
  },
  {
    image: "/images/why-nutrients.png",
    title: "Rich in Nutrients",
    description:
      "Naturally packed with protein, fiber, and essential nutrients your body deserves — no compromises.",
  },
  {
    image: "/images/why-tradition.png",
    title: "Rooted in Tradition",
    description:
      "Recipes and sourcing practices passed down through generations, honoring the traditions that built our name.",
  },
  {
    image: "/images/why-sourced-care.png",
    title: "Sourced with Care",
    description:
      "From farm to jar, every step is handled with the same care we'd want for our own family's table.",
  },
];

function BentoCard({
  item,
  large = false,
}: {
  item: WhyChooseUsItem;
  large?: boolean;
}) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl bg-[#F1E7D0] ${
        large ? "min-h-95" : "min-h-45"
      }`}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={large ? "60vw" : "30vw"}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3
          className={`font-heading font-medium text-white ${
            large ? "text-2xl" : "text-lg"
          }`}
        >
          {item.title}
        </h3>
        {large && (
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="mx-auto max-w-7xl px-6 py-20">
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
          Why Choose Us
        </p>
        <h2 className="font-heading text-4xl font-medium text-[#1B1B1B] sm:text-5xl">
          The S.P Royal Foods Difference
        </h2>
        <div className="mx-auto my-6 h-px w-16 bg-[#D8D6C0]" />
      </div>

      {/* Bento grid */}
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Row 1: large card (spans 2 cols) + one small card */}
        <div className="sm:col-span-2">
          <BentoCard item={WHY_CHOOSE_US[0]} large />
        </div>
        <div className="flex flex-col gap-4">
          <BentoCard item={WHY_CHOOSE_US[1]} />
          <BentoCard item={WHY_CHOOSE_US[2]} />
        </div>

        {/* Row 2: one small card + large card (spans 2 cols) */}
        <div className="flex flex-col gap-4">
          <BentoCard item={WHY_CHOOSE_US[3]} />
          <BentoCard item={WHY_CHOOSE_US[4]} />
        </div>
        <div className="sm:col-span-2">
          <BentoCard item={WHY_CHOOSE_US[5]} large />
        </div>
      </div>
    </section>
  );
}
