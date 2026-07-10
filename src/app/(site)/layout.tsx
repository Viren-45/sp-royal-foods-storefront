// src/app/(site)/layout.tsx

import { CartProvider } from "@/context/CartContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
