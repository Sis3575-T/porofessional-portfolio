import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { requestLogger, errorHandler, rateLimiter } from "shared";
import heroRoutes from "./routes/hero.js";
import aboutRoutes from "./routes/about.js";
import skillsRoutes from "./routes/skills.js";
import servicesRoutes from "./routes/services.js";
import experienceRoutes from "./routes/experience.js";
import educationRoutes from "./routes/education.js";
import projectsRoutes from "./routes/projects.js";
import testimonialsRoutes from "./routes/testimonials.js";
import settingsRoutes from "./routes/settings.js";
import contactRoutes from "./routes/contact.js";
import avatarRoutes from "./routes/avatar.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/hero", heroRoutes);
app.use("/api/v1/about", aboutRoutes);
app.use("/api/v1/skills", skillsRoutes);
app.use("/api/v1/services", servicesRoutes);
app.use("/api/v1/experience", experienceRoutes);
app.use("/api/v1/education", educationRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/testimonials", testimonialsRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/avatar", avatarRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "portfolio-service", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
