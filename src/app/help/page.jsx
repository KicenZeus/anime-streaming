"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "General",
    items: [
      {
        q: "Apa itu ANIMEX?",
        a: "ANIMEX adalah platform browsing dan streaming anime yang dibangun sebagai proyek fan-made. Kamu bisa browse ribuan anime, lihat trailer, dan simpan anime favorit ke My List.",
      },
      {
        q: "Apakah ANIMEX gratis?",
        a: "Ya, ANIMEX sepenuhnya gratis. Tidak ada subscription, tidak ada iklan berbayar, dan tidak perlu kartu kredit.",
      },
      {
        q: "Data anime dari mana?",
        a: "Data anime diambil dari Jikan API, yang merupakan unofficial REST API dari MyAnimeList (MAL). Data mencakup metadata, rating, sinopsis, genre, dan trailer.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "Bagaimana cara daftar akun?",
        a: "Klik tombol Sign Up di navbar, lalu isi username, email, dan password. Atau bisa langsung login dengan Google Account untuk lebih mudah.",
      },
      {
        q: "Bisa login pakai Google?",
        a: "Ya! Klik tombol 'Continue with Google' di halaman login atau register. Kamu akan diarahkan ke Google untuk authentication, lalu otomatis masuk ke ANIMEX.",
      },
      {
        q: "Data saya aman?",
        a: "ANIMEX hanya menyimpan email dan nama dari Google. Password tidak pernah disimpan dalam bentuk plain text — semua dienkripsi. Bookmark disimpan di browser kamu (localStorage).",
      },
    ],
  },
  {
    category: "Fitur",
    items: [
      {
        q: "Bagaimana cara menyimpan anime ke My List?",
        a: "Buka halaman detail anime, lalu klik tombol 'MY LIST'. Anime akan tersimpan otomatis. Kamu bisa lihat semua anime yang disimpan di halaman Profile > My List.",
      },
      {
        q: "Kenapa beberapa anime tidak punya trailer?",
        a: "Trailer diambil dari data Jikan API. Beberapa anime — terutama yang lama — mungkin tidak memiliki trailer YouTube yang terdaftar di MyAnimeList.",
      },
      {
        q: "Bisa nonton full episode?",
        a: "Saat ini ANIMEX hanya menyediakan trailer resmi dari YouTube. Full episode streaming sedang dalam pengembangan.",
      },
      {
        q: "Bagaimana cara search anime?",
        a: "Klik icon search di navbar atau buka halaman /search. Ketik judul anime dan hasil akan muncul otomatis. Kamu juga bisa filter berdasarkan genre.",
      },
    ],
  },
  {
    category: "Teknis",
    items: [
      {
        q: "Kenapa loading lambat?",
        a: "Data diambil dari Jikan API yang memiliki rate limit 3 request per detik. Kami sudah menambahkan delay otomatis untuk menghindari error. Kalau tetap lambat, coba refresh halaman.",
      },
      {
        q: "Kenapa muncul error 429?",
        a: "Error 429 berarti terlalu banyak request ke Jikan API dalam waktu singkat. Tunggu beberapa detik lalu refresh. Ini sudah ditangani otomatis dengan retry logic.",
      },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  // Filter FAQ berdasarkan search
  const filteredFAQ = FAQ_ITEMS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">
      <div className="max-w-screen-md mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#ffdad5" }}>
            Help Center
          </h1>
          <p className="text-sm" style={{ color: "#af8782" }}>
            Temukan jawaban dari pertanyaan yang sering ditanyakan
          </p>
        </div>

        {/* Search FAQ */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-10"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Search size={18} style={{ color: "#af8782" }} />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "#ffdad5" }}
          />
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-8 mb-12">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "#af8782" }}>No results for "{searchQuery}"</p>
            </div>
          ) : (
            filteredFAQ.map((cat) => (
              <div key={cat.category}>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#e50914" }}
                >
                  {cat.category}
                </h2>
                <div className="flex flex-col gap-2">
                  {cat.items.map((item, i) => {
                    const key = cat.category + i;
                    const isOpen = openItem === key;
                    return (
                      <div
                        key={key}
                        className="rounded-2xl overflow-hidden transition-all duration-200"
                        style={{
                          background: isOpen ? "rgba(229,9,20,0.06)" : "rgba(255,255,255,0.03)",
                          border: isOpen ? "1px solid rgba(229,9,20,0.2)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left"
                        >
                          <span className="text-sm font-medium pr-4" style={{ color: "#ffdad5" }}>
                            {item.q}
                          </span>
                          {isOpen
                            ? <ChevronUp size={18} style={{ color: "#e50914", flexShrink: 0 }} />
                            : <ChevronDown size={18} style={{ color: "#af8782", flexShrink: 0 }} />
                          }
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4">
                            <p className="text-sm leading-relaxed" style={{ color: "#c7c6c6" }}>
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <MessageCircle size={32} className="mx-auto mb-4" style={{ color: "#e50914" }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: "#ffdad5" }}>
            Still have questions?
          </h3>
          <p className="text-sm mb-6" style={{ color: "#af8782" }}>
            Tidak menemukan jawaban yang kamu cari? Hubungi kami.
          </p>
          <a
            href="mailto:support@animex.dev"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: "#e50914", color: "white" }}
          >
            <Mail size={16} />
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}