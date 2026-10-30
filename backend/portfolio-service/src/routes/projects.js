import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

const VALID_CATEGORIES = ["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "UIUX", "AI", "OTHER"];

router.get("/", async (req, res) => {
  try {
    const { featured, category, limit } = req.query;
    const where = { enabled: true };
    if (featured) where.featured = featured === "true";
    if (category && category !== "ALL") where.category = category;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true, title: true, slug: true, description: true, shortDescription: true,
        thumbnail: true, images: true, category: true, technologies: true,
        features: true, liveUrl: true, githubUrl: true,
        featured: true, order: true, viewCount: true,
      },
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("Fetch projects error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects", error: error.message });
  }
});

router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("Fetch projects admin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true, title: true, slug: true, description: true, shortDescription: true,
        thumbnail: true, images: true, category: true, technologies: true,
        features: true, challenge: true, solution: true, lessonsLearned: true,
        liveUrl: true, githubUrl: true, featured: true, order: true,
      },
    });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});
    res.json({ success: true, data: project });
  } catch (error) {
    console.error("Fetch project by slug error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch project" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.title || !String(data.title).trim()) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }

    data.title = String(data.title).trim();

    // Ensure clean & unique slug
    let baseSlug = (data.slug || data.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!baseSlug) baseSlug = "project";
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    data.slug = slug;

    // Validate category enum
    if (!VALID_CATEGORIES.includes(data.category)) {
      data.category = "FULLSTACK";
    }

    // Truncate shortDescription to 200 chars for @db.VarChar(200)
    if (data.shortDescription) {
      data.shortDescription = String(data.shortDescription).slice(0, 200);
    }

    // Guarantee non-null text values required by schema
    data.description = data.description ? String(data.description) : "";
    data.challenge = data.challenge ? String(data.challenge) : "";
    data.solution = data.solution ? String(data.solution) : "";
    data.lessonsLearned = data.lessonsLearned ? String(data.lessonsLearned) : "";
    data.technologies = typeof data.technologies === "string" ? data.technologies : JSON.stringify(data.technologies || []);
    data.features = typeof data.features === "string" ? data.features : JSON.stringify(data.features || []);
    data.order = parseInt(data.order) || 0;
    data.featured = Boolean(data.featured);
    data.enabled = data.enabled !== false;
    data.thumbnail = data.thumbnail ? String(data.thumbnail).trim() : null;
    data.liveUrl = data.liveUrl ? String(data.liveUrl).trim() : null;
    data.githubUrl = data.githubUrl ? String(data.githubUrl).trim() : null;

    const project = await prisma.project.create({ data });
    invalidatePortfolioCache();

    res.status(201).json({ success: true, message: "Project created successfully", data: project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create project" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.title !== undefined) data.title = String(data.title).trim();
    if (data.category !== undefined && !VALID_CATEGORIES.includes(data.category)) {
      data.category = "FULLSTACK";
    }
    if (data.shortDescription) {
      data.shortDescription = String(data.shortDescription).slice(0, 200);
    }
    if (data.technologies !== undefined && typeof data.technologies !== "string") {
      data.technologies = JSON.stringify(data.technologies || []);
    }
    if (data.features !== undefined && typeof data.features !== "string") {
      data.features = JSON.stringify(data.features || []);
    }
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    if (data.featured !== undefined) data.featured = Boolean(data.featured);
    if (data.enabled !== undefined) data.enabled = Boolean(data.enabled);
    if (data.thumbnail !== undefined) data.thumbnail = data.thumbnail ? String(data.thumbnail).trim() : null;
    if (data.liveUrl !== undefined) data.liveUrl = data.liveUrl ? String(data.liveUrl).trim() : null;
    if (data.githubUrl !== undefined) data.githubUrl = data.githubUrl ? String(data.githubUrl).trim() : null;

    const project = await prisma.project.update({ where: { id }, data });
    invalidatePortfolioCache();

    res.json({ success: true, message: "Project updated successfully", data: project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update project" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    invalidatePortfolioCache();

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete project" });
  }
});

export default router;
