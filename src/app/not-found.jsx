"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Auto redirect ke home setelah 10 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-5 text-center">

      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(229,9,20,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* 404 Number */}
        <div className="relative">
          <span
            className="font-extrabold select-none"
            style={{
              fontSize: "clamp(8rem, 20vw, 16rem)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "2px rgba(229,9,20,0.3)",
            }}
          >
            404
          </span>
          {/* Red glow overlay */}
          <span
            className="absolute inset-0 font-extrabold select-none flex items-center justify-center"
            style={{
              fontSize: "clamp(8rem, 20vw, 16rem)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(229,9,20,0.1)",
              filter: "blur(20px)",
              background: "linear-gradient(135deg, #e50914, transparent)",
              WebkitBackgroundClip: "text",
            }}
          >
            404
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)" }}
        >
          🎌
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#ffdad5" }}>
            Page Not Found
          </h1>
          <p className="text-base max-w-md" style={{ color: "#af8782" }}>
            Looks like this page went on a filler arc and never came back.
          </p>
        </div>

        {/* Countdown */}
        <p className="text-sm" style={{ color: "#5e3f3b" }}>
          Redirecting to home in{" "}
          <span style={{ color: "#e50914", fontWeight: "600" }}>{countdown}s</span>
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: "#e50914", color: "white" }}
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/anime")}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#ffdad5",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Browse Anime
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 border"
            style={{
              background: "transparent",
              color: "#c7c6c6",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}