import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S.P Royal Foods",
  description:
    "Premium Makhana, seeds, and honey — natural, traditional, trustworthy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased flex min-h-screen flex-col`}
      >
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
