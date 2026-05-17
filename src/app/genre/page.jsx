"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap, Compass, Smile, Drama, Sparkles,
  EyeOff, SearchCode, Heart, Rocket, Coffee,
  Flame, BookOpen
} from "lucide-react";
import { POPULAR_GENRES } from "@/lib/constants";

const GENRE_CONFIG = [
  {
    name: "Action",
    icon: Zap,
    accent: "#e50914",
    bg: "rgba(229,9,20,0.07)",
    border: "rgba(229,9,20,0.15)",
    desc: "High-octane battles",
  },
  {
    name: "Adventure",
    icon: Compass,
    accent: "#f97316",
    bg: "rgba(249,115,22,0.07)",
    border: "rgba(249,115,22,0.15)",
    desc: "Epic journeys",
  },
  {
    name: "Comedy",
    icon: Smile,
    accent: "#fbbf24",
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.15)",
    desc: "Laugh out loud",
  },
  {
    name: "Drama",
    icon: Drama,
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.15)",
    desc: "Deep emotions",
  },
  {
    name: "Fantasy",
    icon: Sparkles,
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.15)",
    desc: "Magic & wonder",
  },
  {
    name: "Horror",
    icon: EyeOff,
    accent: "#64748b",
    bg: "rgba(100,116,139,0.07)",
    border: "rgba(100,116,139,0.15)",
    desc: "Dark & terrifying",
  },
  {
    name: "Mystery",
    icon: SearchCode,
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.07)",
    border: "rgba(6,182,212,0.15)",
    desc: "Suspense & secrets",
  },
  {
    name: "Romance",
    icon: Heart,
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.07)",
    border: "rgba(236,72,153,0.15)",
    desc: "Love stories",
  },
  {
    name: "Sci-Fi",
    icon: Rocket,
    accent: "#22d3ee",
    bg: "rgba(34,211,238,0.07)",
    border: "rgba(34,211,238,0.15)",
    desc: "Future & tech",
  },
  {
    name: "Slice of Life",
    icon: Coffee,
    accent: "#f472b6",
    bg: "rgba(244,114,182,0.07)",
    border: "rgba(244,114,182,0.15)",
    desc: "Everyday moments",
  },
  {
    name: "Shounen",
    icon: Flame,
    accent: "#ef4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.15)",
    desc: "Young heroes",
  },
  {
    name: "Seinen",
    icon: BookOpen,
    accent: "#94a3b8",
    bg: "rgba(148,163,184,0.07)",
    border: "rgba(148,163,184,0.15)",
    desc: "Mature themes",
  },
];

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function GenresPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#e50914" }}
        >
          Browse
        </p>
        <h1
          className="font-extrabold tracking-tighter mb-3"
          style={{ color: "#ffdad5", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Genres
        </h1>
        <p className="text-sm" style={{ color: "#af8782" }}>
          Find anime that matches your mood
        </p>
      </motion.div>

      {/* Genre Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {POPULAR_GENRES.map((genre) => {
          const config = GENRE_CONFIG.find((g) => g.name === genre.name) || GENRE_CONFIG[0];
          const Icon = config.icon;

          return (
            <motion.button
              key={genre.id}
              variants={item}
              onClick={() => router.push("/genre/" + genre.id)}
              className="relative group flex flex-col items-start p-5 rounded-2xl text-left overflow-hidden"
              style={{
                background: config.bg,
                border: "1px solid " + config.border,
              }}
              whileHover={{
                scale: 1.03,
                borderColor: config.accent + "55",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{
                  background: config.accent + "18",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{ color: config.accent }}
                />
              </div>

              {/* Name */}
              <p
                className="text-sm font-bold leading-tight mb-1"
                style={{ color: "#ffdad5" }}
              >
                {genre.name}
              </p>

              {/* Desc */}
              <p
                className="text-xs leading-snug"
                style={{ color: "#af8782" }}
              >
                {config.desc}
              </p>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: config.accent }}
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </main>
  );
}