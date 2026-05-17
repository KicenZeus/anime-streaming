export default function TermsPage() {
  const sections = [
    {
      title: "1. Penerimaan Syarat",
      content: [
        "Dengan mengakses ANIMEX, kamu menyetujui syarat dan ketentuan ini.",
        "Jika kamu tidak setuju, harap berhenti menggunakan platform ini.",
        "Kami berhak mengubah syarat ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan.",
      ],
    },
    {
      title: "2. Penggunaan Platform",
      content: [
        "ANIMEX hanya boleh digunakan untuk keperluan pribadi dan non-komersial.",
        "Dilarang menggunakan bot, scraper, atau alat otomatis untuk mengakses konten.",
        "Dilarang mencoba meretas, memanipulasi, atau mengganggu layanan platform.",
        "Pengguna harus berusia minimal 13 tahun untuk mendaftar akun.",
      ],
    },
    {
      title: "3. Akun Pengguna",
      content: [
        "Kamu bertanggung jawab atas keamanan akun dan password kamu.",
        "Jangan berbagi akun dengan orang lain.",
        "Segera laporkan jika akunmu diretas atau diakses tanpa izin.",
        "Kami berhak menonaktifkan akun yang melanggar ketentuan ini.",
      ],
    },
    {
      title: "4. Konten & Hak Cipta",
      content: [
        "Semua konten anime (gambar, video, nama, karakter) adalah hak milik studio dan penerbit masing-masing.",
        "ANIMEX hanya menampilkan metadata dan trailer yang tersedia secara publik.",
        "ANIMEX tidak meng-host konten bajakan atau ilegal.",
        "Jika kamu adalah pemegang hak dan menemukan pelanggaran, hubungi kami segera.",
      ],
    },
    {
      title: "5. Disclaimer Layanan",
      content: [
        "ANIMEX adalah proyek fan-made untuk tujuan edukasi — bukan layanan komersial.",
        "Kami tidak menjamin ketersediaan layanan 100% sepanjang waktu.",
        "Data anime diambil dari Jikan API dan mungkin tidak selalu akurat.",
        "Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan platform ini.",
      ],
    },
    {
      title: "6. Pembatasan Tanggung Jawab",
      content: [
        "ANIMEX tidak bertanggung jawab atas konten eksternal yang ditautkan dari platform.",
        "Kami tidak bertanggung jawab atas gangguan layanan akibat masalah teknis pihak ketiga.",
        "Penggunaan platform ini sepenuhnya atas risiko pengguna sendiri.",
      ],
    },
    {
      title: "7. Pemutusan Layanan",
      content: [
        "Kami berhak menghentikan akses kamu kapan saja jika melanggar ketentuan ini.",
        "Kamu dapat menghapus akun kapan saja melalui halaman Help.",
        "Setelah akun dihapus, data yang tersimpan di server akan dihapus permanen.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-24 pb-32 px-5 md:px-16">
      <div className="max-w-screen-md mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#ffdad5" }}>
            Terms of Service
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
            Selamat datang di ANIMEX. Harap baca Syarat dan Ketentuan ini dengan seksama
            sebelum menggunakan platform kami. Dokumen ini mengatur hubungan antara
            kamu sebagai pengguna dan ANIMEX sebagai penyedia layanan.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
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
          Dengan menggunakan ANIMEX, kamu menyetujui Terms of Service ini.
          Pertanyaan? Kunjungi{" "}
          <a href="/help" className="hover:underline" style={{ color: "#af8782" }}>Help Center</a>.
        </p>
      </div>
    </main>
  );
}