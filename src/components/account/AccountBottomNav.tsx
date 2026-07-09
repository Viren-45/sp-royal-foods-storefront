// src/components/account/AccountBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
] as const;

export default function AccountBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="fixed bottom-4 left-5 right-5 z-50 lg:hidden">
      <nav className="flex items-center rounded-2xl border border-white/40 bg-[#EDEFDD]/70 px-2 shadow-xl backdrop-blur-xl">
        {/* 4 nav tabs */}
        <div className="flex flex-1 items-center justify-around">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center gap-1.5 py-1 transition-all"
              >
                <div
                  className={`flex flex-col items-center gap-1.5 rounded-full px-5 py-2 transition-all ${
                    isActive
                      ? "bg-[#1F3D2E] text-white shadow-md"
                      : "text-[#5C5C4E] hover:text-[#1F3D2E]"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[10px] font-medium tracking-wide">
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Divider + logout */}
        <div className="flex items-center">
          <div className="mx-1 h-8 w-px bg-[#D8D6C0]" />
          <button
            onClick={handleLogout}
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-full px-4 py-2 text-[#C0392B] transition-colors hover:bg-[#C0392B]/10"
            aria-label="Log out"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-medium tracking-wide">
              Log Out
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
