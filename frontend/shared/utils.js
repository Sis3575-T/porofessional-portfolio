import { API_URL } from "./api.js";

const LOCALHOST_PATTERN = /^https?:\/\/localhost:\d+/;

export function resolveUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (LOCALHOST_PATTERN.test(url)) {
      const path = url.replace(/^https?:\/\/localhost:\d+/, "");
      return `${API_URL}${path}`;
    }
    return url;
  }
  return `${API_URL}${url}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseJSON(str, fallback) {
  try {
    return typeof str === "string" ? JSON.parse(str) : str || fallback;
  } catch {
    return fallback;
  }
}
