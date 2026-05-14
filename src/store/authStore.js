import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";

// ================================
// AUTH STORE — Zustand
// Nyimpan state login user secara global
// Bisa diakses dari komponen manapun
// ================================

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,

  // Inisialisasi dari localStorage saat app pertama kali load
  // Dipanggil di layout.jsx
  initAuth: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userRaw = localStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        set({ user, token, isLoggedIn: true });
      } catch {
        // Kalau data corrupt, hapus semua
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    }
  },

  // Login — simpan token dan user ke state + localStorage
  login: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    set({ user, token, isLoggedIn: true });
  },

  // Logout — hapus semua data
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    set({ user: null, token: null, isLoggedIn: false });
  },

  // Update user data (misal setelah edit profile)
  updateUser: (updatedUser) => {
    const merged = { ...get().user, ...updatedUser };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
    set({ user: merged });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;