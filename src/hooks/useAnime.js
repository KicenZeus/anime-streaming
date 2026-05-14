"use client";

import { useState, useEffect } from "react";
import {
  getTopAnime,
  getCurrentSeasonAnime,
  searchAnime,
} from "@/services/animeService";

// ================================
// useTopAnime
// Hook untuk ambil top anime
// Usage: const { data, loading, error } = useTopAnime()
// ================================
export function useTopAnime(limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTopAnime(1, limit);
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        // finally selalu jalan, baik sukses atau error
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

// ================================
// useCurrentSeason
// Hook untuk ambil anime musim ini
// ================================
export function useCurrentSeason(limit = 12) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getCurrentSeasonAnime(1, limit);
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

// ================================
// useSearchAnime
// Hook untuk search anime
// ================================
export function useSearchAnime(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kalau query kosong, skip fetch
    if (!query || query.trim().length < 2) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await searchAnime(query);
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: tunggu 500ms setelah user berhenti ngetik
    // baru fetch — biar ga spam API setiap ketik 1 huruf
    const timer = setTimeout(fetchData, 500);

    // Cleanup timer kalau query berubah sebelum 500ms
    return () => clearTimeout(timer);
  }, [query]);

  return { data, loading, error };
}