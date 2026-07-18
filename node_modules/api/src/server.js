import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import heroRoutes from "./routes/hero.js";
import aboutRoutes from "./routes/about.js";
import skillsRoutes from "./routes/skills.js";
import servicesRoutes from "./routes/services.js";
import experienceRoutes from "./routes/experience.js";
import educationRoutes from "./routes/education.js";
import projectsRoutes from "./routes/projects.js";
import testimonialsRoutes from "./routes/testimonials.js";
import contactRoutes from "./routes/contact.js";
import settingsRoutes from "./routes/settings.js";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";

import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
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
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
