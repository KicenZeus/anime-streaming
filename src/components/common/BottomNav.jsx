"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User } from "lucide-react";

// Definisi item bottom nav
const BOTTOM_NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "My List", href: "/profile/bookmarks", icon: Bookmark },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // fixed bottom — nempel di bawah layar
    // md:hidden — hanya muncul di mobile, hilang di desktop
    <nav
      className="fixed bottom-0 left-0 w-full md:hidden z-50 border-t"
      style={{
        background: "rgba(46, 26, 24, 0.9)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Tambah padding bottom untuk safe area iPhone */}
      <div className="flex justify-around items-center px-2 pt-2 pb-6">
        {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200"
              style={{
                color: isActive ? "#e50914" : "#c7c6c6",
                background: isActive
                  ? "rgba(229,9,20,0.1)"
                  : "transparent",
              }}
            >
              <Icon
                size={22}
                fill={isActive ? "#e50914" : "none"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}