// src/components/home/CustomerFeedback.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";

/**
 * Local-only type — hardcoded testimonials, not tied to a database
 * or reused elsewhere, per project spec.
 */
type Testimonial = {
  name: string;
  location: string;
  rating: number;
  quote: string;
  initials: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    quote:
      "The makhana is incredibly fresh and crunchy — you can genuinely taste the difference from anything I've bought before. It's become our family's everyday snack.",
    initials: "PS",
  },
  {
    name: "Rahul Mehta",
    location: "Mumbai, Maharashtra",
    rating: 5,
    quote:
      "I switched to their seeds mix for my morning smoothie and haven't looked back. Great quality, honest pricing, and it always arrives well packed.",
    initials: "RM",
  },
  {
    name: "Anjali Patel",
    location: "Surat, Gujarat",
    rating: 5,
    quote:
      "Pure, unprocessed honey that actually tastes like honey should. You can tell this is a family business that genuinely cares about quality.",
    initials: "AP",
  },
  {
    name: "Vikram Nair",
    location: "Bengaluru, Karnataka",
    rating: 4,
    quote:
      "Ordered the roasted makhana for a family gathering and everyone asked where I got it from. Will definitely be reordering for the festive season.",
    initials: "VN",
  },
  {
    name: "Sneha Joshi",
    location: "Pune, Maharashtra",
    rating: 5,
    quote:
      "Finally a healthy snack my kids actually enjoy. No preservatives, no guilt — exactly what we were looking for as a family.",
    initials: "SJ",
  },
];

const AUTO_ADVANCE_MS = 10000;

export default function CustomerFeedback() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoAdvance = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startAutoAdvance(); // reset the timer so it doesn't jump right after a manual click
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#1F3D2E]">
          Customer Feedback
        </p>
        <h2 className="font-heading text-4xl font-medium text-[#1B1B1B] sm:text-5xl">
          Loved by Families Across India
        </h2>
        <div className="mx-auto my-6 h-px w-16 bg-[#D8D6C0]" />
      </div>

      {/* Quote card */}
      <div className="relative mt-14 min-h-80">
        <Quote
          size={48}
          className="mx-auto mb-4 text-[#C9A227]/40"
          strokeWidth={1.5}
        />

        <div
          key={currentIndex} // forces re-mount so the fade transition replays each time
          className="animate-[fadeIn_0.6s_ease-out] text-center"
        >
          {/* Star rating */}
          <div className="mb-5 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < current.rating
                    ? "fill-[#C9A227] text-[#C9A227]"
                    : "fill-none text-[#D8D6C0]"
                }
              />
            ))}
          </div>

          {/* Quote text */}
          <p className="font-heading text-xl italic leading-relaxed text-[#1B1B1B] sm:text-2xl">
            &ldquo;{current.quote}&rdquo;
          </p>

          {/* Customer info */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F3D2E] text-sm font-semibold text-white">
              {current.initials}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#1B1B1B]">
                {current.name}
              </p>
              <p className="text-xs text-[#5C5C4E]">{current.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="mt-10 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((testimonial, index) => (
          <button
            key={testimonial.name}
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              index === currentIndex ? "w-6 bg-[#1F3D2E]" : "w-2 bg-[#D8D6C0]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
