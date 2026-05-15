"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAnimeByGenre } from "@/services/animeService";
import { POPULAR_GENRES } from "@/lib/constants";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/anime/AnimeSkeleton";

export default function GenreDetailPage() {
  const { genre: genreId } = useParams();
  const router = useRouter();

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Cari nama genre dari constants
  const genreInfo = POPULAR_GENRES.find((g) => String(g.id) === String(genreId));
  const genreName = genreInfo?.name || "Genre";

  const fetchByGenre = async (pageNum, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const result = await getAnimeByGenre(genreId, pageNum, 20);
      const newData = result.data || [];
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
    if (!genreId) return;
    setPage(1);
    setAnimeList([]);
    fetchByGenre(1, false);
  }, [genreId]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchByGenre(next, true);
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      {/* Back + Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/genre")}
          className="p-2 rounded-xl transition-all hover:scale-105"
          style={{ background: "rgba(255,255,255,0.06)", color: "#c7c6c6" }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#af8782" }}>
            Genre
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#ffdad5" }}>
            {genreName}
          </h1>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(20).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          {animeList.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-3">
              <p style={{ color: "#af8782" }}>No anime found for this genre</p>
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