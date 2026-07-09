// src/components/home/Hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  FlaskConical,
  Sprout,
  ShieldCheck,
  HandHeart,
} from "lucide-react";

const TRUST_STRIP = [
  { icon: Leaf, label: "100% Natural" },
  { icon: FlaskConical, label: "No Added Preservatives" },
  { icon: Sprout, label: "Rich in Nutrients" },
  { icon: ShieldCheck, label: "Hygienically Packed" },
  { icon: HandHeart, label: "Sourced with Care" },
] as const;

const handleExploreBenefits = () => {
  const section = document.getElementById("why-choose-us");
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth" });

  // Clean the hash from the URL after scrolling so clicking
  // the button again always works, and page refresh stays at top
  setTimeout(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, 800);
};
export default function Hero() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 pb-24 pt-12">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-[#5C5C4E]">
            <span aria-hidden>❧</span>
            Pure by Nature
            <span aria-hidden>❧</span>
          </p>

          {/* Heading */}
          <h1 className="font-heading text-5xl font-medium leading-tight text-[#1B1B1B] sm:text-6xl">
            Nature&apos;s Goodness.
            <br />
            Pure Nutrition.
            <br />
            <span className="text-[#1F3D2E]">Pure You.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-md mt-6 text-base font-medium leading-relaxed text-[#5C5C4E]">
            Premium quality makhanas, seeds and natural honey — carefully
            sourced for a healthier, better tomorrow.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-md bg-[#1F3D2E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop Collection
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={handleExploreBenefits}
              className="rounded-md border border-[#1F3D2E] px-6 py-3 text-sm font-medium text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 cursor-pointer"
            >
              Explore Benefits
            </button>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="absolute bottom-6 left-1/2 z-10 w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 rounded-xl bg-[#EDEFDD]/80 px-6 py-8 backdrop-blur-sm">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:justify-between">
          {TRUST_STRIP.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1F3D2E]/30 text-[#1F3D2E]">
                <Icon size={20} />
              </span>
              <span className="max-w-26 text-base leading-tight text-[#1B1B1B]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
