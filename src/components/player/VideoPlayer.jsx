"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Volume2, VolumeX,
  Maximize, Minimize, SkipForward, SkipBack,
  Settings, Loader
} from "lucide-react";

// ================================
// VIDEO PLAYER COMPONENT
// Support: YouTube embed, MP4, HLS
// ================================
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
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto hide controls setelah 3 detik
  const resetControlsTimer = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimeoutRef.current);
  }, []);

  // Format waktu: 3600 → "1:00:00"
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    return m + ":" + String(s).padStart(2, "0");
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent * 100);
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    resetControlsTimer();
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress(dur ? (curr / dur) * 100 : 0);
  };

  // Kalau YouTube, tampilkan iframe
  if (streamType === "youtube" && streamUrl) {
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black"
        style={{ aspectRatio: "16/9", maxHeight: "75vh" }}
      >
        <iframe
          src={streamUrl}
          title={animeTitle + " - Episode " + episodeNumber}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Loader size={40} className="animate-spin" style={{ color: "#e50914" }} />
          </div>
        )}
      </div>
    );
  }

  // Kalau MP4 / HLS — pakai HTML5 video dengan custom controls
  if (streamUrl && (streamType === "mp4" || streamType === "hls")) {
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black overflow-hidden group"
        style={{ aspectRatio: "16/9", maxHeight: "75vh" }}
        onMouseMove={resetControlsTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={streamType === "mp4" ? streamUrl : undefined}
          poster={posterUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={handlePlayPause}
          onError={() => setIsLoading(false)}
            crossOrigin="anonymous"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader size={48} className="animate-spin" style={{ color: "#e50914" }} />
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300"
          style={{ opacity: showControls ? 1 : 0 }}
        >
          {/* Top: Title */}
          <div
            className="px-4 pt-4 pb-8"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "#ffdad5" }}>
              {animeTitle} — Episode {episodeNumber}
            </p>
          </div>

          {/* Center: Big Play Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(229,9,20,0.8)" }}
            >
              {isPlaying
                ? <Pause size={28} fill="white" color="white" />
                : <Play size={28} fill="white" color="white" />
              }
            </button>
          </div>

          {/* Bottom: Progress + Controls */}
          <div
            className="px-4 pb-4 pt-8"
            style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
          >
            {/* Progress Bar */}
            <div
              className="relative w-full h-1 rounded-full mb-3 cursor-pointer group/progress"
              style={{ background: "rgba(255,255,255,0.2)" }}
              onClick={handleSeek}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{ width: progress + "%", background: "#e50914" }}
              />
              {/* Thumb dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: progress + "%", background: "#e50914", transform: "translate(-50%, -50%)" }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Skip Back */}
                <button onClick={() => handleSkip(-10)} className="hover:opacity-80 transition-opacity" style={{ color: "white" }}>
                  <SkipBack size={20} />
                </button>

                {/* Play/Pause */}
                <button onClick={handlePlayPause} className="hover:opacity-80" style={{ color: "white" }}>
                  {isPlaying
                    ? <Pause size={22} fill="white" />
                    : <Play size={22} fill="white" />
                  }
                </button>

                {/* Skip Forward */}
                <button onClick={() => handleSkip(10)} className="hover:opacity-80 transition-opacity" style={{ color: "white" }}>
                  <SkipForward size={20} />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button onClick={handleMute} className="hover:opacity-80" style={{ color: "white" }}>
                    {isMuted || volume === 0
                      ? <VolumeX size={20} />
                      : <Volume2 size={20} />
                    }
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "#e50914" }}
                  />
                </div>

                {/* Time */}
                <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                <button onClick={handleFullscreen} className="hover:opacity-80" style={{ color: "white" }}>
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: belum ada stream URL
  return (
    <div
      className="relative w-full bg-black flex flex-col items-center justify-center gap-4"
      style={{ aspectRatio: "16/9", maxHeight: "75vh" }}
    >
      {/* Poster as background */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt={animeTitle}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(8px) brightness(0.2)" }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)" }}
        >
          <AlertCircle size={32} style={{ color: "#e50914" }} />
        </div>
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: "#ffdad5" }}>
            Stream Not Available
          </p>
          <p className="text-sm max-w-sm" style={{ color: "#af8782" }}>
            Video stream for this episode is not available yet.
            Try watching the trailer instead.
          </p>
        </div>
      </div>
    </div>
  );
}