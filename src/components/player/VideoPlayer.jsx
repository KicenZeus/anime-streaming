"use client";

import { useState, useRef } from "react";
import {
  Play, Pause, Volume2, VolumeX,
  Maximize, Minimize, SkipForward, SkipBack,
  AlertCircle, Loader
} from "lucide-react";

export default function VideoPlayer({
  streamUrl,
  streamType = "youtube",
  posterUrl,
  animeTitle,
  episodeNumber,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetControlsTimer = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }
    return m + ":" + String(s).padStart(2, "0");
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    resetControlsTimer();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent * 100);
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds)
    );
    resetControlsTimer();
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress(dur > 0 ? (curr / dur) * 100 : 0);
  };

  // ===== YOUTUBE PLAYER =====
  if (streamType === "youtube" && streamUrl) {
    return (
      <div
        className="relative w-full bg-black"
        style={{ aspectRatio: "16/9", maxHeight: "75vh" }}
      >
        {/* Loading state sebelum iframe load */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: "#0a0a0b" }}>
            {posterUrl && (
              <img
                src={posterUrl}
                alt={animeTitle}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(8px) brightness(0.3)" }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Loader size={36} className="animate-spin" style={{ color: "#e50914" }} />
              <p className="text-sm font-medium" style={{ color: "#ffdad5" }}>
                Loading player...
              </p>
            </div>
          </div>
        )}

        <iframe
          src={streamUrl}
          title={animeTitle + " - Episode " + episodeNumber}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full"
          style={{ border: "none" }}
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    );
  }

  // ===== MP4 PLAYER dengan custom controls =====
  if (streamType === "mp4" && streamUrl) {
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black overflow-hidden"
        style={{ aspectRatio: "16/9", maxHeight: "75vh", cursor: showControls ? "default" : "none" }}
        onMouseMove={resetControlsTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={posterUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsBuffering(false)}
        >
          <source src={streamUrl} type="video/mp4" />
        </video>

        {/* Buffering spinner */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader size={48} className="animate-spin" style={{ color: "#e50914" }} />
          </div>
        )}

        {/* Controls overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300"
          style={{ opacity: showControls ? 1 : 0 }}
          onClick={handlePlayPause}
        >
          {/* Top gradient + title */}
          <div
            className="px-4 pt-4 pb-12"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "#ffdad5" }}>
              {animeTitle} — Episode {episodeNumber}
            </p>
          </div>

          {/* Center play button */}
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(229,9,20,0.85)", backdropFilter: "blur(4px)" }}
            >
              {isPlaying
                ? <Pause size={28} fill="white" color="white" />
                : <Play size={28} fill="white" color="white" />
              }
            </button>
          </div>

          {/* Bottom controls */}
          <div
            className="px-4 pb-4 pt-12"
            style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div
              className="relative w-full h-1 rounded-full mb-4 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.2)" }}
              onClick={handleSeek}
            >
              {/* Buffered (visual) */}
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: progress + "%", background: "#e50914" }}
              />
              {/* Thumb */}
              <div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: "calc(" + progress + "% - 6px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#e50914",
                  boxShadow: "0 0 6px rgba(229,9,20,0.8)",
                }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => handleSkip(-10)} style={{ color: "white" }} className="hover:opacity-70 transition-opacity">
                  <SkipBack size={20} />
                </button>
                <button onClick={handlePlayPause} style={{ color: "white" }} className="hover:opacity-70">
                  {isPlaying
                    ? <Pause size={22} fill="white" />
                    : <Play size={22} fill="white" />
                  }
                </button>
                <button onClick={() => handleSkip(10)} style={{ color: "white" }} className="hover:opacity-70 transition-opacity">
                  <SkipForward size={20} />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button onClick={handleMute} style={{ color: "white" }} className="hover:opacity-70">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 cursor-pointer"
                    style={{ accentColor: "#e50914" }}
                  />
                </div>

                <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button onClick={handleFullscreen} style={{ color: "white" }} className="hover:opacity-70">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== FALLBACK — tidak ada stream =====
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center"
      style={{
        aspectRatio: "16/9",
        maxHeight: "75vh",
        background: "linear-gradient(135deg, #0a0a0b 0%, #1a0908 100%)",
      }}
    >
      {posterUrl && (
        <img
          src={posterUrl}
          alt={animeTitle}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(12px) brightness(0.15)" }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.25)" }}
        >
          <AlertCircle size={32} style={{ color: "#e50914" }} />
        </div>
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: "#ffdad5" }}>
            Trailer Not Available
          </p>
          <p className="text-sm max-w-xs" style={{ color: "#af8782" }}>
            Anime ini belum memiliki trailer yang tersedia saat ini.
          </p>
        </div>
      </div>
    </div>
  );
}