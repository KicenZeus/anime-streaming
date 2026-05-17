import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import toast from "react-hot-toast";

// ================================
// BOOKMARK STORE — Zustand
// Nyimpan bookmark di localStorage
// Nanti bisa diganti API call ke backend
// ================================

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],

  // Load dari localStorage
  initBookmarks: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (saved) {
      try {
        set({ bookmarks: JSON.parse(saved) });
      } catch {
        set({ bookmarks: [] });
      }
    }
  },

  // Cek apakah anime sudah di-bookmark
  isBookmarked: (malId) => {
    return get().bookmarks.some((b) => b.mal_id === malId);
  },

  // Toggle bookmark — kalau ada hapus, kalau belum ada tambah
  toggleBookmark: (anime) => {
    const bookmarks = get().bookmarks;
    const exists = bookmarks.some((b) => b.mal_id === anime.mal_id);

    let updated;
    if (exists) {
      updated = bookmarks.filter((b) => b.mal_id !== anime.mal_id);
      toast.success("Removed from My List");
    } else {
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
      toast.success("Added to My List! 🔖");
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    set({ bookmarks: updated });
  },

  // Hapus semua
  clearBookmarks: () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    set({ bookmarks: [] });
  },
}));

export default useBookmarkStore;