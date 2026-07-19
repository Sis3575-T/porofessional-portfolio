import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { featured, category } = req.query;
    const where = { enabled: true };
    if (featured) where.featured = featured === "true";
    if (category) where.category = category;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    await prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch project" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create project" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.update({ where: { id }, data: req.body });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
});

export default router;
