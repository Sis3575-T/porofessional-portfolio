import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:10000").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method)) {
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const ch = new BroadcastChannel("portfolio_updates");
          ch.postMessage({ type: "MUTATION_COMPLETE", timestamp: Date.now() });
          ch.close();
        }
        localStorage.setItem("portfolio_sync_trigger", String(Date.now()));
      } catch {}
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const portfolioAPI = {
  get: (config) => api.get("/portfolio", config),
};

export default api;
