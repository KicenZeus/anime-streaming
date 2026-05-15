"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { searchAnime, getAnimeByGenre } from "@/services/animeService";
import { POPULAR_GENRES } from "@/lib/constants";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/anime/AnimeSkeleton";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setHasSearched(true);
        setSelectedGenre(null);
        const result = await searchAnime(query, 1, 20);
        setResults(result.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 600);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!selectedGenre) return;

    const fetchByGenre = async () => {
      try {
        setLoading(true);
        setHasSearched(true);
        setQuery("");
        setInputValue("");
        const result = await getAnimeByGenre(selectedGenre.id, 1, 20);
        setResults(result.data || []);
      } catch (err) {
        console.error("Genre fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByGenre();
  }, [selectedGenre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setQuery(inputValue.trim());
    router.push("/search?q=" + encodeURIComponent(inputValue.trim()));
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setSelectedGenre(null);
    router.push("/search");
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">

      <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "#ffdad5" }}>
        Search Anime
      </h1>

      <form onSubmit={handleSubmit} className="relative max-w-2xl mb-8">
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: query ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)",
          }}
        >
          <Search size={20} style={{ color: "#af8782", flexShrink: 0 }} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit(e);
            }}
            placeholder="Search anime title..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-base"
            style={{ color: "#ffdad5" }}
          />
          {inputValue && (
            <button type="button" onClick={handleClear}>
              <X size={18} style={{ color: "#af8782" }} />
            </button>
          )}
        </div>
      </form>

      {!query && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={16} style={{ color: "#af8782" }} />
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#af8782" }}>
              Browse by Genre
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_GENRES.map((genre) => {
              const isActive = selectedGenre?.id === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: isActive ? "#e50914" : "rgba(255,255,255,0.07)",
                    color: isActive ? "white" : "#c7c6c6",
                    border: isActive ? "1px solid #e50914" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasSearched && !loading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: "#af8782" }}>
            {results.length > 0
              ? results.length + " results" + (query ? ' for "' + query + '"' : " in " + selectedGenre?.name)
              : "No results found"}
          </p>
          {selectedGenre && (
            <button
              onClick={() => {
                setSelectedGenre(null);
                setResults([]);
                setHasSearched(false);
              }}
              className="text-sm flex items-center gap-1"
              style={{ color: "#e50914" }}
            >
              <X size={14} />
              Clear filter
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((anime, i) => (
            <AnimeCard key={anime.mal_id + "-" + i} anime={anime} />
          ))}
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(229,9,20,0.1)" }}
          >
            <Search size={36} style={{ color: "#e50914", opacity: 0.5 }} />
          </div>
          <p className="text-lg font-semibold" style={{ color: "#ffdad5" }}>
            No anime found
          </p>
          <p className="text-sm text-center max-w-xs" style={{ color: "#af8782" }}>
            Try a different keyword or browse by genre below
          </p>
          <button
            onClick={handleClear}
            className="mt-2 px-6 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)" }}
          >
            Browse Genres
          </button>
        </div>
      )}

      {!loading && !hasSearched && !selectedGenre && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-base" style={{ color: "#af8782" }}>
            Type to search or pick a genre above
          </p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}