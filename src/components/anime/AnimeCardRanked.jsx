"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAnimeImage } from "@/lib/utils";

// ================================
// ANIME CARD RANKED
// Card dengan nomor besar di sebelah kiri
// Persis kayak di design "Trending Now"
// ================================
export default function AnimeCardRanked({ anime, rank }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!anime) return null;

  const imageUrl = imgError
    ? "/images/placeholder.jpg"
    : getAnimeImage(anime.images, "large");

  return (
    <div
      className="flex-none flex items-end cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/anime/${anime.mal_id}`)}
    >
      {/* Angka Ranking Besar */}
      <span
        className="text-[120px] md:text-[160px] font-extrabold leading-none select-none transition-all duration-500 -mr-6 md:-mr-8 z-10"
        style={{
          color: "transparent",
          WebkitTextStroke: isHovered
            ? "3px rgba(229,9,20,0.5)"
            : "3px rgba(255,255,255,0.1)",
          fontFamily: "Inter",
          lineHeight: 0.85,
        }}
      >
        {rank}
      </span>

      {/* Poster Card */}
      <div
        className="relative rounded-xl overflow-hidden border transition-all duration-300 shadow-2xl"
        style={{
          width: "140px",
          aspectRatio: "2/3",
          borderColor: isHovered
            ? "rgba(229,9,20,0.5)"
            : "rgba(255,255,255,0.1)",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        <img
          src={imageUrl}
          alt={anime.title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Title saat hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-2 transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <p className="text-xs font-semibold text-center line-clamp-2"
            style={{ color: "#ffdad5" }}>
            {anime.title_english || anime.title}
          </p>
        </div>
      </div>
    </div>
  );
}