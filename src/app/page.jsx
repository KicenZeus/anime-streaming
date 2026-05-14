"use client";

import { useEffect, useState } from "react";
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

  // Pilih hero: anime pertama dari top list
  const heroAnime = topAnime.length > 0 ? topAnime[0] : null;

  return (
    <main className="min-h-screen bg-black">

      {/* Hero pakai data yang sama — tidak fetch ulang */}
      <HeroSection anime={heroAnime} loading={topLoading} />

      <div className="relative z-10 -mt-16 flex flex-col gap-12 pb-32">

        <SectionRow title="🔥 Trending Now" seeAllHref="/anime?sort=trending">
          {topLoading
            ? Array(6).fill(0).map((_, i) => <AnimeCardRankedSkeleton key={i} />)
            : topAnime.slice(0, 8).map((anime, i) => (
                <AnimeCardRanked key={anime.mal_id} anime={anime} rank={i + 1} />
              ))
          }
        </SectionRow>

        <SectionRow title="📺 This Season" seeAllHref="/anime?sort=season">
          {seasonLoading
            ? Array(8).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)
            : seasonAnime.map((anime, i) => (
                <AnimeCard key={`season-${anime.mal_id}-${i}`} anime={anime} index={i} />
              ))
          }
        </SectionRow>

        <SectionRow title="⭐ Top Rated All Time" seeAllHref="/anime?sort=top">
          {topLoading
            ? Array(8).fill(0).map((_, i) => <AnimeCardSkeleton key={`rated-${i}`} />)
            : topAnime.map((anime) => (
                <AnimeCard key={`top-${anime.mal_id}`} anime={anime} />
              ))
          }
        </SectionRow>

      </div>
    </main>
  );
}