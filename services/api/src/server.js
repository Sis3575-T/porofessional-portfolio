// services/api/src/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ API running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});
