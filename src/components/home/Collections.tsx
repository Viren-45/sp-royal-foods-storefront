"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Local-only type — describes exactly 3 hardcoded collection cards below.
 * Not centralized in types/index.ts since it's not reused elsewhere.
 */
type CollectionCard = {
  slug: "makhana" | "seeds" | "honey";
  name: string;
  description: string;
  image: string;
  badges: string[];
  mobileBg: string; // hex, solid card bg on mobile/tablet (no hover state there)
};

const COLLECTIONS: CollectionCard[] = [
  {
    slug: "makhana",
    name: "Premium Makhana",
    description:
      "Light, crunchy and naturally wholesome. The perfect guilt-free snack for every time of the day.",
    image: "/images/collection-makhana.png",
    badges: [
      "Light & Crunchy",
      "High in Protein",
      "Gluten Free",
      "Rich in Nutrients",
    ],
    mobileBg: "#F1E7D0",
  },
  {
    slug: "seeds",
    name: "Nutritious Seeds",
    description:
      "Packed with essential nutrients, fiber and healthy fats to fuel your body naturally.",
    image: "/images/collection-seeds.png",
    badges: [
      "Source of Energy",
      "Heart Healthy",
      "Rich in Fiber",
      "Omega-3 Source",
    ],
    mobileBg: "#DCE5C8",
  },
  {
    slug: "honey",
    name: "Pure Honey",
    description:
      "100% natural and unprocessed honey. Pure sweetness straight from nature.",
    image: "/images/collection-honey.png",
    badges: [
      "Natural Sweetness",
      "Immunity Booster",
      "No Added Preservatives",
      "Unprocessed Goodness",
    ],
    mobileBg: "#F0DEB8",
  },
];

export default function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
          Our Collection
        </p>
        <h2 className="font-heading text-4xl font-medium text-[#1B1B1B] sm:text-5xl">
          Goodness in Every Bite
        </h2>
        <div className="mx-auto my-6 h-px w-16 bg-[#D8D6C0]" />
        <p className="text-base leading-relaxed text-[#5C5C4E]">
          Carefully selected ingredients, packed with essential nutrients to
          help you live a healthier, happier life.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.slug}
            href={`/shop/${collection.slug}`}
            className="group relative block overflow-hidden rounded-2xl md:h-130"
          >
            {/* ===== Desktop/tablet: image card with hover reveal ===== */}
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Always-visible bottom scrim + label */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-6 transition-opacity duration-300 group-hover:opacity-0">
                <p className="font-(family-name:--font-playfair) text-xl font-medium text-white">
                  {collection.name}
                </p>
              </div>

              {/* Hover glass panel */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 p-8 text-center opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-(family-name:--font-playfair) text-2xl font-medium text-[#1B1B1B]">
                  {collection.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1B1B1B]">
                  {collection.description}
                </p>
                <span className="mt-6 rounded-md bg-[#1F3D2E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
                  Explore {collection.name.split(" ").pop()} →
                </span>
                <ul className="mt-6 flex flex-wrap justify-center gap-3">
                  {collection.badges.map((badge) => (
                    <li
                      key={badge}
                      className="rounded-full border border-[#1F3D2E]/30 bg-white/40 px-3 py-1 text-xs text-[#1B1B1B]"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ===== Mobile/tablet: solid color card, no image, no hover ===== */}
            <div
              className="flex flex-col items-center gap-6 px-6 py-10 text-center md:hidden"
              style={{ backgroundColor: collection.mobileBg }}
            >
              <div>
                <h3 className="font-heading text-2xl font-medium text-[#1B1B1B]">
                  {collection.name}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#5C5C4E]">
                  {collection.description}
                </p>
              </div>

              <span className="inline-block rounded-md bg-[#1F3D2E] px-6 py-3 text-sm font-medium text-white">
                Explore {collection.name.split(" ").pop()} →
              </span>

              <ul className="flex flex-wrap justify-center gap-2">
                {collection.badges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-full border border-[#1F3D2E]/30 bg-white/40 px-3 py-1 text-xs text-[#1B1B1B]"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
