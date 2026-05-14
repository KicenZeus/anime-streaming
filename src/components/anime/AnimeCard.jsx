"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Plus, Star } from "lucide-react";
import { getAnimeImage, formatScore, truncateText } from "@/lib/utils";

// ================================
// ANIME CARD — Portrait (2:3 ratio)
// Dipakai untuk: Recommended, Genre, Search results
// ================================
export default function AnimeCard({ anime, index }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!anime) return null;

  const imageUrl = imgError
    ? "/images/placeholder.jpg"
    : getAnimeImage(anime.images, "large");

  const title = anime.title_english || anime.title;
  const score = formatScore(anime.score);
  const year = anime.year || anime.aired?.prop?.from?.year || "N/A";
  const genres = anime.genres?.slice(0, 2).map((g) => g.name).join(", ");

  return (
    <div
      className="flex-none w-[160px] sm:w-[180px] md:w-[200px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/anime/${anime.mal_id}`)}
    >
      {/* Image Container */}
      <div
        className="relative rounded-xl overflow-hidden mb-3 border transition-all duration-300"
        style={{
          aspectRatio: "2/3",
          borderColor: isHovered
            ? "rgba(229,9,20,0.4)"
            : "rgba(255,255,255,0.05)",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        {/* Poster Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          {/* Play Button */}
          <button
            className="self-center mb-2 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "#e50914" }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/anime/${anime.mal_id}`);
            }}
          >
            <Play size={18} fill="white" color="white" />
          </button>

          {/* Quick info saat hover */}
          {score !== "N/A" && (
            <div className="flex items-center gap-1 justify-center">
              <Star size={11} fill="#fbbf24" color="#fbbf24" />
              <span className="text-xs font-semibold" style={{ color: "#ffdad5" }}>
                {score}
              </span>
            </div>
          )}
        </div>

        {/* Index badge (kalau ada) */}
        {index !== undefined && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#e50914", color: "white" }}
          >
            {index + 1}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div>
        <h3
          className="text-sm font-semibold leading-tight mb-1 transition-colors duration-200 line-clamp-2"
          style={{ color: isHovered ? "#e50914" : "#ffdad5" }}
        >
          {title}
        </h3>
        <p className="text-xs" style={{ color: "#c7c6c6" }}>
          {score !== "N/A" && `⭐ ${score} • `}{year}
        </p>
        {genres && (
          <p className="text-xs mt-0.5 truncate" style={{ color: "#af8782" }}>
            {genres}
          </p>
        )}
      </div>
    </div>
  );
}