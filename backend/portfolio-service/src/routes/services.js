import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

function formatJsonArray(val) {
  if (val === undefined || val === null || val === "") return null;
  if (Array.isArray(val)) return JSON.stringify(val);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
      return JSON.stringify([parsed]);
    } catch {
      const items = trimmed.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      return JSON.stringify(items);
    }
  }
  return null;
}

// GET /api/v1/services (public - enabled only)
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, slug: true, title: true, shortDescription: true,
        description: true, fullDescription: true, icon: true, iconUrl: true, heroImage: true,
        technologies: true, features: true, tools: true, process: true,
        liveUrl: true, githubUrl: true, docsUrl: true, caseStudyUrl: true,
        buttonText: true, buttonColor: true, accentColor: true,
        order: true, enabled: true,
      },
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
    if (!data.title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let baseSlug = (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!baseSlug) baseSlug = `service-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.service.findFirst({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const service = await prisma.service.create({
      data: {
        slug: uniqueSlug,
        title: data.title.trim(),
        shortDescription: data.shortDescription || null,
        description: data.description || "",
        fullDescription: data.fullDescription || null,
        icon: data.icon || null,
        iconUrl: data.iconUrl || null,
        heroImage: data.heroImage || null,
        galleryImages: formatJsonArray(data.galleryImages),
        technologies: formatJsonArray(data.technologies),
        features: formatJsonArray(data.features),
        tools: formatJsonArray(data.tools),
        process: data.process || null,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        docsUrl: data.docsUrl || null,
        caseStudyUrl: data.caseStudyUrl || null,
        buttonText: data.buttonText || "Live Demo",
        buttonColor: data.buttonColor || "#111111",
        accentColor: data.accentColor || "#111111",
        enabled: data.enabled !== false,
        order: Number.isInteger(Number(data.order)) ? parseInt(data.order, 10) : 0,
      },
    });

    invalidatePortfolioCache();
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

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const updateData = {};
    const stringFields = [
      "title", "shortDescription", "description", "fullDescription",
      "icon", "iconUrl", "heroImage", "process", "liveUrl", "githubUrl",
      "docsUrl", "caseStudyUrl", "buttonText", "buttonColor", "accentColor",
    ];

    for (const field of stringFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field] === "" ? null : data[field];
      }
    }

    if (data.title && !data.description && existing.description) {
      // preserve description if not provided
    }

    if (data.slug !== undefined) {
      let slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (slug && slug !== existing.slug) {
        let uniqueSlug = slug;
        let counter = 1;
        while (await prisma.service.findFirst({ where: { slug: uniqueSlug, NOT: { id } } })) {
          uniqueSlug = `${slug}-${counter++}`;
        }
        updateData.slug = uniqueSlug;
      }
    }

    const jsonFields = ["galleryImages", "technologies", "features", "tools"];
    for (const field of jsonFields) {
      if (data[field] !== undefined) {
        updateData[field] = formatJsonArray(data[field]);
      }
    }

    if (data.enabled !== undefined) updateData.enabled = Boolean(data.enabled);
    if (data.order !== undefined) {
      updateData.order = Number.isInteger(Number(data.order)) ? parseInt(data.order, 10) : existing.order;
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    invalidatePortfolioCache();
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
    invalidatePortfolioCache();
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
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
    invalidatePortfolioCache();
    res.json({ success: true, message: "Services reordered" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reorder" });
  }
});

export default router;