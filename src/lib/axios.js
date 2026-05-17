import axios from "axios";
import { JIKAN_BASE_URL, BACKEND_BASE_URL } from "./constants";

// Request queue buat rate limiting
let requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const { resolve } = requestQueue.shift();
    resolve();
    // Delay 400ms antar request ke Jikan
    await new Promise((r) => setTimeout(r, 400));
  }

  isProcessing = false;
};

const waitForQueue = () => {
  return new Promise((resolve) => {
    requestQueue.push({ resolve });
    processQueue();
  });
};

export const jikanApi = axios.create({
  baseURL: JIKAN_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Tambah ini sementara untuk debug
console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

// Rate limit interceptor
jikanApi.interceptors.request.use(async (config) => {
  await waitForQueue();
  return config;
});

// Retry on 429
jikanApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (error.response?.status === 429 && !config._retryCount) {
      config._retryCount = 1;
      await new Promise((r) => setTimeout(r, 2000));
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