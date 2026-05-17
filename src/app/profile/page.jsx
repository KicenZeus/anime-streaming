"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Calendar, Bookmark, Clock,
  Star, Settings, LogOut, Edit3, Film
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";


export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, isLoggedIn, logout } = useAuthStore();

  const [watchHistory, setWatchHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");

  // Ambil data dari localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("animex_watch_history") || "[]");
    const saved = JSON.parse(localStorage.getItem("animex_bookmarks") || "[]");
    setWatchHistory(history);
    setBookmarks(saved);
  }, []);

  // Gabungkan user dari Zustand atau NextAuth Google
  const currentUser = user || (session?.user ? {
    username: session.user.name,
    email: session.user.email,
    avatar: session.user.image,
  } : null);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/");
  };

  // Kalau tidak ada user sama sekali
  if (!currentUser && !session) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-32 flex flex-col items-center justify-center gap-6 px-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)" }}
        >
          <User size={36} style={{ color: "#e50914" }} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#ffdad5" }}>
            You are not logged in
          </h1>
          <p className="text-sm" style={{ color: "#af8782" }}>
            Sign in to view your profile and manage your anime list
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ background: "#e50914", color: "white" }}
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 rounded-xl font-semibold text-sm border"
            style={{ color: "#ffdad5", borderColor: "rgba(255,255,255,0.15)" }}
          >
            Sign Up
          </button>
        </div>
      </main>
    );
  }

  const displayName = currentUser?.username || currentUser?.name || "Anime Fan";
  const displayEmail = currentUser?.email || "";
  const avatarUrl = currentUser?.avatar || null;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const TABS = ["stats", "activity"];

  return (
    <main className="min-h-screen bg-black pt-20 pb-32">

      {/* Profile Header Banner */}
      <div
        className="relative h-48 w-full"
        style={{
          background: "linear-gradient(135deg, #1a0908 0%, #2e1a18 50%, #e50914 200%)",
        }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #e50914 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff6b6b 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="max-w-screen-lg mx-auto px-5 md:px-16">

        {/* Avatar + Name Row */}
        <div className="relative flex flex-col md:flex-row md:items-end gap-4 -mt-16 mb-8">

          {/* Avatar */}
          <div
            className="w-28 h-28 rounded-2xl overflow-hidden border-4 flex-shrink-0 flex items-center justify-center font-bold text-4xl"
            style={{
              borderColor: "#0a0a0b",
              background: avatarUrl ? "transparent" : "#e50914",
              color: "white",
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              avatarInitial
            )}
          </div>

          {/* Name + Email */}
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold" style={{ color: "#ffdad5" }}>
              {displayName}
            </h1>
            <p className="text-sm flex items-center gap-1.5 mt-1" style={{ color: "#af8782" }}>
              <Mail size={13} />
              {displayEmail}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pb-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#c7c6c6",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Edit3 size={15} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: "rgba(229,9,20,0.12)", color: "#e50914", border: "1px solid rgba(229,9,20,0.2)" }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Bookmark size={20} />} label="My List" value={bookmarks.length} color="#e50914" />
          <StatCard icon={<Clock size={20} />} label="Watch History" value={watchHistory.length} color="#3b82f6" />
          <StatCard icon={<Film size={20} />} label="Completed" value={watchHistory.filter(h => h.completed).length} color="#22c55e" />
          <StatCard icon={<Star size={20} />} label="Avg Score" value="8.4" color="#fbbf24" />
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit mb-6"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? "#e50914" : "transparent",
                color: activeTab === tab ? "white" : "#c7c6c6",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Account Info */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#af8782" }}>
                Account Info
              </h3>
              <div className="flex flex-col gap-4">
                <InfoRow icon={<User size={16} />} label="Username" value={displayName} />
                <InfoRow icon={<Mail size={16} />} label="Email" value={displayEmail} />
                <InfoRow icon={<Calendar size={16} />} label="Member since" value="2024" />
                <InfoRow
                  icon={<Settings size={16} />}
                  label="Account type"
                  value={session?.user ? "Google Account" : "Email Account"}
                />
              </div>
            </div>

            {/* Quick Links */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#af8782" }}>
                Quick Access
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "My Bookmark List", href: "/profile/bookmarks", icon: <Bookmark size={16} /> },
                  { label: "Browse Anime", href: "/anime", icon: <Film size={16} /> },
                  { label: "Search", href: "/search", icon: <Star size={16} /> },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(229,9,20,0.3)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                  >
                    <span style={{ color: "#e50914" }}>{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: "#ffdad5" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minHeight: "200px" }}
          >
            <Clock size={40} style={{ color: "#af8782", opacity: 0.4 }} />
            <p className="text-sm" style={{ color: "#af8782" }}>
              Activity tracking coming soon
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: color + "18", color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "#ffdad5" }}>{value}</p>
        <p className="text-xs" style={{ color: "#af8782" }}>{label}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ color: "#af8782" }}>{icon}</span>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm" style={{ color: "#af8782" }}>{label}</span>
        <span className="text-sm font-medium" style={{ color: "#ffdad5" }}>{value}</span>
      </div>
    </div>
  );
}