"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, X, LogOut, User, Bookmark } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/lib/constants";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoggedIn, user, logout, initAuth } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = user || session?.user;
  const loggedIn = isLoggedIn || !!session;

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    if (isProfileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileMenuOpen]);

  // Tutup mobile menu saat pindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push("/search?q=" + encodeURIComponent(searchQuery.trim()));
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    // Logout dari Zustand store (email login)
    logout();

    // Logout dari NextAuth (Google login)
    await signOut({ redirect: false });

    toast.success("Logged out successfully");
    router.push("/");
    setIsProfileMenuOpen(false);
  };

  const displayName = currentUser?.username || currentUser?.name || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUrl = currentUser?.image || currentUser?.avatar || null;

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-5 md:px-16 py-4"
        animate={{
          background: isScrolled ? "rgba(10,10,11,0.95)" : "rgba(0,0,0,0)",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        }}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: isScrolled ? "blur(30px)" : "none" }}
      >
        {/* Left */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <motion.span
              className="text-2xl font-extrabold tracking-tighter"
              style={{ color: "#e50914" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ANIMEX
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className="text-sm font-medium relative"
                    style={{ color: isActive ? "#ffdad5" : "#c7c6c6" }}
                    whileHover={{ color: "#ffdad5" }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: "#e50914" }}
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Search Desktop */}
          <motion.form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
            whileFocusWithin={{
              borderColor: "rgba(229,9,20,0.5)",
              background: "rgba(255,255,255,0.08)",
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
          </motion.form>

          {/* Search Mobile */}
          <motion.button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-full"
            style={{ color: "#c7c6c6" }}
            whileHover={{ background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <Search size={20} />
          </motion.button>

          {/* Bell */}
          <motion.button
            className="p-2 rounded-full hidden md:flex"
            style={{ color: "#c7c6c6" }}
            whileHover={{ background: "rgba(255,255,255,0.1)", color: "#ffdad5" }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} />
          </motion.button>

          {/* Auth */}
          {loggedIn && currentUser ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <motion.button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-full border-2 overflow-hidden flex items-center justify-center font-bold text-sm"
                style={{ borderColor: "#e50914", background: avatarUrl ? "transparent" : "#e50914", color: "white" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  : avatarInitial
                }
              </motion.button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-52 rounded-2xl py-2 shadow-2xl z-50"
                    style={{
                      background: "rgba(15,6,5,0.98)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(20px)",
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <p className="text-sm font-semibold truncate" style={{ color: "#ffdad5" }}>{displayName}</p>
                      <p className="text-xs truncate" style={{ color: "#af8782" }}>{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      {[
                        { label: "Profile", icon: <User size={15} />, href: "/profile" },
                        { label: "My List", icon: <Bookmark size={15} />, href: "/profile/bookmarks" },
                      ].map((item) => (
                        <motion.button
                          key={item.href}
                          onClick={() => { router.push(item.href); setIsProfileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                          style={{ color: "#c7c6c6" }}
                          whileHover={{ background: "rgba(255,255,255,0.05)", color: "#ffdad5" }}
                        >
                          {item.icon}
                          {item.label}
                        </motion.button>
                      ))}
                    </div>

                    <div className="border-t pt-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                        style={{ color: "#e50914" }}
                        whileHover={{ background: "rgba(229,9,20,0.08)" }}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <motion.span
                  className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ color: "#c7c6c6" }}
                  whileHover={{ background: "rgba(255,255,255,0.08)", color: "#ffdad5" }}
                >
                  Sign In
                </motion.span>
              </Link>
              <Link href="/register">
                <motion.span
                  className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{ background: "#e50914", color: "white" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(229,9,20,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                >
                  Sign Up
                </motion.span>
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full"
            style={{ color: "#c7c6c6" }}
            whileHover={{ background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen
                ? <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.15 }}><X size={22} /></motion.div>
                : <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.15 }}><Menu size={22} /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed top-16 left-0 w-full z-40 px-5 py-3 border-b"
            style={{ background: "rgba(10,10,11,0.98)", borderColor: "rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-16 left-0 w-full z-40 border-b md:hidden"
            style={{ background: "rgba(10,10,11,0.99)", borderColor: "rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col px-5 py-4 gap-1">
              {MAIN_NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 px-4 rounded-xl text-sm font-medium"
                      style={{
                        color: isActive ? "#ffdad5" : "#c7c6c6",
                        background: isActive ? "rgba(229,9,20,0.12)" : "transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="border-t mt-2 pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {loggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-xl text-sm font-medium text-left"
                    style={{ color: "#e50914" }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#c7c6c6" }}>
                      Sign In
                    </Link>
                    <Link href="/register" className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center"
                      style={{ background: "#e50914", color: "white" }}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}