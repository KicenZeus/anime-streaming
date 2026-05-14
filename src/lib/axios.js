import axios from "axios";
import { JIKAN_BASE_URL, BACKEND_BASE_URL } from "./constants";

export const jikanApi = axios.create({
  baseURL: JIKAN_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Auto retry kalau kena 429
jikanApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Kalau 429 dan belum pernah retry
    if (error.response?.status === 429 && !config._retryCount) {
      config._retryCount = 1;
      // Tunggu 1.5 detik lalu retry
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return jikanApi(config);
    }

    return Promise.reject(error);
  }
);

export const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

backendApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("animex_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("animex_token");
        localStorage.removeItem("animex_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);