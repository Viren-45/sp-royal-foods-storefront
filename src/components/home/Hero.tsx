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
  setTimeout(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, 800);
};

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ===== Mobile background image (portrait, centered content) ===== */}
      <div className="relative min-h-screen sm:hidden">
        <Image
          src="/images/hero-bg-mobile.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Subtle center overlay for text legibility */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Mobile content — centered */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 pb-48 pt-24 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#5C5C4E]">
            Pure by Nature
          </p>

          <h1 className="font-heading text-4xl font-medium leading-tight text-[#1B1B1B]">
            Nature&apos;s Goodness.
            <br />
            Pure Nutrition.
            <br />
            <span className="text-[#1F3D2E]">Pure You.</span>
          </h1>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#5C5C4E]">
            Premium quality makhanas, seeds and natural honey — carefully
            sourced for a healthier, better tomorrow.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#1F3D2E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop Collection
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={handleExploreBenefits}
              className="w-full rounded-md border border-[#1F3D2E] px-6 py-3 text-sm font-medium text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 cursor-pointer"
            >
              Explore Benefits
            </button>
          </div>
        </div>

        {/* Mobile trust strip — horizontal scroll */}
        <div className="absolute bottom-6 left-0 right-0 z-10 px-4">
          <div className="rounded-xl bg-[#EDEFDD]/80 px-4 py-4 backdrop-blur-sm">
            <ul className="flex items-center gap-6 overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
              {TRUST_STRIP.map(({ icon: Icon, label }) => (
                <li key={label} className="flex shrink-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1F3D2E]/30 text-[#1F3D2E]">
                    <Icon size={14} />
                  </span>
                  <span className="text-xs leading-tight text-[#1B1B1B] whitespace-nowrap">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== Tablet + Desktop (sm and up): original layout ===== */}
      <div className="relative hidden min-h-[85vh] sm:block">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 pb-24 pt-12">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-[#5C5C4E]">
              <span aria-hidden>❧</span>
              Pure by Nature
              <span aria-hidden>❧</span>
            </p>

            <h1 className="font-heading text-5xl font-medium leading-tight text-[#1B1B1B] sm:text-6xl">
              Nature&apos;s Goodness.
              <br />
              Pure Nutrition.
              <br />
              <span className="text-[#1F3D2E]">Pure You.</span>
            </h1>

            <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-[#5C5C4E]">
              Premium quality makhanas, seeds and natural honey — carefully
              sourced for a healthier, better tomorrow.
            </p>

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
                className="cursor-pointer rounded-md border border-[#1F3D2E] px-6 py-3 text-sm font-medium text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5"
              >
                Explore Benefits
              </button>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
}
