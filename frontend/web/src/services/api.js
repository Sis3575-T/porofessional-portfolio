// Re-export everything from the shared package
// This file exists for backward compatibility - new code should import from "frontend-shared/api"
export { API_URL, default as default } from "frontend-shared/api";
export { default as api } from "frontend-shared/api";

// Re-export all API modules
import api from "frontend-shared/api";

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

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
  getReply: (token) => api.get(`/contact/reply/${token}`),
};

export const settingsAPI = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};

export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

export const analyticsAPI = {
  track: (data) => api.post("/analytics/track", data),
  endSession: (data) => api.post("/analytics/session/end", data),
};
