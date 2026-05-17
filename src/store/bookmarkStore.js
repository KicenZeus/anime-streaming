import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import { backendApi } from "@/lib/axios";
import toast from "react-hot-toast";

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],

  initBookmarks: async () => {
    if (typeof window === "undefined") return;

    // Load dari localStorage dulu (cepat)
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (saved) {
      try {
        set({ bookmarks: JSON.parse(saved) });
      } catch {
        set({ bookmarks: [] });
      }
    }

    // Kalau user login, sync dari backend
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;

    try {
      const res = await backendApi.get("/bookmarks");
      const serverBookmarks = res.data.data.map((b) => ({
        mal_id: b.malId,
        title: b.title,
        image: b.image,
        score: b.score,
        year: b.year,
        status: b.status,
        addedAt: new Date(b.createdAt).getTime(),
      }));

      // Update localStorage dengan data dari server
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(serverBookmarks));
      set({ bookmarks: serverBookmarks });
    } catch {
      // Kalau gagal sync, pakai localStorage saja
    }
  },

  isBookmarked: (malId) => {
    return get().bookmarks.some((b) => b.mal_id === malId);
  },

  toggleBookmark: async (anime) => {
    const bookmarks = get().bookmarks;
    const exists = bookmarks.some((b) => b.mal_id === anime.mal_id);
    const token = typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : null;

    let updated;

    if (exists) {
      // Hapus dari local state dulu (optimistic update)
      updated = bookmarks.filter((b) => b.mal_id !== anime.mal_id);
      set({ bookmarks: updated });
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      toast.success("Removed from My List");

      // Sync ke backend kalau login
      if (token) {
        try {
          await backendApi.delete("/bookmarks/" + anime.mal_id);
        } catch {
          // Rollback kalau gagal
          set({ bookmarks });
          localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
          toast.error("Failed to sync. Try again.");
        }
      }
    } else {
      // Tambah ke local state dulu
      const newBookmark = {
        mal_id: anime.mal_id,
        title: anime.title_english || anime.title,
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        score: anime.score,
        year: anime.year,
        status: anime.status,
        addedAt: Date.now(),
      };
      updated = [newBookmark, ...bookmarks];
      set({ bookmarks: updated });
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      toast.success("Added to My List! 🔖");

      // Sync ke backend kalau login
      if (token) {
        try {
          await backendApi.post("/bookmarks", {
            malId: anime.mal_id,
            title: anime.title,
            titleEnglish: anime.title_english || null,
            image: newBookmark.image,
            score: anime.score,
            year: anime.year,
            status: anime.status,
            genres: anime.genres || [],
            episodes: anime.episodes || null,
          });
        } catch {
          // Rollback kalau gagal
          set({ bookmarks });
          localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
          toast.error("Failed to sync. Try again.");
        }
      }
    }
  },

  clearBookmarks: () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    set({ bookmarks: [] });
  },
}));

export default useBookmarkStore;