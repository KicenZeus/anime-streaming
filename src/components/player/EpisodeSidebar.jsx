"use client";

import { useState, useEffect } from "react";
import { Play, List } from "lucide-react";
import { getAnimeEpisodes } from "@/services/animeService";

// ================================
// EPISODE SIDEBAR
// Ditampilkan di sebelah kanan video player
// ================================
export default function EpisodeSidebar({ animeId, totalEpisodes, selectedEp, onEpisodeSelect }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!animeId) return;

    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const res = await getAnimeEpisodes(animeId);
        setEpisodes(res.data || []);
      } catch (err) {
        console.error("Episodes sidebar error:", err);
        // Kalau tidak ada data episode dari Jikan,
        // generate list episode berdasarkan totalEpisodes
        if (totalEpisodes) {
          const generated = Array.from({ length: totalEpisodes }, (_, i) => ({
            mal_id: i + 1,
            title: "Episode " + (i + 1),
          }));
          setEpisodes(generated);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId, totalEpisodes]);

  return (
    <div
      className="lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Sidebar Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-10"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "#0a0a0b",
        }}
      >
        <div className="flex items-center gap-2">
          <List size={16} style={{ color: "#e50914" }} />
          <span className="text-sm font-semibold" style={{ color: "#ffdad5" }}>
            Episodes
          </span>
          {episodes.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(229,9,20,0.15)", color: "#e50914" }}
            >
              {episodes.length}
            </span>
          )}
        </div>

        {/* Toggle sidebar di mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-xs font-medium"
          style={{ color: "#af8782" }}
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {/* Episode List */}
      {isOpen && (
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 160px)",
            background: "#0a0a0b",
          }}
        >
          {loading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : episodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm" style={{ color: "#af8782" }}>
                No episodes found
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-2">
              {episodes.map((ep) => {
                const epNum = ep.mal_id;
                const isSelected = epNum === selectedEp;

                return (
                  <button
                    key={epNum}
                    onClick={() => onEpisodeSelect(epNum)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: isSelected
                        ? "rgba(229,9,20,0.15)"
                        : "transparent",
                      border: isSelected
                        ? "1px solid rgba(229,9,20,0.3)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {/* Episode Number Badge */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{
                        background: isSelected
                          ? "#e50914"
                          : "rgba(255,255,255,0.06)",
                        color: isSelected ? "white" : "#c7c6c6",
                      }}
                    >
                      {isSelected
                        ? <Play size={14} fill="white" color="white" />
                        : epNum
                      }
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: isSelected ? "#e50914" : "#ffdad5" }}
                      >
                        {ep.title || "Episode " + epNum}
                      </p>
                      {ep.aired && (
                        <p className="text-xs mt-0.5" style={{ color: "#af8782" }}>
                          {new Date(ep.aired).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}