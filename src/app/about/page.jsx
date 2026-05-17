"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, Globe, Heart, Code2, Database, Layers } from "lucide-react";

const TECH_STACK = [
  { name: "Next.js 16", desc: "React framework dengan App Router", icon: "⚡", color: "#ffffff" },
  { name: "Tailwind CSS", desc: "Utility-first CSS framework", icon: "🎨", color: "#38bdf8" },
  { name: "Jikan API", desc: "MyAnimeList unofficial REST API", icon: "📡", color: "#e50914" },
  { name: "NextAuth.js", desc: "Authentication dengan Google OAuth", icon: "🔐", color: "#22c55e" },
  { name: "Zustand", desc: "Lightweight state management", icon: "🐻", color: "#fbbf24" },
  { name: "Framer Motion", desc: "Animation library untuk React", icon: "🎬", color: "#a855f7" },
  { name: "Vercel", desc: "Platform deployment frontend", icon: "▲", color: "#ffffff" },
  { name: "MongoDB Atlas", desc: "Cloud database (coming soon)", icon: "🍃", color: "#22c55e" },
];

const FEATURES = [
  "Browse ribuan anime dari database MyAnimeList",
  "Search anime by title atau filter by genre",
  "Watch trailer resmi langsung di platform",
  "Save anime ke My List / Bookmark",
  "Login dengan Google atau Email",
  "Responsive di semua ukuran layar",
  "Dark mode cinematic UI",
  "Real-time data dari Jikan API",
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">
      <div className="max-w-screen-md mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.2)" }}
          >
            Fan Project
          </div>
          <h1
            className="font-extrabold mb-4 tracking-tighter"
            style={{ color: "#ffdad5", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            About ANIMEX
          </h1>
          <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: "#af8782" }}>
            ANIMEX adalah platform streaming anime modern yang dibangun sebagai proyek belajar
            fullstack development — dari UI design hingga backend API.
          </p>
        </div>

        {/* Mission */}
        <div
          className="rounded-2xl p-8 mb-8"
          style={{ background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.15)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart size={20} style={{ color: "#e50914" }} />
            <h2 className="text-lg font-bold" style={{ color: "#ffdad5" }}>Our Mission</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#c7c6c6" }}>
            Membangun pengalaman menonton anime yang cinematic, modern, dan menyenangkan.
            ANIMEX bukan platform komersial — ini adalah showcase dari kemampuan
            modern web development dengan stack terkini.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Layers size={20} style={{ color: "#e50914" }} />
            <h2 className="text-lg font-bold" style={{ color: "#ffdad5" }}>Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span style={{ color: "#e50914", flexShrink: 0 }}>✓</span>
                <span className="text-sm" style={{ color: "#c7c6c6" }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Code2 size={20} style={{ color: "#e50914" }} />
            <h2 className="text-lg font-bold" style={{ color: "#ffdad5" }}>Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-2xl">{tech.icon}</span>
                <p className="text-xs font-bold" style={{ color: "#ffdad5" }}>{tech.name}</p>
                <p className="text-xs" style={{ color: "#af8782" }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Database size={18} style={{ color: "#af8782" }} />
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#af8782" }}>
              Disclaimer
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#5e3f3b" }}>
            ANIMEX adalah proyek fan-made untuk tujuan edukasi dan portfolio.
            Data anime diambil dari Jikan API (MyAnimeList unofficial).
            Semua konten, karakter, dan nama anime adalah milik studio dan penerbit masing-masing.
            ANIMEX tidak berafiliasi dengan platform streaming komersial manapun.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/anime")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: "#e50914", color: "white" }}
          >
            <Globe size={16} />
            Browse Anime
          </button>
          <a
            href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 border"
              style={{ color: "#ffdad5", borderColor: "rgba(255,255,255,0.15)" }}
            >
              <ExternalLink size={16} />
              View Source
            </a>
        </div>
      </div>
    </main>
  );
}