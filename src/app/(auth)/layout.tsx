// src/app/(auth)/layout.tsx

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#EDEFDD] lg:p-4">
      {/* Left: form content */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="S.P Royal Foods"
              width={44}
              height={44}
            />
            <span className="font-heading text-lg font-medium text-[#1B1B1B]">
              S.P. Royal Foods
            </span>
          </Link>

          {children}
        </div>
      </div>

      {/* Right: floating image panel — desktop only */}
      <div className="relative hidden w-1/2 overflow-hidden rounded-3xl lg:block">
        <Image
          src="/images/auth-panel-bg.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="rounded-2xl bg-black/20 p-8 text-center backdrop-blur-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Rooted in Tradition
            </p>
            <h2 className="font-heading text-4xl font-medium leading-[1.2] text-white">
              Pure Nutrition,
              <br />
              Delivered with Care
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Join thousands of families who trust S.P Royal Foods for premium
              makhana, seeds, and honey — sourced with tradition, packed with
              purity.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6 border-t border-white/15 pt-6">
              <div>
                <p className="font-heading text-xl font-medium text-white">
                  10,000+
                </p>
                <p className="text-[11px] uppercase tracking-wide text-white/60">
                  Happy Customers
                </p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="font-heading text-xl font-medium text-white">
                  100%
                </p>
                <p className="text-[11px] uppercase tracking-wide text-white/60">
                  Natural Ingredients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
