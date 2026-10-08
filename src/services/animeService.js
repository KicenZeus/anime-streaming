import axios from "axios";
import { CONSUMET_BASE_URL, POPULAR_GENRES } from "@/lib/constants";

// ================================
// ANIME SERVICE (Powered by AniList GraphQL)
// Menggantikan Jikan API yang sudah tidak aktif.
// Format data di-mapping persis sesuai kebutuhan komponen:
// mal_id, images, title, title_english, score, synopsis, genres, dll.
// ================================

const ANILIST_URL = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  description(asHtml: false)
  episodes
  duration
  genres
  averageScore
  popularity
  status
  format
  seasonYear
  startDate {
    year
  }
  trailer {
    id
    site
    thumbnail
  }
  studios {
    nodes {
      name
    }
  }
`;

/**
 * Eksekusi query GraphQL ke AniList
 */
async function fetchGraphQL(query, variables = {}) {
  try {
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`AniList error: HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL Error");
    }

    return json.data;
  } catch (error) {
    console.error("fetchGraphQL error:", error.message);
    throw error;
  }
}

/**
 * Mapping data AniList ke struktur objek yang diharapkan komponen
 */
function mapAniListToApp(media) {
  if (!media) return null;

  const englishTitle = media.title?.english || media.title?.romaji || media.title?.native || "Untitled";
  const romajiTitle = media.title?.romaji || englishTitle;
  const posterUrl = media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || "/images/placeholder.jpg";
  const bannerUrl = media.bannerImage || posterUrl;

  const cleanSynopsis = media.description
    ? media.description.replace(/<[^>]*>?/gm, "").trim()
    : "No synopsis available.";

  const formattedScore = media.averageScore
    ? (media.averageScore / 10).toFixed(1)
    : "N/A";

  const statusMap = {
    RELEASING: "Currently Airing",
    FINISHED: "Finished Airing",
    NOT_YET_RELEASED: "Not yet aired",
    CANCELLED: "Cancelled",
  };

  const year = media.seasonYear || media.startDate?.year || "N/A";

  return {
    mal_id: media.id,
    id: media.id,
    title: romajiTitle,
    title_english: englishTitle,
    title_japanese: media.title?.native || romajiTitle,
    images: {
      jpg: {
        image_url: posterUrl,
        small_image_url: media.coverImage?.medium || posterUrl,
        large_image_url: posterUrl,
      },
      webp: {
        image_url: posterUrl,
        small_image_url: media.coverImage?.medium || posterUrl,
        large_image_url: posterUrl,
      },
    },
    banner_image: bannerUrl,
    synopsis: cleanSynopsis,
    score: formattedScore !== "N/A" ? formattedScore : null,
    scored_by: media.popularity || 0,
    rank: null,
    popularity: media.popularity,
    episodes: media.episodes,
    status: statusMap[media.status] || media.status || "Ongoing",
    year: year !== "N/A" ? year : null,
    aired: {
      prop: {
        from: {
          year: year !== "N/A" ? year : null,
        },
      },
      string: year !== "N/A" ? String(year) : "N/A",
    },
    duration: media.duration ? `${media.duration} min` : "24 min",
    genres: (media.genres || []).map((name) => ({ name })),
    studios: (media.studios?.nodes || []).map((s) => ({ name: s.name })),
    trailer: media.trailer?.site === "youtube" ? {
      youtube_id: media.trailer.id,
      url: `https://www.youtube.com/watch?v=${media.trailer.id}`,
      embed_url: `https://www.youtube.com/embed/${media.trailer.id}`,
    } : null,
  };
}

/**
 * Ambil daftar anime trending / top saat ini
 */
export const getTopAnime = async (page = 1, limit = 10) => {
  try {
    const query = `
      query ($page: Int, $limit: Int) {
        Page(page: $page, perPage: $limit) {
          pageInfo {
            hasNextPage
          }
          media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { page, limit });
    const list = (data?.Page?.media || []).map((m, idx) => {
      const mapped = mapAniListToApp(m);
      mapped.rank = (page - 1) * limit + idx + 1;
      return mapped;
    });

    return {
      data: list,
      pagination: {
        has_next_page: data?.Page?.pageInfo?.hasNextPage || false,
      },
    };
  } catch (error) {
    console.error("getTopAnime error:", error.message);
    return { data: [], pagination: { has_next_page: false } };
  }
};

/**
 * Ambil anime yang lagi tayang musim ini
 */
export const getCurrentSeasonAnime = async (page = 1, limit = 12) => {
  try {
    const query = `
      query ($page: Int, $limit: Int) {
        Page(page: $page, perPage: $limit) {
          pageInfo {
            hasNextPage
          }
          media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { page, limit });
    return {
      data: (data?.Page?.media || []).map(mapAniListToApp),
      pagination: {
        has_next_page: data?.Page?.pageInfo?.hasNextPage || false,
      },
    };
  } catch (error) {
    console.error("getCurrentSeasonAnime error:", error.message);
    return { data: [], pagination: { has_next_page: false } };
  }
};

/**
 * Ambil detail satu anime berdasarkan ID
 */
export const getAnimeById = async (id) => {
  try {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          ${MEDIA_FIELDS}
        }
      }
    `;
    const data = await fetchGraphQL(query, { id: Number(id) });
    return {
      data: mapAniListToApp(data?.Media),
    };
  } catch (error) {
    console.error("getAnimeById error:", error.message);
    throw error;
  }
};

/**
 * Search anime berdasarkan keyword
 */
export const searchAnime = async (query, page = 1, limit = 12) => {
  try {
    const gql = `
      query ($search: String, $page: Int, $limit: Int) {
        Page(page: $page, perPage: $limit) {
          pageInfo {
            hasNextPage
          }
          media(type: ANIME, search: $search, sort: POPULARITY_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(gql, { search: query, page, limit });
    return {
      data: (data?.Page?.media || []).map(mapAniListToApp),
      pagination: {
        has_next_page: data?.Page?.pageInfo?.hasNextPage || false,
      },
    };
  } catch (error) {
    console.error("searchAnime error:", error.message);
    return { data: [], pagination: { has_next_page: false } };
  }
};

/**
 * Ambil anime berdasarkan genre
 */
export const getAnimeByGenre = async (genreIdOrName, page = 1, limit = 12) => {
  try {
    let genreName = genreIdOrName;
    if (typeof genreIdOrName === "number" || !isNaN(Number(genreIdOrName))) {
      const found = POPULAR_GENRES.find((g) => String(g.id) === String(genreIdOrName));
      if (found) genreName = found.name;
    }

    const query = `
      query ($genre: String, $page: Int, $limit: Int) {
        Page(page: $page, perPage: $limit) {
          pageInfo {
            hasNextPage
          }
          media(type: ANIME, genre: $genre, sort: POPULARITY_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { genre: genreName, page, limit });
    return {
      data: (data?.Page?.media || []).map(mapAniListToApp),
      pagination: {
        has_next_page: data?.Page?.pageInfo?.hasNextPage || false,
      },
    };
  } catch (error) {
    console.error("getAnimeByGenre error:", error.message);
    return { data: [], pagination: { has_next_page: false } };
  }
};

/**
 * Ambil anime yang akan datang (upcoming)
 */
export const getUpcomingAnime = async (limit = 10) => {
  try {
    const query = `
      query ($limit: Int) {
        Page(page: 1, perPage: $limit) {
          media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { limit });
    return {
      data: (data?.Page?.media || []).map(mapAniListToApp),
    };
  } catch (error) {
    console.error("getUpcomingAnime error:", error.message);
    return { data: [] };
  }
};

/**
 * Ambil rekomendasi anime
 */
export const getAnimeRecommendations = async () => {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 12) {
          media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    const data = await fetchGraphQL(query);
    return {
      data: (data?.Page?.media || []).map(mapAniListToApp),
    };
  } catch (error) {
    console.error("getAnimeRecommendations error:", error.message);
    return { data: [] };
  }
};

/**
 * Ambil daftar episode untuk satu anime
 */
export const getAnimeEpisodes = async (animeId) => {
  try {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          episodes
          streamingEpisodes {
            title
            thumbnail
            url
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { id: Number(animeId) });
    const media = data?.Media;
    const episodesList = media?.streamingEpisodes || [];

    if (episodesList.length > 0) {
      return {
        data: episodesList.map((ep, idx) => ({
          mal_id: idx + 1,
          title: ep.title || `Episode ${idx + 1}`,
          thumbnail: ep.thumbnail,
          url: ep.url,
        })),
      };
    }

    const totalEps = media?.episodes || 12;
    const generated = Array.from({ length: totalEps }, (_, i) => ({
      mal_id: i + 1,
      title: `Episode ${i + 1}`,
    }));

    return { data: generated };
  } catch (error) {
    console.error("getAnimeEpisodes error:", error.message);
    return {
      data: Array.from({ length: 12 }, (_, i) => ({
        mal_id: i + 1,
        title: `Episode ${i + 1}`,
      })),
    };
  }
};

// ================================
// CONSUMET / VIDEO STREAMING
// ================================
const consumetApi = axios.create({
  baseURL: CONSUMET_BASE_URL,
  timeout: 15000,
});

export const searchConsumet = async (query) => {
  try {
    const res = await consumetApi.get("/anime/gogoanime/" + encodeURIComponent(query));
    return res.data;
  } catch (err) {
    console.error("searchConsumet error:", err.message);
    return [];
  }
};

export const getConsumetInfo = async (animeId) => {
  try {
    const res = await consumetApi.get("/anime/gogoanime/info/" + animeId);
    return res.data;
  } catch (err) {
    console.error("getConsumetInfo error:", err.message);
    return null;
  }
};

export const getStreamingUrl = async (episodeId) => {
  try {
    const res = await consumetApi.get("/anime/gogoanime/watch/" + episodeId);
    return res.data;
  } catch (err) {
    console.error("getStreamingUrl error:", err.message);
    return null;
  }
};