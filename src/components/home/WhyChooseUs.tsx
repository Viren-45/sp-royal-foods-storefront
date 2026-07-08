// shivpushp/src/components/home/WhyChooseUs.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WhyChooseUsCard from "./WhyChooseUsCard";

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

// Clone last card at the start and first card at the end, so the track
// can scroll seamlessly "past" the real edges. Extended index 0 = clone
// of last, extended indices 1..N = real cards, extended index N+1 = clone
// of first.
const EXTENDED = [
  WHY_CHOOSE_US[WHY_CHOOSE_US.length - 1],
  ...WHY_CHOOSE_US,
  WHY_CHOOSE_US[0],
];

const REAL_START_INDEX = 3; // card 4, zero-indexed -> logical index 3

export default function WhyChooseUs() {
  // ===== Mobile: simple non-looping swipe carousel (no arrows needed) =====
  const [mobileIndex, setMobileIndex] = useState(REAL_START_INDEX);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileIsProgrammatic = useRef(false);
  const mobileIsFirstRender = useRef(true);

  useEffect(() => {
    mobileIsProgrammatic.current = true;
    const track = mobileTrackRef.current;
    const card = track?.children[mobileIndex] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: mobileIsFirstRender.current ? "instant" : "smooth",
      inline: "center",
      block: "nearest",
    });
    mobileIsFirstRender.current = false;
    const t = setTimeout(() => (mobileIsProgrammatic.current = false), 600);
    return () => clearTimeout(t);
  }, [mobileIndex]);

  const handleMobileScroll = () => {
    if (mobileIsProgrammatic.current) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    if (closest !== mobileIndex) setMobileIndex(closest);
  };

  // ===== Tablet/Desktop: infinite-loop carousel via cloned edge cards =====
  const [extIndex, setExtIndex] = useState(REAL_START_INDEX + 1); // +1 offset for prepended clone
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const desktopIsProgrammatic = useRef(false);
  const desktopIsFirstRender = useRef(true);
  const skipNextTransition = useRef(false); // true when snapping clone -> real, instantly

  // logicalIndex is the "real" 0-5 index, used for dots and for keeping
  // the desktop track in sync — derived from extIndex by removing the offset.
  const logicalIndex =
    (((extIndex - 1) % WHY_CHOOSE_US.length) + WHY_CHOOSE_US.length) %
    WHY_CHOOSE_US.length;

  useEffect(() => {
    desktopIsProgrammatic.current = true;
    const track = carouselTrackRef.current;
    const card = track?.children[extIndex] as HTMLElement | undefined;

    card?.scrollIntoView({
      behavior:
        desktopIsFirstRender.current || skipNextTransition.current
          ? "instant"
          : "smooth",
      inline: "center",
      block: "nearest",
    });

    desktopIsFirstRender.current = false;

    // If we just landed on a clone (index 0 or the last extended index),
    // wait for the scroll to settle, then instantly jump to the matching
    // real card with no animation — invisible to the user since the
    // clone is visually identical to the real card.
    const isLeftClone = extIndex === 0;
    const isRightClone = extIndex === EXTENDED.length - 1;

    const t = setTimeout(() => {
      desktopIsProgrammatic.current = false;

      if (isLeftClone) {
        skipNextTransition.current = true;
        setExtIndex(WHY_CHOOSE_US.length); // real last card's extended index
      } else if (isRightClone) {
        skipNextTransition.current = true;
        setExtIndex(1); // real first card's extended index
      } else {
        skipNextTransition.current = false;
      }
    }, 500);

    return () => clearTimeout(t);
  }, [extIndex]);

  const handleDesktopScroll = () => {
    if (desktopIsProgrammatic.current) return;
    const track = carouselTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    if (closest !== extIndex) setExtIndex(closest);
  };

  const goToNext = () => setExtIndex((i) => i + 1);
  const goToPrev = () => setExtIndex((i) => i - 1);
  const goToDot = (logicalIdx: number) => setExtIndex(logicalIdx + 1);

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

      {/* ===== Mobile: image-only swipe carousel, no arrows ===== */}
      <div
        ref={mobileTrackRef}
        onScroll={handleMobileScroll}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 sm:hidden [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {WHY_CHOOSE_US.map((item) => (
          <WhyChooseUsCard
            key={item.title}
            image={item.image}
            title={item.title}
            description={item.description}
            variant="mobile"
          />
        ))}
      </div>

      {/* ===== Tablet + Desktop: infinite-loop carousel ===== */}
      <div className="mx-auto mt-14 hidden sm:block">
        <div
          ref={carouselTrackRef}
          onScroll={handleDesktopScroll}
          className="flex snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth
                     px-0 sm:px-0 lg:px-[12.5%]
                     [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {EXTENDED.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="w-full shrink-0 snap-center sm:w-full lg:w-[80%]"
            >
              <WhyChooseUsCard
                image={item.image}
                title={item.title}
                description={item.description}
                variant="desktop"
              />
            </div>
          ))}
        </div>

        {/* Controls row */}
        <div className="mt-6 flex items-center justify-between lg:px-[20%]">
          <button
            aria-label="Previous"
            onClick={goToPrev}
            className="cursor-pointer rounded-full border border-[#1F3D2E]/30 bg-white p-2 text-[#1F3D2E] shadow-md transition-colors hover:bg-[#1F3D2E] hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {WHY_CHOOSE_US.map((item, index) => (
              <button
                key={item.title}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToDot(index)}
                className={`h-2 rounded-full transition-all ${
                  index === logicalIndex
                    ? "w-6 bg-[#1F3D2E]"
                    : "w-2 bg-[#D8D6C0]"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next"
            onClick={goToNext}
            className="cursor-pointer rounded-full border border-[#1F3D2E]/30 bg-white p-2 text-[#1F3D2E] shadow-md transition-colors hover:bg-[#1F3D2E] hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Mobile-only dots */}
      <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
        {WHY_CHOOSE_US.map((item, index) => (
          <button
            key={item.title}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setMobileIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === mobileIndex ? "w-6 bg-[#1F3D2E]" : "w-2 bg-[#D8D6C0]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
