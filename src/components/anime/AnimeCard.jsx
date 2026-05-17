"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star } from "lucide-react";
import { getAnimeImage, formatScore } from "@/lib/utils";
import useBookmarkStore from "@/store/bookmarkStore";

export default function AnimeCard({ anime, index }) {
  const router = useRouter();
  const { isBookmarked, toggleBookmark, initBookmarks } = useBookmarkStore();
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
  const bookmarked = isBookmarked(anime.mal_id);

  const handleBookmark = (e) => {
    e.stopPropagation();
    initBookmarks();
    toggleBookmark(anime);
  };

  return (
    <motion.div
      className="flex-none w-[160px] sm:w-[180px] md:w-[200px] cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index ? index * 0.05 : 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push("/anime/" + anime.mal_id)}
    >
      {/* Image Container */}
      <motion.div
        className="relative rounded-xl overflow-hidden mb-3 border"
        animate={{
          scale: isHovered ? 1.03 : 1,
          borderColor: isHovered ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.2 }}
        style={{ aspectRatio: "2/3" }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-3"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        >
          {/* Play Button */}
          <motion.button
            className="self-center mb-2 w-10 h-10 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            style={{ background: "#e50914" }}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/anime/" + anime.mal_id);
            }}
          >
            <Play size={16} fill="white" color="white" />
          </motion.button>

          {score !== "N/A" && (
            <div className="flex items-center gap-1 justify-center">
              <Star size={11} fill="#fbbf24" color="#fbbf24" />
              <span className="text-xs font-semibold" style={{ color: "#ffdad5" }}>
                {score}
              </span>
            </div>
          )}
        </motion.div>

        {/* Bookmark Button */}
        <motion.button
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          animate={{ opacity: isHovered ? 1 : 0 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleBookmark}
          style={{
            background: bookmarked ? "#e50914" : "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {bookmarked
            ? <Check size={12} color="white" />
            : <Plus size={12} color="white" />
          }
        </motion.button>

        {/* Rank badge */}
        {index !== undefined && index < 10 && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#e50914", color: "white" }}
          >
            {index + 1}
          </div>
        )}
      </motion.div>

      {/* Card Info */}
      <motion.h3
        className="text-sm font-semibold leading-tight mb-1 line-clamp-2"
        animate={{ color: isHovered ? "#e50914" : "#ffdad5" }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>
      <p className="text-xs" style={{ color: "#c7c6c6" }}>
        {score !== "N/A" && `⭐ ${score} • `}{year}
      </p>
      {genres && (
        <p className="text-xs mt-0.5 truncate" style={{ color: "#af8782" }}>
          {genres}
        </p>
      )}
    </motion.div>
  );
}