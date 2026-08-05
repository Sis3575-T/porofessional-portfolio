// Admin API - uses admin-specific endpoints that return ALL records (including disabled)
export { API_URL, default as default } from "frontend-shared/api";
export { default as api } from "frontend-shared/api";

import api from "frontend-shared/api";

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const heroAPI = {
  get: () => api.get("/hero/admin"),
  update: (data) => api.put("/hero", data),
};

export const aboutAPI = {
  get: () => api.get("/about/admin"),
  update: (data) => api.put("/about", data),
};

export const skillsAPI = {
  getAll: () => api.get("/skills/admin"),
  create: (data) => api.post("/skills", data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  reorder: (orderedIds) => api.put("/skills/reorder/batch", { orderedIds }),
};

export const servicesAPI = {
  getAll: () => api.get("/services/all"),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  reorder: (orderedIds) => api.put("/services/reorder/batch", { orderedIds }),
};

export const experienceAPI = {
  getAll: () => api.get("/experience/admin"),
  create: (data) => api.post("/experience", data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const educationAPI = {
  getAll: () => api.get("/education/all"),
  create: (data) => api.post("/education", data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

export const projectsAPI = {
  getAll: (params) => api.get("/projects/admin", { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const testimonialsAPI = {
  getAll: () => api.get("/testimonials/admin"),
  create: (data) => api.post("/testimonials", data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const messagesAPI = {
  getAll: (params) => api.get("/contact", { params }),
  getById: (id) => api.get(`/contact/${id}`),
  reply: (id, reply) => api.post(`/contact/${id}/reply`, { reply }),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  archive: (id) => api.patch(`/contact/${id}/archive`),
  delete: (id) => api.delete(`/contact/${id}`),
  unreadCount: () => api.get("/contact/unread-count/admin"),
};

export const settingsAPI = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};

export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

export const avatarAPI = {
  get: () => api.get("/avatar"),
  generate: (formData) => api.post("/avatar/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  save: (data) => api.post("/avatar", data),
  delete: () => api.delete("/avatar"),
};

export const generateAvatarFromPhoto = avatarAPI.generate;
export const saveAvatar = avatarAPI.save;
export const deleteAvatar = avatarAPI.delete;

export const mediaAPI = {
  getAll: () => api.get("/media"),
  delete: (filename) => api.delete(`/media/${filename}`),
};

export const analyticsAPI = {
  getStats: () => api.get("/analytics/stats"),
  getVisitors: (params) => api.get("/analytics/visitors", { params }),
  getVisitor: (visitorId) => api.get(`/analytics/visitors/${visitorId}`),
  deleteVisitor: (visitorId) => api.delete(`/analytics/visitors/${visitorId}`),
  deleteAll: (confirm) => api.delete("/analytics/all", { data: { confirm } }),
};
