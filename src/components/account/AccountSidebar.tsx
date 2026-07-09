// src/components/account/AccountSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AccountUser } from "@/components/account/AccountLayout";

type AccountSidebarProps = {
  user: AccountUser;
};

function getInitials(name: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const NAV_ITEMS = [
  { label: "Profile Info", href: "/account/profile", icon: User },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
] as const;

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col">
      {/* User info */}
      <div className="border-b border-[#D8D6C0] px-6 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F3D2E] text-sm font-semibold text-white">
          {getInitials(user.full_name)}
        </div>
        <p className="mt-3 font-medium text-[#1B1B1B]">
          {user.full_name ?? "My Account"}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#5C5C4E]">{user.email}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1F3D2E] text-white"
                      : "text-[#1B1B1B] hover:bg-[#1F3D2E]/10"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout — pinned to bottom of sidebar */}
      <div className="border-t border-[#D8D6C0] px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#C0392B] transition-colors hover:bg-[#C0392B]/10"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
}
