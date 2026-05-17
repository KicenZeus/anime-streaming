"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Trash2, Play, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function BookmarksPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, isLoggedIn } = useAuthStore();

  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const currentUser = user || session?.user;

  // Load bookmarks dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("animex_bookmarks") || "[]");
    setBookmarks(saved);
  }, []);

  // Hapus satu bookmark
  const handleRemove = (malId) => {
    const updated = bookmarks.filter((b) => b.mal_id !== malId);
    setBookmarks(updated);
    localStorage.setItem("animex_bookmarks", JSON.stringify(updated));
    toast.success("Removed from My List");
  };

  // Hapus semua
  const handleClearAll = () => {
    if (!confirm("Remove all anime from your list?")) return;
    setBookmarks([]);
    localStorage.setItem("animex_bookmarks", JSON.stringify([]));
    toast.success("List cleared");
  };

  // Filter + sort
  const filteredBookmarks = bookmarks
    .filter((b) =>
      b.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return (b.addedAt || 0) - (a.addedAt || 0);
      if (sortBy === "oldest") return (a.addedAt || 0) - (b.addedAt || 0);
      if (sortBy === "title") return a.title?.localeCompare(b.title);
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      return 0;
    });

  // Belum login
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-32 flex flex-col items-center justify-center gap-6 px-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)" }}
        >
          <Bookmark size={36} style={{ color: "#e50914" }} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#ffdad5" }}>
            Sign in to see your list
          </h1>
          <p className="text-sm" style={{ color: "#af8782" }}>
            Save anime to your personal list and access them anytime
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: "#e50914", color: "white" }}
        >
          Sign In
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#ffdad5" }}>
            My List
          </h1>
          <p className="text-sm mt-1" style={{ color: "#af8782" }}>
            {bookmarks.length} anime saved
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.2)" }}
          >
            <Trash2 size={15} />
            Clear All
          </button>
        )}
      </div>

      {/* Search + Sort */}
      {bookmarks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-1"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <Search size={16} style={{ color: "#af8782" }} />
            <input
              type="text"
              placeholder="Search your list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "#ffdad5" }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border text-sm outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#ffdad5",
            }}
          >
            <option value="newest" style={{ background: "#1a0908" }}>Newest First</option>
            <option value="oldest" style={{ background: "#1a0908" }}>Oldest First</option>
            <option value="title" style={{ background: "#1a0908" }}>A - Z</option>
            <option value="score" style={{ background: "#1a0908" }}>Highest Score</option>
          </select>
        </div>
      )}

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.15)" }}
          >
            <Bookmark size={40} style={{ color: "#e50914", opacity: 0.5 }} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#ffdad5" }}>
              Your list is empty
            </h2>
            <p className="text-sm max-w-xs" style={{ color: "#af8782" }}>
              Browse anime and click the bookmark button to save them here
            </p>
          </div>
          <button
            onClick={() => router.push("/anime")}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: "#e50914", color: "white" }}
          >
            Browse Anime
          </button>
        </div>
      )}

      {/* No search results */}
      {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
        <div className="text-center py-16">
          <p style={{ color: "#af8782" }}>No anime found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Bookmarks Grid */}
      {filteredBookmarks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBookmarks.map((anime) => (
            <BookmarkCard
              key={anime.mal_id}
              anime={anime}
              onRemove={handleRemove}
              onPlay={() => router.push("/anime/" + anime.mal_id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function BookmarkCard({ anime, onRemove, onPlay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <div
        className="relative rounded-xl overflow-hidden mb-3 border transition-all duration-300"
        style={{
          aspectRatio: "2/3",
          borderColor: isHovered ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.06)",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <img
          src={anime.image || "/images/placeholder.jpg"}
          alt={anime.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300"
          style={{
            background: "rgba(0,0,0,0.75)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <button
            onClick={onPlay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: "#e50914", color: "white" }}
          >
            <Play size={14} fill="white" />
            View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(anime.mal_id); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.1)", color: "#ffdad5", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>

        {/* Score badge */}
        {anime.score && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.8)", color: "#fbbf24" }}
          >
            ⭐ {anime.score}
          </div>
        )}
      </div>

      {/* Info */}
      <h3
        className="text-sm font-medium leading-tight line-clamp-2 transition-colors"
        style={{ color: isHovered ? "#e50914" : "#ffdad5" }}
      >
        {anime.title}
      </h3>
      {anime.year && (
        <p className="text-xs mt-0.5" style={{ color: "#af8782" }}>{anime.year}</p>
      )}
    </div>
  );
}