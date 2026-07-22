import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/services (public - enabled only)
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
});

// GET /api/v1/services/all (admin - all)
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
});

// POST /api/v1/services (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const service = await prisma.service.create({
      data: {
        slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, "-"),
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description || "",
        fullDescription: data.fullDescription,
        icon: data.icon,
        iconUrl: data.iconUrl,
        heroImage: data.heroImage,
        galleryImages: data.galleryImages ? (typeof data.galleryImages === "string" ? data.galleryImages : JSON.stringify(data.galleryImages)) : undefined,
        technologies: data.technologies ? (typeof data.technologies === "string" ? data.technologies : JSON.stringify(data.technologies)) : undefined,
        features: data.features ? (typeof data.features === "string" ? data.features : JSON.stringify(data.features)) : undefined,
        tools: data.tools ? (typeof data.tools === "string" ? data.tools : JSON.stringify(data.tools)) : undefined,
        process: data.process,
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
        docsUrl: data.docsUrl,
        caseStudyUrl: data.caseStudyUrl,
        buttonText: data.buttonText,
        buttonColor: data.buttonColor,
        accentColor: data.accentColor,
        enabled: data.enabled !== false,
        order: data.order ?? 0,
      },
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ success: false, message: "Failed to create service" });
  }
});

// PUT /api/v1/services/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateData = {};
    const fields = [
      "slug", "title", "shortDescription", "description", "fullDescription",
      "icon", "iconUrl", "heroImage", "process", "liveUrl", "githubUrl",
      "docsUrl", "caseStudyUrl", "buttonText", "buttonColor", "accentColor",
      "enabled", "order",
    ];

    for (const field of fields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    const jsonFields = ["galleryImages", "technologies", "features", "tools"];
    for (const field of jsonFields) {
      if (data[field] !== undefined) {
        updateData[field] = typeof data[field] === "string" ? data[field] : JSON.stringify(data[field]);
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });
    res.json({ success: true, data: service });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
});

// DELETE /api/v1/services/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
});

// PUT /api/v1/services/reorder/batch (admin)
router.put("/reorder/batch", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds must be an array" });
    }
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.service.update({ where: { id }, data: { order: index } })
      )
    );
    res.json({ success: true, message: "Services reordered" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reorder" });
  }
});

export default router;
