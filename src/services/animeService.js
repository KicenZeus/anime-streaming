import { jikanApi } from "@/lib/axios";

// ================================
// ANIME SERVICE
// Semua fungsi untuk fetch data anime
// dikumpulin di sini — separation of concerns
// ================================

/**
 * Ambil daftar anime trending / top saat ini
 * Endpoint: GET /top/anime
 */
export const getTopAnime = async (page = 1, limit = 10) => {
  try {
    const response = await jikanApi.get("/top/anime", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("getTopAnime error:", error.message);
    throw error;
  }
};

/**
 * Ambil anime yang lagi tayang musim ini
 * Endpoint: GET /seasons/now
 */
export const getCurrentSeasonAnime = async (page = 1, limit = 12) => {
  try {
    const response = await jikanApi.get("/seasons/now", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("getCurrentSeasonAnime error:", error.message);
    throw error;
  }
};

/**
 * Ambil detail satu anime berdasarkan ID
 * Endpoint: GET /anime/{id}
 */
export const getAnimeById = async (id) => {
  try {
    const response = await jikanApi.get(`/anime/${id}/full`);
    return response.data;
  } catch (error) {
    console.error("getAnimeById error:", error.message);
    throw error;
  }
};

/**
 * Search anime berdasarkan keyword
 * Endpoint: GET /anime?q={query}
 */
export const searchAnime = async (query, page = 1, limit = 12) => {
  try {
    const response = await jikanApi.get("/anime", {
      params: { q: query, page, limit, order_by: "score", sort: "desc" },
    });
    return response.data;
  } catch (error) {
    console.error("searchAnime error:", error.message);
    throw error;
  }
};

/**
 * Ambil anime berdasarkan genre
 * Endpoint: GET /anime?genres={id}
 */
export const getAnimeByGenre = async (genreId, page = 1, limit = 12) => {
  try {
    const response = await jikanApi.get("/anime", {
      params: { genres: genreId, page, limit, order_by: "score", sort: "desc" },
    });
    return response.data;
  } catch (error) {
    console.error("getAnimeByGenre error:", error.message);
    throw error;
  }
};

/**
 * Ambil anime yang akan datang (upcoming)
 * Endpoint: GET /seasons/upcoming
 */
export const getUpcomingAnime = async (limit = 10) => {
  try {
    const response = await jikanApi.get("/seasons/upcoming", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("getUpcomingAnime error:", error.message);
    throw error;
  }
};

/**
 * Ambil rekomendasi anime
 * Endpoint: GET /recommendations/anime
 */
export const getAnimeRecommendations = async () => {
  try {
    const response = await jikanApi.get("/recommendations/anime");
    return response.data;
  } catch (error) {
    console.error("getAnimeRecommendations error:", error.message);
    throw error;
  }
};