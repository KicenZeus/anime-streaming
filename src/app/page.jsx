"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/common/HeroSection";
import SectionRow from "@/components/anime/SectionRow";
import AnimeCard from "@/components/anime/AnimeCard";
import AnimeCardRanked from "@/components/anime/AnimeCardRanked";
import { AnimeCardSkeleton, AnimeCardRankedSkeleton } from "@/components/anime/AnimeSkeleton";
import { getTopAnime, getCurrentSeasonAnime } from "@/services/animeService";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [topAnime, setTopAnime] = useState([]);
  const [seasonAnime, setSeasonAnime] = useState([]);
  const [topLoading, setTopLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const topResult = await getTopAnime(1, 10);
        setTopAnime(topResult.data || []);
        setTopLoading(false);

        await wait(800);

        const seasonResult = await getCurrentSeasonAnime(1, 12);
        setSeasonAnime(seasonResult.data || []);
        setSeasonLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setTopLoading(false);
        setSeasonLoading(false);
      }
    };

    fetchAll();
  }, []);

  const heroAnime = topAnime.length > 0 ? topAnime[0] : null;

  return (
    <motion.main
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <HeroSection anime={heroAnime} loading={topLoading} />

      {/* Sections */}
      <div className="relative z-10 -mt-16 flex flex-col gap-14 pb-32">

        {/* Trending Now */}
        <SectionRow title="🔥 Trending Now" seeAllHref="/anime?sort=trending">
          {topLoading
            ? Array(6).fill(0).map((_, i) => <AnimeCardRankedSkeleton key={i} />)
            : topAnime.slice(0, 8).map((anime, i) => (
                <AnimeCardRanked key={anime.mal_id} anime={anime} rank={i + 1} />
              ))
          }
        </SectionRow>

        {/* This Season */}
        <SectionRow title="📺 This Season" seeAllHref="/anime?sort=season">
          {seasonLoading
            ? Array(8).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)
            : seasonAnime.map((anime, i) => (
                <AnimeCard key={`season-${anime.mal_id}-${i}`} anime={anime} index={i} />
              ))
          }
        </SectionRow>

        {/* Top Rated */}
        <SectionRow title="⭐ Top Rated All Time" seeAllHref="/anime?sort=top">
          {topLoading
            ? Array(8).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)
            : topAnime.map((anime, i) => (
                <AnimeCard key={`top-${anime.mal_id}-${i}`} anime={anime} />
              ))
          }
        </SectionRow>

        {/* CTA Banner */}
        {!topLoading && (
          <motion.div
            className="mx-5 md:mx-16 rounded-3xl overflow-hidden relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, #1a0908 0%, #2e1a18 40%, rgba(229,9,20,0.15) 100%)",
                border: "1px solid rgba(229,9,20,0.2)",
              }}
            >
              {/* Glow decoration */}
              <div
                className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)",
                  transform: "translate(30%, -30%)",
                }}
              />

              <div>
                <h2
                  className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight"
                  style={{ color: "#ffdad5" }}
                >
                  Discover More Anime
                </h2>
                <p className="text-sm" style={{ color: "#af8782" }}>
                  Browse thousands of anime by genre, season, or rating
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <motion.a
                  href="/anime"
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ background: "#e50914", color: "white" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(229,9,20,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                >
                  Browse All
                </motion.a>
                <motion.a
                  href="/genre"
                  className="px-6 py-3 rounded-xl font-bold text-sm border"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#ffdad5",
                    borderColor: "rgba(255,255,255,0.12)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  By Genre
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}