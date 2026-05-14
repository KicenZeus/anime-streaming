// ================================
// UTILITY FUNCTIONS
// Helper functions yang dipake di banyak tempat
// ================================

/**
 * Format angka episode
 * Contoh: formatEpisode(12) → "12 Episodes"
 */
export const formatEpisode = (count) => {
  if (!count) return "Unknown Episodes";
  return `${count} Episode${count > 1 ? "s" : ""}`;
};

/**
 * Format score anime
 * Contoh: formatScore(8.72) → "8.7"
 */
export const formatScore = (score) => {
  if (!score) return "N/A";
  return parseFloat(score).toFixed(1);
};

/**
 * Format status anime untuk display
 * Contoh: "Currently Airing" → "Ongoing"
 */
export const formatStatus = (status) => {
  const statusMap = {
    "Currently Airing": "Ongoing",
    "Finished Airing": "Completed",
    "Not yet aired": "Upcoming",
  };
  return statusMap[status] || status;
};

/**
 * Truncate text panjang
 * Contoh: truncateText("Lorem ipsum dolor sit", 10) → "Lorem ipsu..."
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Ambil image URL dari data Jikan API
 * Jikan punya beberapa ukuran image: jpg, webp, small, large
 */
export const getAnimeImage = (images, size = "large") => {
  if (!images) return "/images/placeholder.jpg";

  // Prefer webp (lebih kecil ukuran file)
  if (images.webp) {
    return images.webp[`${size}_image_url`] || images.webp.image_url;
  }

  // Fallback ke jpg
  if (images.jpg) {
    return images.jpg[`${size}_image_url`] || images.jpg.image_url;
  }

  return "/images/placeholder.jpg";
};

/**
 * Format durasi episode
 * Input dari Jikan: "24 min per ep" → "24 min"
 */
export const formatDuration = (duration) => {
  if (!duration) return "";
  // Regex untuk extract angka menit
  const match = duration.match(/(\d+)\s*min/);
  if (match) return `${match[1]}m`;
  return duration;
};

/**
 * Convert genres array ke string
 * Input: [{name: "Action"}, {name: "Comedy"}]
 * Output: "Action, Comedy"
 */
export const formatGenres = (genres, maxCount = 3) => {
  if (!genres || genres.length === 0) return "Unknown Genre";
  return genres
    .slice(0, maxCount)
    .map((g) => g.name)
    .join(", ");
};

/**
 * Generate tahun dari aired date
 */
export const getYear = (aired) => {
  if (!aired?.from) return "Unknown";
  return new Date(aired.from).getFullYear();
};

/**
 * Delay function — dipake buat rate limiting Jikan API
 * Usage: await delay(400) → tunggu 400ms
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cek apakah user sudah login
 * Cek dari localStorage
 */
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("animex_token");
  return !!token; // convert ke boolean
};

/**
 * Format angka besar
 * Contoh: 1234567 → "1.2M"
 */
export const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};