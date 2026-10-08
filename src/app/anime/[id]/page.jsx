"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, Plus, Check, Star, Clock, Tv, ChevronLeft, ExternalLink } from "lucide-react";
import { getAnimeById } from "@/services/animeService";
import { getAnimeImage, formatScore, formatStatus } from "@/lib/utils";
import RelatedAnime from "@/components/anime/RelatedAnime";
import useBookmarkStore from "@/store/bookmarkStore";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isBookmarked, toggleBookmark, initBookmarks } = useBookmarkStore();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    initBookmarks();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAnimeById(id);
        setAnime(result.data);
        setBookmarked(isBookmarked(Number(id)));
      } catch (err) {
        setError("Failed to load anime details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBookmark = () => {
    if (!anime) return;
    toggleBookmark(anime);
    setBookmarked(!bookmarked);
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} onBack={() => router.back()} />;
  if (!anime) return null;

  const bannerImage = getAnimeImage(anime.images, "large");
  const score = formatScore(anime.score);
  const status = formatStatus(anime.status);
  const trailerId = anime.trailer?.youtube_id;
  const embedUrl = anime.trailer?.embed_url;
  const tabs = ["overview", "episodes", "related"];

  return (
    <main className="min-h-screen bg-black pb-32">
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={bannerImage}
          alt={anime.title}
          className="w-full h-full object-cover object-top"
          style={{ filter: "blur(2px) brightness(0.35)" }}
        />
        <div className="hero-scrim absolute inset-0" />
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-5 md:left-16 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "rgba(0,0,0,0.5)", color: "#ffdad5", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="relative z-10 -mt-32 px-5 md:px-16 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <div className="flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden border shadow-2xl"
              style={{ width: "200px", aspectRatio: "2/3", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <img src={bannerImage} alt={anime.title} className="w-full h-full object-cover" />
            </div>
            {score !== "N/A" && (
              <div
                className="mt-3 flex items-center justify-center gap-2 py-2 rounded-xl"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
              >
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span className="font-bold text-lg" style={{ color: "#fbbf24" }}>{score}</span>
                <span className="text-xs" style={{ color: "#c7c6c6" }}>/10</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-32 md:pt-0 md:mt-8">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{
                background: anime.status === "Currently Airing" ? "rgba(34,197,94,0.15)" : "rgba(229,9,20,0.15)",
                color: anime.status === "Currently Airing" ? "#22c55e" : "#e50914",
                border: "1px solid rgba(229,9,20,0.3)",
              }}
            >
              {status}
            </span>

            <h1
              className="font-bold mb-1 leading-tight"
              style={{ color: "#ffdad5", fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              {anime.title_english || anime.title}
            </h1>

            {anime.title_japanese && (
              <p className="text-sm mb-4" style={{ color: "#af8782" }}>{anime.title_japanese}</p>
            )}

            <div className="flex flex-wrap gap-3 mb-5">
              <StatBadge icon={<Tv size={14} />} label={anime.episodes ? anime.episodes + " Episodes" : "Ongoing"} />
              <StatBadge icon={<Clock size={14} />} label={anime.duration || "N/A"} />
              <StatBadge label={anime.type || "TV"} />
              {anime.year && <StatBadge label={String(anime.year)} />}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {anime.genres?.map((genre) => (
                <button
                  key={genre.mal_id}
                  onClick={() => router.push("/genre/" + genre.mal_id)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.25)" }}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => router.push("/anime/watch/" + id)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: "#e50914", color: "#fff7f6" }}
              >
                <Play size={18} fill="white" />
                WATCH NOW
              </button>

              {/* Bookmark Button — fungsional */}
              <button
                onClick={handleBookmark}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 border"
                style={{
                  background: bookmarked ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.08)",
                  color: bookmarked ? "#e50914" : "#ffdad5",
                  borderColor: bookmarked ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.15)",
                }}
              >
                {bookmarked ? <Check size={18} /> : <Plus size={18} />}
                {bookmarked ? "IN MY LIST" : "MY LIST"}
              </button>

              <button
                onClick={() => window.open(anime.url, "_blank")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 border"
                style={{ background: "rgba(255,255,255,0.05)", color: "#c7c6c6", borderColor: "rgba(255,255,255,0.1)" }}
              >
                <ExternalLink size={16} />
                MAL
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mt-8 mb-6 p-1 rounded-xl w-fit"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium capitalize"
              style={{
                background: activeTab === tab ? "#e50914" : "transparent",
                color: activeTab === tab ? "white" : "#c7c6c6",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#ffdad5" }}>Synopsis</h2>
              <p className="text-base leading-relaxed" style={{ color: "rgba(199,198,198,0.85)" }}>
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Trailer */}
            {(trailerId || embedUrl) && (
              <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: "#ffdad5" }}>Trailer</h2>
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9", maxWidth: "700px" }}>
                  <iframe
                    src={trailerId
                      ? "https://www.youtube.com/embed/" + trailerId + "?rel=0&modestbranding=1"
                      : embedUrl?.replace("autoplay=1", "autoplay=0").replace("youtube-nocookie.com", "youtube.com")
                    }
                    title="Anime Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#ffdad5" }}>Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem label="Type" value={anime.type} />
                <InfoItem label="Episodes" value={String(anime.episodes || "Unknown")} />
                <InfoItem label="Status" value={status} />
                <InfoItem label="Aired" value={anime.aired?.string || "N/A"} />
                <InfoItem label="Studio" value={anime.studios?.[0]?.name || "N/A"} />
                <InfoItem label="Source" value={anime.source || "N/A"} />
                <InfoItem label="Duration" value={anime.duration || "N/A"} />
                <InfoItem label="Rating" value={anime.rating || "N/A"} />
                <InfoItem label="Rank" value={anime.rank ? "#" + anime.rank : "N/A"} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "episodes" && <EpisodeTab animeId={id} />}
        {activeTab === "related" && <RelatedAnime relations={anime.relations} />}
      </div>
    </main>
  );
}

function StatBadge({ icon, label }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
      style={{ background: "rgba(255,255,255,0.06)", color: "#c7c6c6", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {icon}{label}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-xs mb-1" style={{ color: "#af8782" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: "#ffdad5" }}>{value}</p>
    </div>
  );
}

function EpisodeTab({ animeId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { getAnimeEpisodes } = await import("@/services/animeService");
        const res = await getAnimeEpisodes(animeId);
        setEpisodes(res.data || []);
      } catch (err) {
        console.error("Episodes fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [animeId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "#c7c6c6" }}>
        <p>No episode data available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {episodes.map((ep) => (
        <button
          key={ep.mal_id}
          onClick={() => router.push("/anime/watch/" + animeId + "?ep=" + ep.mal_id)}
          className="flex items-center gap-4 p-4 rounded-xl text-left w-full transition-all hover:scale-[1.01]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(229,9,20,0.3)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ background: "rgba(229,9,20,0.15)", color: "#e50914" }}
          >
            {ep.mal_id}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#ffdad5" }}>
              {ep.title || "Episode " + ep.mal_id}
            </p>
            {ep.aired && (
              <p className="text-xs mt-0.5" style={{ color: "#af8782" }}>
                {new Date(ep.aired).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
          <Play size={16} style={{ color: "#e50914", flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-black pb-32">
      <div className="h-[50vh] skeleton" />
      <div className="px-5 md:px-16 -mt-32 max-w-screen-xl mx-auto">
        <div className="flex gap-8">
          <div className="skeleton rounded-2xl flex-shrink-0" style={{ width: 200, aspectRatio: "2/3" }} />
          <div className="flex-1 pt-36 flex flex-col gap-4">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton h-12 w-96 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message, onBack }) {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <p className="text-lg" style={{ color: "#ff4444" }}>{message}</p>
      <button onClick={onBack} className="px-6 py-3 rounded-xl font-medium" style={{ background: "#e50914", color: "white" }}>
        Go Back
      </button>
    </main>
  );
}