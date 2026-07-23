import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { requestLogger, errorHandler, rateLimiter } from "shared";

import authRoutes from "../../auth-service/src/routes/auth.js";
import heroRoutes from "../../portfolio-service/src/routes/hero.js";
import aboutRoutes from "../../portfolio-service/src/routes/about.js";
import skillsRoutes from "../../portfolio-service/src/routes/skills.js";
import servicesRoutes from "../../portfolio-service/src/routes/services.js";
import experienceRoutes from "../../portfolio-service/src/routes/experience.js";
import educationRoutes from "../../portfolio-service/src/routes/education.js";
import projectsRoutes from "../../portfolio-service/src/routes/projects.js";
import testimonialsRoutes from "../../portfolio-service/src/routes/testimonials.js";
import settingsRoutes from "../../portfolio-service/src/routes/settings.js";
import contactRoutes from "../../portfolio-service/src/routes/contact.js";
import avatarRoutes from "../../portfolio-service/src/routes/avatar.js";
import analyticsRoutes from "../../portfolio-service/src/routes/analytics.js";
import uploadRoutes from "../../media-service/src/routes/upload.js";
import mediaRoutes from "../../media-service/src/routes/media.js";
import dashboardRoutes from "../../dashboard-service/src/routes/dashboard.js";
import activitiesRoutes from "../../dashboard-service/src/routes/activities.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const allowedOrigins = [
  "http://localhost:5175",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) { cb(null, true); return; }
    if (allowedOrigins.some((o) => origin.startsWith(o.replace(/\/$/, "")))) {
      cb(null, true); return;
    }
    if (/^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      cb(null, true); return;
    }
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/auth", authRoutes);
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
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/activities", activitiesRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "portfolio-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
