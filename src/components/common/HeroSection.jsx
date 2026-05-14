"use client";

import { Play, Plus, Info, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAnimeImage, formatScore, truncateText } from "@/lib/utils";

// Sekarang HeroSection terima prop "anime" dari parent
// Tidak fetch sendiri — lebih efisien
export default function HeroSection({ anime, loading }) {
  const router = useRouter();

  if (loading) return <HeroSkeleton />;
  if (!anime) return null;

  const imageUrl = getAnimeImage(anime.images, "large");
  const score = formatScore(anime.score);
  const synopsis = truncateText(anime.synopsis, 180);
  const genres = anime.genres?.slice(0, 3).map((g) => g.name).join(" • ");

  return (
    <section className="relative h-screen min-h-[600px] max-h-[950px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={anime.title}
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: "brightness(0.5)" }}
        />
        <div className="hero-scrim absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col gap-4 max-w-2xl">

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background: "rgba(229,9,20,0.2)",
                color: "#e50914",
                borderColor: "rgba(229,9,20,0.3)",
              }}
            >
              #{anime.rank || "Top"} Ranked
            </span>
            <div className="flex items-center gap-1">
              <Star size={14} fill="#fbbf24" color="#fbbf24" />
              <span className="text-sm font-semibold" style={{ color: "#ffdad5" }}>
                {score}
              </span>
            </div>
            <span className="text-sm" style={{ color: "#c7c6c6" }}>
              {anime.year || "N/A"} •{" "}
              {anime.episodes ? `${anime.episodes} eps` : "Ongoing"}
            </span>
          </div>

          <h1
            className="font-bold leading-none drop-shadow-2xl"
            style={{
              color: "#ffdad5",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {anime.title_english || anime.title}
          </h1>

          {genres && (
            <p className="text-sm font-medium" style={{ color: "#e50914" }}>
              {genres}
            </p>
          )}

          <p className="text-base leading-relaxed max-w-xl" style={{ color: "rgba(199,198,198,0.9)" }}>
            {synopsis || "No synopsis available."}
          </p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button
              onClick={() => router.push(`/anime/${anime.mal_id}`)}
              className="red-glow-hover flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: "#e50914", color: "#fff7f6" }}
            >
              <Play size={18} fill="#fff7f6" />
              WATCH NOW
            </button>

            <button
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 border"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                color: "#ffdad5",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Plus size={18} />
              MY LIST
            </button>

            <button
              onClick={() => router.push(`/anime/${anime.mal_id}`)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 border"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#c7c6c6",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Info size={18} />
              MORE INFO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[950px] w-full overflow-hidden">
      <div className="absolute inset-0 skeleton" />
      <div className="hero-scrim absolute inset-0" />
      <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 px-5 md:px-16">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="skeleton h-6 w-32 rounded-full" />
          <div className="skeleton h-14 w-96 rounded-xl" />
          <div className="skeleton h-14 w-64 rounded-xl" />
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-4/5 rounded-lg" />
          <div className="flex gap-3 mt-2">
            <div className="skeleton h-12 w-36 rounded-xl" />
            <div className="skeleton h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}