// ================================
// SANITIZE HELPER
// Bersihkan input user sebelum dipakai
// Protect dari XSS attack
// ================================

/**
 * Strip semua HTML tags dari string
 * Contoh: "<script>alert(1)</script>" → "alert(1)"
 */
export const stripHtml = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
};

/**
 * Sanitize search query
 * Hapus karakter berbahaya, batasi panjang
 */
export const sanitizeQuery = (query) => {
  if (!str || typeof query !== "string") return "";
  return query
    .replace(/[<>'"`;{}]/g, "") // hapus karakter berbahaya
    .trim()
    .slice(0, 100); // max 100 karakter
};

/**
 * Sanitize username
 * Hanya boleh huruf, angka, underscore, dash
 */
export const sanitizeUsername = (username) => {
  if (!username || typeof username !== "string") return "";
  return username
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .trim()
    .slice(0, 30);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    errors: [],
  };

  if (!password) {
    result.errors.push("Password is required");
    return result;
  }
  if (password.length < 6) {
    result.errors.push("Min. 6 characters");
  }
  if (password.length > 128) {
    result.errors.push("Max. 128 characters");
  }

  result.isValid = result.errors.length === 0;
  return result;
};

/**
 * Prevent prototype pollution
 * Cek apakah key adalah reserved key
 */
export const isSafeKey = (key) => {
  const dangerousKeys = ["__proto__", "constructor", "prototype"];
  return !dangerousKeys.includes(key);
};