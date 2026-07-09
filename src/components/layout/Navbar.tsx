// src/compoents/layout/Navbar.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import AccountMenu from "@/components/layout/AccountMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/10 shadow-sm backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="S.P Royal Foods"
            width={56}
            height={56}
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-[#1B1B1B] md:text-lg">
            S.P. ROYAL FOODS
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`pb-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "border-b-2 border-[#1F3D2E] text-[#1F3D2E]"
                      : "text-[#1B1B1B] hover:text-[#1F3D2E]"
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              </li>
            );
          })}
          <li>
            <span
              className="cursor-not-allowed text-sm font-medium tracking-wide text-[#5C5C4E] opacity-50"
              title="Coming soon"
            >
              INSPIRATION
            </span>
          </li>
        </ul>

        {/* Desktop right icons */}
        <div className="hidden items-center gap-5 md:flex">
          <button
            aria-label="Search"
            className="text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
          >
            <Search size={20} />
          </button>
          <AccountMenu />
          <button
            aria-label="Cart"
            className="relative text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
          >
            <ShoppingCart size={20} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F3D2E] text-[10px] font-medium text-white">
              0
            </span>
          </button>
        </div>

        {/* Mobile: icons + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            aria-label="Search"
            className="text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
          >
            <Search size={20} />
          </button>
          <AccountMenu />
          <button
            aria-label="Cart"
            className="relative text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
          >
            <ShoppingCart size={20} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F3D2E] text-[10px] font-medium text-white">
              0
            </span>
          </button>
          <button
            aria-label="Toggle menu"
            className="text-[#1B1B1B]"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel — links only, centered */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/40 bg-white/10 px-6 py-6 shadow-sm backdrop-blur-lg md:hidden">
          <ul className="flex flex-col items-center gap-5 text-center">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium tracking-wide ${
                    pathname === link.href ? "text-[#1F3D2E]" : "text-[#1B1B1B]"
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              </li>
            ))}
            <li>
              <span className="text-sm font-medium tracking-wide text-[#5C5C4E] opacity-50">
                INSPIRATION
              </span>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
