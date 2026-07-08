import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
] as const;

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

// TODO: replace "#" with real profile/contact links once available
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Email", href: "#", icon: Mail },
  { label: "WhatsApp", href: "#", icon: Phone },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#1F3D2E] text-[#EDEFDD]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="S.P Royal Foods"
                width={48}
                height={48}
              />
              <span className="font-heading text-xl font-medium tracking-wide text-white">
                S.P. Royal Foods
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#EDEFDD]/60">
              Premium quality makhana, seeds and natural honey — carefully
              sourced for a healthier, better tomorrow.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#EDEFDD]/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EDEFDD]/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
              Legal
            </h3>
            <ul className="mt-5 space-y-3.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EDEFDD]/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
              Get in Touch
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-[#EDEFDD]/60">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0" />
                <span>sproyalfood@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0" />
                <span>+91 9274717472</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>Himatnagar, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-16 border-t border-white/10 pt-6 text-center">
          <p className="text-xs tracking-wide text-[#EDEFDD]/50">
            © {new Date().getFullYear()} S.P Royal Foods. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
