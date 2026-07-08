// src/components/home/OurStoryPreview.tsx

import Image from "next/image";
import Link from "next/link";

export default function OurStoryPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-2xl bg-[#F1E7D0] lg:grid-cols-2 lg:gap-0">
        {/* Image */}
        <div className="relative h-100 w-full lg:h-140">
          <Image
            src="/images/our-story-preview.png"
            alt="Hand-sorting premium makhana, a tradition passed down through generations"
            fill
            className="object-cover"
          />
        </div>

        {/* Text content */}
        <div className="px-6 py-10 text-center lg:px-16 lg:text-left">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#C9A227]">
            Our Story
          </p>

          <h2 className="font-heading text-4xl font-medium leading-tight text-[#1B1B1B] sm:text-5xl">
            A Legacy of Purity,
            <br />
            Rooted in Tradition
          </h2>

          <div className="mx-auto my-6 h-px w-16 bg-[#D8D6C0] lg:mx-0" />

          <p className="mx-auto max-w-md text-base leading-relaxed text-[#5C5C4E] lg:mx-0">
            What began as one family&apos;s commitment to quality and purity has
            grown into a trusted name across India. Every batch we pack still
            carries that same care, sorted by hand and rooted in the values
            passed down through generations.
          </p>

          <Link
            href="/our-story"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1F3D2E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Read Our Full Story
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
