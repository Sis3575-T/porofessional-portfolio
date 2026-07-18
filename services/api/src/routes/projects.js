// services/api/src/routes/projects.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/projects (public)
router.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "9", category, featured } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { enabled: true };
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      orderBy: { order: "asc" },
    });

    const total = await prisma.project.count({ where });

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

// GET /api/v1/projects/:slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project || !project.enabled) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Increment view count
    await prisma.project.update({
      where: { slug },
      data: { viewCount: project.viewCount + 1 },
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
});

// POST /api/v1/projects (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail,
      images,
      category,
      technologies,
      features,
      challenge,
      solution,
      lessonsLearned,
      liveUrl,
      githubUrl,
      featured,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        images: typeof images === "string" ? images : JSON.stringify(images),
        category,
        technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies),
        features: typeof features === "string" ? features : JSON.stringify(features),
        challenge,
        solution,
        lessonsLearned,
        liveUrl,
        githubUrl,
        featured: featured || false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
});

// PUT /api/v1/projects/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      thumbnail,
      images,
      category,
      technologies,
      features,
      challenge,
      solution,
      lessonsLearned,
      liveUrl,
      githubUrl,
      featured,
    } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title || undefined,
        slug: slug || undefined,
        description: description || undefined,
        thumbnail: thumbnail || undefined,
        images: images ? (typeof images === "string" ? images : JSON.stringify(images)) : undefined,
        category: category || undefined,
        technologies: technologies ? (typeof technologies === "string" ? technologies : JSON.stringify(technologies)) : undefined,
        features: features ? (typeof features === "string" ? features : JSON.stringify(features)) : undefined,
        challenge: challenge || undefined,
        solution: solution || undefined,
        lessonsLearned: lessonsLearned || undefined,
        liveUrl: liveUrl || undefined,
        githubUrl: githubUrl || undefined,
        featured: featured !== undefined ? featured : undefined,
      },
    });

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
});

// DELETE /api/v1/projects/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
});

export default router;
