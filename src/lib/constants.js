// ================================
// APP CONSTANTS
// Semua nilai tetap dikumpulin di sini
// supaya kalau mau ganti, cukup di satu tempat
// ================================

// Nama dan info app
export const APP_NAME = "ANIMEX";
export const APP_TAGLINE = "Stream Anime in Cinematic Quality";

// URL API
// Jikan API — gratis, no API key, data lengkap dari MyAnimeList
export const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// URL backend kita sendiri (nanti kita buat)
// Saat development pakai localhost, saat production ganti dengan URL deploy
export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export const CONSUMET_BASE_URL =
  process.env.NEXT_PUBLIC_CONSUMET_URL || "http://localhost:3001";

// Jikan API rate limit: max 3 request per detik
// Kalau lebih dari itu, API akan return error 429
export const API_RATE_LIMIT_DELAY = 400; // milliseconds antar request

// Jumlah item per halaman (pagination)
export const ITEMS_PER_PAGE = 20;

// Navigasi utama (desktop)
export const MAIN_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Anime", href: "/anime" },
  { label: "Ongoing", href: "/ongoing" },
  { label: "Genres", href: "/genre" },
  { label: "My List", href: "/profile/bookmarks" },
];

// Navigasi bottom bar (mobile)
export const BOTTOM_NAV_LINKS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Search", href: "/search", icon: "search" },
  { label: "My List", href: "/profile/bookmarks", icon: "bookmark" },
  { label: "Profile", href: "/profile", icon: "user" },
];

// Genre anime yang paling populer
export const POPULAR_GENRES = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 14, name: "Horror" },
  { id: 7, name: "Mystery" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" },
  { id: 27, name: "Shounen" },
  { id: 42, name: "Seinen" },
];

// Local storage keys
// Dipake buat nyimpan data di browser (bookmark, watch history)
export const STORAGE_KEYS = {
  AUTH_TOKEN: "animex_token",
  USER_DATA: "animex_user",
  WATCH_HISTORY: "animex_watch_history",
  BOOKMARKS: "animex_bookmarks",
  THEME: "animex_theme",
};

