export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Informasi yang Kami Kumpulkan",
      content: [
        "Nama dan alamat email saat kamu mendaftar atau login dengan Google.",
        "Data bookmark dan preferensi yang disimpan secara lokal di browser kamu (localStorage).",
        "Data sesi login yang dikelola oleh NextAuth.js.",
        "Kami TIDAK mengumpulkan data kartu kredit, nomor telepon, atau informasi sensitif lainnya.",
      ],
    },
    {
      title: "2. Bagaimana Kami Menggunakan Data",
      content: [
        "Untuk mengidentifikasi akun kamu dan menjaga sesi login tetap aktif.",
        "Untuk menyimpan preferensi dan bookmark anime kamu.",
        "Kami tidak menjual, menyewakan, atau berbagi data pribadi kamu kepada pihak ketiga.",
        "Data tidak digunakan untuk keperluan iklan atau marketing.",
      ],
    },
    {
      title: "3. Penyimpanan Data",
      content: [
        "Bookmark dan watch history disimpan di localStorage browser kamu — bukan di server kami.",
        "Data sesi Google dikelola oleh NextAuth.js dengan enkripsi standar.",
        "Kamu bisa menghapus data kapan saja dengan logout dan clear browser data.",
      ],
    },
    {
      title: "4. Third-Party Services",
      content: [
        "Google OAuth — untuk autentikasi login. Tunduk pada Privacy Policy Google.",
        "Jikan API — untuk data anime dari MyAnimeList. Tidak ada data user yang dikirim.",
        "YouTube — untuk embed trailer. YouTube mungkin mengumpulkan data viewing.",
        "Vercel — untuk hosting. Tunduk pada Privacy Policy Vercel.",
      ],
    },
    {
      title: "5. Hak Kamu",
      content: [
        "Kamu berhak mengakses, mengubah, atau menghapus data pribadi kamu.",
        "Kamu bisa logout kapan saja untuk mengakhiri sesi.",
        "Kamu bisa menghapus bookmark dengan membuka My List dan klik Clear All.",
        "Untuk penghapusan akun permanen, hubungi kami melalui halaman Help.",
      ],
    },
    {
      title: "6. Disclaimer",
      content: [
        "ANIMEX adalah proyek fan-made untuk tujuan edukasi.",
        "Kami tidak berafiliasi dengan MyAnimeList, Crunchyroll, atau platform streaming manapun.",
        "Semua konten anime adalah milik studio dan penerbit masing-masing.",
        "Privacy policy ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">
      <div className="max-w-screen-md mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#ffdad5" }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#af8782" }}>
            Last updated: January 2025
          </p>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.15)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#c7c6c6" }}>
            ANIMEX berkomitmen untuk melindungi privasi pengguna. Dokumen ini menjelaskan
            bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi kamu saat
            menggunakan platform ANIMEX.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h2 className="text-base font-bold mb-4" style={{ color: "#ffdad5" }}>
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#c7c6c6" }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#e50914" }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-center mt-10" style={{ color: "#5e3f3b" }}>
          Dengan menggunakan ANIMEX, kamu menyetujui Privacy Policy ini.
          Untuk pertanyaan, kunjungi{" "}
          <a href="/help" className="hover:underline" style={{ color: "#af8782" }}>Help Center</a>.
        </p>
      </div>
    </main>
  );
}