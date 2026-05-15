"use client";

import { useRouter } from "next/navigation";
import { POPULAR_GENRES } from "@/lib/constants";

// Warna berbeda untuk setiap genre card biar visual
const GENRE_COLORS = [
  { bg: "rgba(229,9,20,0.12)", border: "rgba(229,9,20,0.25)", color: "#e50914" },
  { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", color: "#3b82f6" },
  { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", color: "#a855f7" },
  { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.25)", color: "#22c55e" },
  { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" },
  { bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.25)", color: "#ec4899" },
  { bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)", color: "#14b8a6" },
  { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", color: "#f97316" },
  { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", color: "#6366f1" },
  { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", color: "#ef4444" },
  { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", color: "#10b981" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#f59e0b" },
];

// Emoji per genre biar lebih visual
const GENRE_EMOJI = {
  "Action": "⚡",
  "Adventure": "🗺️",
  "Comedy": "😂",
  "Drama": "🎭",
  "Fantasy": "🧙",
  "Horror": "👻",
  "Mystery": "🔍",
  "Romance": "💕",
  "Sci-Fi": "🚀",
  "Slice of Life": "🌸",
  "Shounen": "💪",
  "Seinen": "🎯",
};

export default function GenresPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#ffdad5" }}>
          Browse by Genre
        </h1>
        <p className="text-sm" style={{ color: "#af8782" }}>
          Find anime that matches your taste
        </p>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {POPULAR_GENRES.map((genre, i) => {
          const colorScheme = GENRE_COLORS[i % GENRE_COLORS.length];
          const emoji = GENRE_EMOJI[genre.name] || "🎬";

          return (
            <button
              key={genre.id}
              onClick={() => router.push("/genre/" + genre.id)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-105 group"
              style={{
                background: colorScheme.bg,
                border: "1px solid " + colorScheme.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colorScheme.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colorScheme.bg;
              }}
            >
              <span className="text-4xl">{emoji}</span>
              <span
                className="text-sm font-semibold text-center"
                style={{ color: colorScheme.color }}
              >
                {genre.name}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}