import { backendApi } from "@/lib/axios";

// ================================
// AUTH SERVICE
// Semua API call yang berhubungan dengan auth
// ================================

/**
 * Register user baru
 * POST /api/auth/register
 */
export const registerUser = async ({ username, email, password }) => {
  const response = await backendApi.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = async ({ email, password }) => {
  const response = await backendApi.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

/**
 * Get profil user yang sedang login
 * GET /api/auth/me
 * Butuh token (otomatis ditambah oleh axios interceptor)
 */
export const getMyProfile = async () => {
  const response = await backendApi.get("/auth/me");
  return response.data;
};

/**
 * Logout (kalau backend punya endpoint logout)
 * POST /api/auth/logout
 */
export const logoutUser = async () => {
  try {
    await backendApi.post("/auth/logout");
  } catch {
    // Kalau endpoint tidak ada, tidak apa-apa
    // Logout tetap dilakukan di frontend (hapus localStorage)
  }
};