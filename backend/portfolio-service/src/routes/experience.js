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
      const items = trimmed.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      return JSON.stringify(items);
    }
  }
  return null;
}

function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

// GET /api/v1/experience (public - enabled only)
router.get("/", async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, company: true, position: true, description: true,
        logo: true, startDate: true, endDate: true, isCurrent: true,
        employmentType: true, location: true, companyUrl: true,
        technologies: true, responsibilities: true, achievements: true,
        galleryImages: true, order: true, enabled: true,
      },
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
});

// GET /api/v1/experience/admin or /api/v1/experience/all (admin - all)
const fetchAllExperience = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
};

router.get("/admin", authenticateToken, requireAdmin, fetchAllExperience);
router.get("/all", authenticateToken, requireAdmin, fetchAllExperience);

// POST /api/v1/experience (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      company, position, description, logo, startDate, endDate,
      isCurrent, employmentType, location, companyUrl,
      technologies, responsibilities, achievements, galleryImages,
      order, enabled,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({ success: false, message: "Company and position are required" });
    }

    const validStartDate = parseDate(startDate) || new Date();
    const isCurrentlyWorking = Boolean(isCurrent);
    const validEndDate = isCurrentlyWorking ? null : parseDate(endDate);

    const experience = await prisma.experience.create({
      data: {
        company: company.trim(),
        position: position.trim(),
        description: description || "",
        logo: logo || null,
        startDate: validStartDate,
        endDate: validEndDate,
        isCurrent: isCurrentlyWorking,
        employmentType: employmentType || null,
        location: location || null,
        companyUrl: companyUrl || null,
        technologies: formatJsonArray(technologies),
        responsibilities: formatJsonArray(responsibilities),
        achievements: formatJsonArray(achievements),
        galleryImages: formatJsonArray(galleryImages),
        order: Number.isInteger(Number(order)) ? parseInt(order, 10) : 0,
        enabled: enabled !== false,
      },
    });

    invalidatePortfolioCache();
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    console.error("Create experience error:", error);
    res.status(500).json({ success: false, message: "Failed to create experience" });
  }
});

// PUT /api/v1/experience/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    const data = req.body;
    const updateData = {};

    const stringFields = ["company", "position", "description", "logo", "employmentType", "location", "companyUrl"];
    for (const f of stringFields) {
      if (data[f] !== undefined) {
        updateData[f] = data[f] === "" ? null : data[f];
      }
    }

    if (data.isCurrent !== undefined) {
      updateData.isCurrent = Boolean(data.isCurrent);
    }

    if (data.startDate !== undefined) {
      updateData.startDate = parseDate(data.startDate) || existing.startDate;
    }

    if (data.endDate !== undefined || data.isCurrent !== undefined) {
      const isCurr = data.isCurrent !== undefined ? Boolean(data.isCurrent) : existing.isCurrent;
      if (isCurr) {
        updateData.endDate = null;
      } else if (data.endDate !== undefined) {
        updateData.endDate = parseDate(data.endDate);
      }
    }

    const jsonFields = ["technologies", "responsibilities", "achievements", "galleryImages"];
    for (const f of jsonFields) {
      if (data[f] !== undefined) {
        updateData[f] = formatJsonArray(data[f]);
      }
    }

    if (data.order !== undefined) {
      updateData.order = Number.isInteger(Number(data.order)) ? parseInt(data.order, 10) : existing.order;
    }
    if (data.enabled !== undefined) {
      updateData.enabled = Boolean(data.enabled);
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: updateData,
    });

    invalidatePortfolioCache();
    res.json({ success: true, data: experience });
  } catch (error) {
    console.error("Update experience error:", error);
    res.status(500).json({ success: false, message: "Failed to update experience" });
  }
});

// DELETE /api/v1/experience/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    invalidatePortfolioCache();
    res.json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({ success: false, message: "Failed to delete experience" });
  }
});

// PUT /api/v1/experience/reorder/batch (admin)
router.put("/reorder/batch", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { items, orderedIds } = req.body;
    if (Array.isArray(orderedIds)) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.experience.update({ where: { id }, data: { order: index } })
        )
      );
    } else if (Array.isArray(items)) {
      await prisma.$transaction(
        items.map((item, index) =>
          prisma.experience.update({
            where: { id: item.id },
            data: { order: item.order !== undefined ? item.order : index },
          })
        )
      );
    } else {
      return res.status(400).json({ success: false, message: "Items or orderedIds array is required" });
    }
    invalidatePortfolioCache();
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

export default router;