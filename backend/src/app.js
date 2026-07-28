import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { requestLogger, errorHandler, rateLimiter, authenticateToken, requireAdmin, prisma } from "shared";

import authRoutes from "../auth-service/src/routes/auth.js";
import heroRoutes from "../portfolio-service/src/routes/hero.js";
import aboutRoutes from "../portfolio-service/src/routes/about.js";
import skillsRoutes from "../portfolio-service/src/routes/skills.js";
import servicesRoutes from "../portfolio-service/src/routes/services.js";
import experienceRoutes from "../portfolio-service/src/routes/experience.js";
import educationRoutes from "../portfolio-service/src/routes/education.js";
import projectsRoutes from "../portfolio-service/src/routes/projects.js";
import testimonialsRoutes from "../portfolio-service/src/routes/testimonials.js";
import settingsRoutes from "../portfolio-service/src/routes/settings.js";
import contactRoutes from "../portfolio-service/src/routes/contact.js";
import avatarRoutes from "../portfolio-service/src/routes/avatar.js";
import analyticsRoutes from "../portfolio-service/src/routes/analytics.js";
import uploadRoutes from "../media-service/src/routes/upload.js";
import mediaRoutes from "../media-service/src/routes/media.js";
import dashboardRoutes from "../dashboard-service/src/routes/dashboard.js";
import activitiesRoutes from "../dashboard-service/src/routes/activities.js";

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
  process.env.ADMIN_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) { cb(null, true); return; }
    if (allowedOrigins.some((o) => origin.startsWith(o.replace(/\/$/, "")))) {
      cb(null, true); return;
    }
    if (/^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      cb(null, true); return;
    }
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      cb(null, true); return;
    }
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter());



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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/v1/*",
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  let dbOk = false;
  let dbError = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = e.message;
  }

  res.json({
    status: "ok",
    service: "portfolio-backend",
    database: dbOk ? "connected" : "disconnected",
    dbError,
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "set" : "missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "set" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing",
    },
    timestamp: new Date().toISOString(),
  });
});

const LOCALHOST_RE = /^https?:\/\/localhost:\d+/;

app.post("/api/v1/admin/cleanup-urls", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const results = {};

    const hero = await prisma.hero.findMany();
    for (const h of hero) {
      const changes = {};
      if (h.profileImage && LOCALHOST_RE.test(h.profileImage)) { changes.profileImage = null; }
      if (h.backgroundImage && LOCALHOST_RE.test(h.backgroundImage)) { changes.backgroundImage = null; }
      if (Object.keys(changes).length) {
        await prisma.hero.update({ where: { id: h.id }, data: changes });
        results.hero = (results.hero || 0) + 1;
      }
    }

    const about = await prisma.about.findMany();
    for (const a of about) {
      if (a.profileImage && LOCALHOST_RE.test(a.profileImage)) {
        await prisma.about.update({ where: { id: a.id }, data: { profileImage: null } });
        results.about = (results.about || 0) + 1;
      }
    }

    const services = await prisma.service.findMany();
    for (const s of services) {
      const changes = {};
      if (s.icon && LOCALHOST_RE.test(s.icon)) { changes.icon = null; }
      if (s.iconUrl && LOCALHOST_RE.test(s.iconUrl)) { changes.iconUrl = null; }
      if (s.heroImage && LOCALHOST_RE.test(s.heroImage)) { changes.heroImage = null; }
      if (s.galleryImages && LOCALHOST_RE.test(s.galleryImages)) { changes.galleryImages = null; }
      if (Object.keys(changes).length) {
        await prisma.service.update({ where: { id: s.id }, data: changes });
        results.services = (results.services || 0) + 1;
      }
    }

    const experiences = await prisma.experience.findMany();
    for (const e of experiences) {
      const changes = {};
      if (e.logo && LOCALHOST_RE.test(e.logo)) { changes.logo = null; }
      if (e.galleryImages && LOCALHOST_RE.test(e.galleryImages)) { changes.galleryImages = null; }
      if (Object.keys(changes).length) {
        await prisma.experience.update({ where: { id: e.id }, data: changes });
        results.experiences = (results.experiences || 0) + 1;
      }
    }

    const education = await prisma.education.findMany();
    for (const ed of education) {
      if (ed.logo && LOCALHOST_RE.test(ed.logo)) {
        await prisma.education.update({ where: { id: ed.id }, data: { logo: null } });
        results.education = (results.education || 0) + 1;
      }
    }

    const projects = await prisma.project.findMany();
    for (const p of projects) {
      const changes = {};
      if (p.thumbnail && LOCALHOST_RE.test(p.thumbnail)) { changes.thumbnail = null; }
      if (p.images && LOCALHOST_RE.test(p.images)) { changes.images = null; }
      if (Object.keys(changes).length) {
        await prisma.project.update({ where: { id: p.id }, data: changes });
        results.projects = (results.projects || 0) + 1;
      }
    }

    const testimonials = await prisma.testimonial.findMany();
    for (const t of testimonials) {
      if (t.avatar && LOCALHOST_RE.test(t.avatar)) {
        await prisma.testimonial.update({ where: { id: t.id }, data: { avatar: null } });
        results.testimonials = (results.testimonials || 0) + 1;
      }
    }

    const settings = await prisma.setting.findMany();
    for (const s of settings) {
      const changes = {};
      if (s.favicon && LOCALHOST_RE.test(s.favicon)) { changes.favicon = null; }
      if (s.logo && LOCALHOST_RE.test(s.logo)) { changes.logo = null; }
      if (s.logo_dark && LOCALHOST_RE.test(s.logo_dark)) { changes.logo_dark = null; }
      if (s.ogImage && LOCALHOST_RE.test(s.ogImage)) { changes.ogImage = null; }
      if (Object.keys(changes).length) {
        await prisma.setting.update({ where: { id: s.id }, data: changes });
        results.settings = (results.settings || 0) + 1;
      }
    }

    const avatars = await prisma.avatar3D.findMany();
    for (const a of avatars) {
      const changes = {};
      if (a.photoUrl && LOCALHOST_RE.test(a.photoUrl)) { changes.photoUrl = null; }
      if (a.modelUrl && LOCALHOST_RE.test(a.modelUrl)) { changes.modelUrl = null; }
      if (Object.keys(changes).length) {
        await prisma.avatar3D.update({ where: { id: a.id }, data: changes });
        results.avatars = (results.avatars || 0) + 1;
      }
    }

    res.json({ success: true, message: "Localhost URLs cleaned up", cleaned: results });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ success: false, message: "Cleanup failed" });
  }
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
