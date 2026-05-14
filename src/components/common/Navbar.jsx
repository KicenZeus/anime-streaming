"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Menu, X, LogOut, User, Bookmark } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/lib/constants";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout, initAuth } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Init auth dari localStorage saat komponen mount
  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup profile menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    if (isProfileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push("/search?q=" + encodeURIComponent(searchQuery));
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-5 md:px-16 py-4 transition-all duration-500"
        style={{
          background: isScrolled ? "rgba(10,10,11,0.92)" : "transparent",
          backdropFilter: isScrolled ? "blur(30px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex-shrink-0"
            style={{ color: "#e50914" }}>
            ANIMEX
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? "#ffdad5" : "#c7c6c6",
                    borderBottom: isActive ? "2px solid #e50914" : "2px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Search Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Search size={15} style={{ color: "#c7c6c6" }} />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-40"
              style={{ color: "#ffdad5" }}
            />
          </form>

          {/* Search Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-full transition-all hover:bg-white/10"
            style={{ color: "#c7c6c6" }}
          >
            <Search size={20} />
          </button>

          {/* Bell */}
          <button className="p-2 rounded-full transition-all hover:bg-white/10 hidden md:flex"
            style={{ color: "#c7c6c6" }}>
            <Bell size={20} />
          </button>

          {/* Auth Section */}
          {isLoggedIn && user ? (
            // User sudah login — tampilkan avatar + dropdown
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-full border-2 overflow-hidden flex items-center justify-center font-bold text-sm transition-transform hover:scale-105"
                style={{ borderColor: "#e50914", background: "#e50914", color: "white" }}
              >
                {user.username?.charAt(0).toUpperCase() || "U"}
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-12 w-52 rounded-2xl py-2 shadow-2xl z-50"
                  style={{
                    background: "rgba(26,9,8,0.98)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <p className="text-sm font-semibold" style={{ color: "#ffdad5" }}>{user.username}</p>
                    <p className="text-xs truncate" style={{ color: "#af8782" }}>{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { router.push("/profile"); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "#c7c6c6" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => { router.push("/profile/bookmarks"); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "#c7c6c6" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Bookmark size={16} />
                      My List
                    </button>
                  </div>

                  <div className="border-t pt-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "#e50914" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(229,9,20,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // User belum login — tampilkan tombol Login
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: "#c7c6c6" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: "#e50914", color: "white" }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full transition-all hover:bg-white/10"
            style={{ color: "#c7c6c6" }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div
          className="fixed top-16 left-0 w-full z-40 px-5 py-3 border-b"
          style={{ background: "rgba(10,10,11,0.97)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <Search size={18} style={{ color: "#c7c6c6" }} />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "#ffdad5" }}
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} style={{ color: "#c7c6c6" }}>
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-16 left-0 w-full z-40 border-b md:hidden"
          style={{ background: "rgba(10,10,11,0.98)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col px-5 py-4 gap-1">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: isActive ? "#ffdad5" : "#c7c6c6",
                    background: isActive ? "rgba(229,9,20,0.12)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t mt-2 pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-xl text-sm font-medium text-left"
                  style={{ color: "#e50914" }}
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#c7c6c6" }}>
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center"
                    style={{ background: "#e50914", color: "white" }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}