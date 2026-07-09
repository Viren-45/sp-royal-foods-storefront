// components/layout/AccountMenu.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingBag, Heart, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AccountMenu() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const initials = getInitials(fullName);

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center justify-center text-[#1B1B1B] transition-colors hover:text-[#1F3D2E]"
      >
        {!isLoading && user ? (
          <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1F3D2E] text-xs font-semibold text-white">
            {initials}
          </span>
        ) : (
          <User size={20} />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-[#D8D6C0] bg-white shadow-lg">
          {user ? (
            <>
              {/* Logged in header */}
              <div className="border-b border-[#D8D6C0] px-4 py-3">
                <p className="text-sm font-medium text-[#1B1B1B]">
                  {fullName ?? "My Account"}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#5C5C4E]">
                  {user.email}
                </p>
              </div>

              {/* Logged in links */}
              <div className="py-1">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[#1B1B1B] transition-colors hover:bg-[#EDEFDD]"
                >
                  <Settings size={15} className="text-[#5C5C4E]" />
                  Account Settings
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[#1B1B1B] transition-colors hover:bg-[#EDEFDD]"
                >
                  <ShoppingBag size={15} className="text-[#5C5C4E]" />
                  My Orders
                </Link>
                <Link
                  href="/account/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[#1B1B1B] transition-colors hover:bg-[#EDEFDD]"
                >
                  <Heart size={15} className="text-[#5C5C4E]" />
                  Wishlist
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-[#D8D6C0] py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[#C0392B] transition-colors hover:bg-[#C0392B]/5"
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[#1B1B1B] transition-colors hover:bg-[#EDEFDD]"
              >
                <User size={15} className="text-[#5C5C4E]" />
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F3D2E] transition-colors hover:bg-[#EDEFDD]"
              >
                <Settings size={15} className="text-[#5C5C4E]" />
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
