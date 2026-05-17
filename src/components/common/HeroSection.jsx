"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTopAnime } from "@/services/animeService";
import { getAnimeImage, formatScore, truncateText } from "@/lib/utils";
import useBookmarkStore from "@/store/bookmarkStore";

export default function HeroSection({ anime, loading }) {
  const router = useRouter();
  const { toggleBookmark, isBookmarked, initBookmarks } = useBookmarkStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    initBookmarks();
    if (anime) setBookmarked(isBookmarked(anime.mal_id));
  }, [anime]);

  const handleBookmark = () => {
    if (!anime) return;
    toggleBookmark(anime);
    setBookmarked(!bookmarked);
  };

  if (loading) return <HeroSkeleton />;
  if (!anime) return null;

  const imageUrl = getAnimeImage(anime.images, "large");
  const score = formatScore(anime.score);
  const synopsis = truncateText(anime.synopsis, 160);
  const genres = anime.genres?.slice(0, 3).map((g) => g.name).join(" • ");

  return (
    <section className="relative h-screen min-h-[600px] max-h-[950px] w-full overflow-hidden">

      {/* Background Image dengan fade in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src={imageUrl}
          alt={anime.title}
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.45)" }}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="hero-scrim absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-24 md:pb-36 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={anime.mal_id}
            className="flex flex-col gap-4 max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badges */}
            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
                style={{
                  background: "rgba(229,9,20,0.2)",
                  color: "#e50914",
                  borderColor: "rgba(229,9,20,0.35)",
                }}
              >
                #{anime.rank || "Top"} Ranked
              </span>

              {score !== "N/A" && (
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <span className="text-sm font-bold" style={{ color: "#ffdad5" }}>{score}</span>
                </div>
              )}

              <span className="text-sm" style={{ color: "#c7c6c6" }}>
                {anime.year || "N/A"} •{" "}
                {anime.episodes ? anime.episodes + " eps" : "Ongoing"}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-extrabold leading-none drop-shadow-2xl"
              style={{
                color: "#ffdad5",
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {anime.title_english || anime.title}
            </motion.h1>

            {/* Genre */}
            {genres && (
              <motion.p
                className="text-sm font-semibold"
                style={{ color: "#e50914" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {genres}
              </motion.p>
            )}

            {/* Synopsis */}
            <motion.p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(199,198,198,0.85)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              {synopsis || "No synopsis available."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex items-center gap-3 mt-2 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <motion.button
                onClick={() => router.push("/anime/watch/" + anime.mal_id)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
                style={{ background: "#e50914", color: "#fff7f6" }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(229,9,20,0.5)" }}
                whileTap={{ scale: 0.96 }}
              >
                <Play size={18} fill="white" />
                WATCH NOW
              </motion.button>

              <motion.button
                onClick={handleBookmark}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border"
                style={{
                  background: bookmarked ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: bookmarked ? "#e50914" : "#ffdad5",
                  borderColor: bookmarked ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.2)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Plus size={18} />
                {bookmarked ? "IN MY LIST" : "MY LIST"}
              </motion.button>

              <motion.button
                onClick={() => router.push("/anime/" + anime.mal_id)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#c7c6c6",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.96 }}
              >
                <Info size={18} />
                MORE INFO
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[950px] w-full overflow-hidden">
      <div className="absolute inset-0 skeleton" />
      <div className="hero-scrim absolute inset-0" />
      <div className="relative h-full flex flex-col justify-end pb-24 md:pb-36 px-5 md:px-16">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="skeleton h-6 w-40 rounded-full" />
          <div className="skeleton h-16 w-[500px] max-w-full rounded-xl" />
          <div className="skeleton h-16 w-80 max-w-full rounded-xl" />
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