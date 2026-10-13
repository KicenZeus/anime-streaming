"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle, Film, Server } from "lucide-react";
import { getAnimeById, getEpisodeStream } from "@/services/animeService";
import { getAnimeImage } from "@/lib/utils";
import VideoPlayer from "@/components/player/VideoPlayer";
import EpisodeSidebar from "@/components/player/EpisodeSidebar";

function WatchContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const epParam = searchParams.get("ep");

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEp, setSelectedEp] = useState(
    epParam ? Number(epParam) : 1
  );

  const [streamUrl, setStreamUrl] = useState(null);
  const [streamType, setStreamType] = useState("none");
  const [serverName, setServerName] = useState("");
  const [streamLoading, setStreamLoading] = useState(false);
  const [availableServers, setAvailableServers] = useState([]);
  const [currentServerId, setCurrentServerId] = useState("vidlink");

  // Fetch anime detail
  useEffect(() => {
    if (!id) return;

    const fetchAnime = async () => {
      try {
        setLoading(true);
        const result = await getAnimeById(id);
        setAnime(result.data);
      } catch (err) {
        console.error("Failed fetch anime:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  // Fetch episode stream saat anime, selectedEp, atau server berubah
  useEffect(() => {
    if (!anime) return;

    const fetchStream = async () => {
      try {
        setStreamLoading(true);
        const streamInfo = await getEpisodeStream(
          anime,
          selectedEp,
          anime.title_english || anime.title,
          currentServerId
        );

        if (streamInfo?.availableServers) {
          setAvailableServers(streamInfo.availableServers);
        }

        if (streamInfo?.streamUrl) {
          setStreamUrl(streamInfo.streamUrl);
          setStreamType(streamInfo.streamType);
          setServerName(streamInfo.server || "Stream Server");
        } else if (anime.trailer?.youtube_id) {
          setStreamUrl(
            "https://www.youtube.com/embed/" +
              anime.trailer.youtube_id +
              "?rel=0&autoplay=1"
          );
          setStreamType("youtube");
          setServerName("YouTube Trailer");
        } else {
          setStreamUrl(null);
          setStreamType("none");
        }
      } catch (err) {
        console.error("Failed to load stream:", err);
      } finally {
        setStreamLoading(false);
      }
    };

    fetchStream();
  }, [anime, selectedEp, currentServerId]);

  const handleEpisodeChange = (epNum) => {
    setSelectedEp(epNum);
    window.history.pushState({}, "", "/anime/watch/" + id + "?ep=" + epNum);
  };

  if (loading) return <WatchSkeleton />;

  if (!anime) {
    return (
      <main className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "#e50914" }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#ffdad5" }}>
            Anime Not Found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#e50914", color: "white" }}
          >
            Back Home
          </button>
        </div>
      </main>
    );
  }

  const posterUrl = getAnimeImage(anime.images, "large");

  return (
    <main className="min-h-screen bg-black pt-16">
      {/* Top Bar */}
      <div
        className="flex items-center gap-4 px-4 md:px-6 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => router.push("/anime/" + id)}
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "#c7c6c6" }}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "#ffdad5" }}>
            {anime.title_english || anime.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: "#af8782" }}>
              Episode {selectedEp}
            </span>
            {serverName && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", border: "1px solid rgba(229,9,20,0.25)" }}
              >
                <Server size={10} />
                {serverName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 112px)" }}>
        {/* Player Area */}
        <div className="flex-1">
          {streamUrl ? (
            <VideoPlayer
              streamUrl={streamUrl}
              streamType={streamType}
              posterUrl={posterUrl}
              animeTitle={anime.title_english || anime.title}
              episodeNumber={selectedEp}
            />
          ) : (
            <div
              className="w-full flex items-center justify-center"
              style={{ aspectRatio: "16/9", background: "linear-gradient(to bottom right, #111, #1a1a1a)" }}
            >
              <div className="text-center px-6">
                <AlertCircle size={52} className="mx-auto mb-4" style={{ color: "#e50914" }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: "#ffdad5" }}>
                  Trailer Not Available
                </h2>
                <p className="text-sm max-w-md" style={{ color: "#af8782" }}>
                  Anime ini belum memiliki trailer YouTube yang tersedia.
                </p>
              </div>
            </div>
          )}

          {/* Server Selector Bar */}
          {availableServers.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 px-4 md:px-6 py-3 border-b"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                className="flex items-center gap-1.5 text-xs font-semibold mr-1"
                style={{ color: "#af8782" }}
              >
                <Server size={14} style={{ color: "#e50914" }} />
                <span>PILIH SERVER:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {availableServers.map((srv) => {
                  const isActive =
                    currentServerId === srv.id ||
                    (!currentServerId && srv.id === "vidlink");
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setCurrentServerId(srv.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: isActive ? "#e50914" : "rgba(255,255,255,0.06)",
                        color: isActive ? "#ffffff" : "#c7c6c6",
                        border: isActive
                          ? "1px solid #e50914"
                          : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {srv.name}
                    </button>
                  );
                })}
              </div>
              <span
                className="text-[11px] ml-auto hidden sm:inline-block"
                style={{ color: "rgba(199,198,198,0.5)" }}
              >
                Ganti server jika video loading lambat / terblokir
              </span>
            </div>
          )}

          {/* Anime Info */}
          <div className="p-4 md:p-6">
            <h1 className="text-lg font-bold mb-1" style={{ color: "#ffdad5" }}>
              {anime.title_english || anime.title}
            </h1>
            <p className="text-sm mb-4" style={{ color: "#af8782" }}>
              Episode {selectedEp}
              {anime.episodes ? " of " + anime.episodes : ""}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.slice(0, 4).map((g) => (
                <span
                  key={g.mal_id}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(229,9,20,0.1)",
                    color: "#e50914",
                    border: "1px solid rgba(229,9,20,0.2)",
                  }}
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(199,198,198,0.8)" }}>
              {anime.synopsis?.slice(0, 300)}
              {anime.synopsis?.length > 300 ? "..." : ""}
            </p>
          </div>
        </div>

        {/* Episode Sidebar */}
        <EpisodeSidebar
          animeId={id}
          totalEpisodes={anime.episodes}
          selectedEp={selectedEp}
          onEpisodeSelect={handleEpisodeChange}
        />
      </div>
    </main>
  );
}

function WatchSkeleton() {
  return (
    <main className="min-h-screen bg-black pt-16">
      <div className="skeleton h-12 w-full" />
      <div className="skeleton w-full" style={{ aspectRatio: "16/9", maxHeight: "70vh" }} />
    </main>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<WatchSkeleton />}>
      <WatchContent />
    </Suspense>
  );
}
