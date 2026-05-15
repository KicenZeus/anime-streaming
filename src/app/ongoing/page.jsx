"use client";

import { useState, useEffect } from "react";
import { Tv } from "lucide-react";
import { getCurrentSeasonAnime } from "@/services/animeService";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/anime/AnimeSkeleton";
import { formatStatus } from "@/lib/utils";

export default function OngoingPage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchOngoing = async (pageNum, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const result = await getCurrentSeasonAnime(pageNum, 24);
      const newData = (result.data || []).filter(
        (a) => a.status === "Currently Airing"
      );
      setHasMore(result.pagination?.has_next_page || false);
      if (append) {
        setAnimeList((prev) => [...prev, ...newData]);
      } else {
        setAnimeList(newData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOngoing(1, false);
  }, []);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchOngoing(next, true);
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.15)" }}
        >
          <Tv size={20} style={{ color: "#22c55e" }} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#ffdad5" }}>
            Currently Airing
          </h1>
          <p className="text-sm" style={{ color: "#af8782" }}>
            Anime that are currently airing this season
          </p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-8 mt-4">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
        <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
          LIVE THIS SEASON
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(24).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          {animeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Tv size={48} style={{ color: "#af8782", opacity: 0.4 }} />
              <p style={{ color: "#af8782" }}>No ongoing anime found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeList.map((anime, i) => (
                <AnimeCard key={anime.mal_id + "-" + i} anime={anime} />
              ))}
            </div>
          )}

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