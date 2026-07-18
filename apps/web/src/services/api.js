import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;

export const heroAPI = {
  get: () => api.get("/hero"),
  update: (data) => api.put("/hero", data),
};

export const aboutAPI = {
  get: () => api.get("/about"),
  update: (data) => api.put("/about", data),
};

export const skillsAPI = {
  getAll: (params) => api.get("/skills", { params }),
  create: (data) => api.post("/skills", data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get("/services"),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const experienceAPI = {
  getAll: () => api.get("/experience"),
  create: (data) => api.post("/experience", data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const educationAPI = {
  getAll: () => api.get("/education"),
  create: (data) => api.post("/education", data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

export const projectsAPI = {
  getAll: (params) => api.get("/projects", { params }),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const testimonialsAPI = {
  getAll: () => api.get("/testimonials"),
  create: (data) => api.post("/testimonials", data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const contactAPI = {
  send: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  getById: (id) => api.get(`/contact/${id}`),
  update: (id, data) => api.put(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const settingsAPI = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};

export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
