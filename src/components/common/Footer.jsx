"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const FOOTER_LINKS = {
  Explore: [
    { label: "Home", href: "/" },
    { label: "Anime", href: "/anime" },
    { label: "Ongoing", href: "/ongoing" },
    { label: "Genres", href: "/genre" },
    { label: "Trending", href: "/anime?sort=trending" },
  ],
  Account: [
    { label: "My List", href: "/profile/bookmarks" },
    { label: "Profile", href: "/profile" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ],
  Info: [
    { label: "About", href: "/about" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full pt-16 pb-24 md:pb-10 border-t"
      style={{
        background: "#0a0a0b",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-5 md:px-16">

        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tighter block mb-3"
              style={{ color: "#e50914" }}>
              {APP_NAME}
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "#af8782" }}>
              Stream anime in cinematic quality. Watch the latest episodes, trending series, and all-time classics.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {["X", "IG", "YT"].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#c7c6c6",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(229,9,20,0.15)";
                    e.currentTarget.style.color = "#e50914";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#c7c6c6";
                  }}
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h5
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#ffdad5" }}
              >
                {category}
              </h5>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#af8782" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ffdad5"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#af8782"}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t mb-6" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#5e3f3b" }}>
            {currentYear} {APP_NAME}. All rights reserved. Fan project — not affiliated with any studio.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <span
                key={item}
                className="text-xs cursor-pointer transition-colors"
                style={{ color: "#5e3f3b" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#af8782"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#5e3f3b"}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}