import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const pendingRequests = new Map();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method === "get") {
    const key = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
    if (pendingRequests.has(key)) {
      const controller = new AbortController();
      config.signal = controller.signal;
      config._dedupKey = key;
    }
    pendingRequests.set(key, Date.now());
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config._dedupKey) {
      pendingRequests.delete(response.config._dedupKey);
    }
    return response;
  },
  (error) => {
    if (error.config?._dedupKey) {
      pendingRequests.delete(error.config._dedupKey);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of pendingRequests) {
    if (now - timestamp > 30000) {
      pendingRequests.delete(key);
    }
  }
}, 60000);

export default api;
