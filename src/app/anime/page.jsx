"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getTopAnime, getCurrentSeasonAnime, getUpcomingAnime } from "@/services/animeService";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/anime/AnimeSkeleton";

const SORT_OPTIONS = [
  { label: "Top Rated", value: "top" },
  { label: "This Season", value: "season" },
  { label: "Trending", value: "trending" },
  { label: "Upcoming", value: "upcoming" },
];

export default function AnimePage() {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "top";

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState(sortParam);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchAnime = async (sortType, pageNum, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      let result;
      if (sortType === "season" || sortType === "trending") {
        result = await getCurrentSeasonAnime(pageNum, 20);
      } else if (sortType === "upcoming") {
        result = await getUpcomingAnime(pageNum, 20);
      } else {
        result = await getTopAnime(pageNum, 20);
      }

      const newData = result.data || [];
      setHasMore(result.pagination?.has_next_page || false);

      if (append) {
        setAnimeList((prev) => [...prev, ...newData]);
      } else {
        setAnimeList(newData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setAnimeList([]);
    fetchAnime(activeSort, 1, false);
  }, [activeSort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnime(activeSort, nextPage, true);
  };

  const handleSortChange = (sortValue) => {
    setActiveSort(sortValue);
    window.history.pushState({}, "", "/anime?sort=" + sortValue);
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#ffdad5" }}>
            Anime Collection
          </h1>
          <p className="text-sm mt-1" style={{ color: "#af8782" }}>
            Discover the best anime series
          </p>
        </div>

        {/* Sort Filter */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeSort === opt.value ? "#e50914" : "transparent",
                color: activeSort === opt.value ? "white" : "#c7c6c6",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(20).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime, i) => (
              <AnimeCard key={anime.mal_id + "-" + i} anime={anime} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: loadingMore ? "rgba(229,9,20,0.4)" : "#e50914",
                  color: "white",
                  cursor: loadingMore ? "not-allowed" : "pointer",
                }}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}