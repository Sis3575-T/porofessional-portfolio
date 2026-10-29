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

// GET /api/v1/education (public - enabled only)
router.get("/", async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, institution: true, degree: true, field: true,
        description: true, logo: true, startDate: true, endDate: true,
        isCurrent: true, gpa: true, location: true, achievements: true,
        technologies: true, courses: true, certificateUrl: true,
        order: true, enabled: true,
      },
    });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch education" });
  }
});

// GET /api/v1/education/all (admin - all)
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch education" });
  }
});

// POST /api/v1/education (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      institution, degree, field, description, logo,
      startDate, endDate, isCurrent, gpa, location,
      achievements, technologies, courses, certificateUrl,
      order, enabled,
    } = req.body;

    if (!institution || !degree) {
      return res.status(400).json({ success: false, message: "Institution and degree are required" });
    }

    const isCurrentlyStudying = Boolean(isCurrent);
    const validStartDate = parseDate(startDate) || new Date();
    const validEndDate = isCurrentlyStudying ? null : parseDate(endDate);

    const edu = await prisma.education.create({
      data: {
        institution: institution.trim(),
        degree: degree.trim(),
        field: field || "",
        description: description || "",
        logo: logo || null,
        startDate: validStartDate,
        endDate: validEndDate,
        isCurrent: isCurrentlyStudying,
        gpa: gpa || null,
        location: location || null,
        achievements: formatJsonArray(achievements),
        technologies: formatJsonArray(technologies),
        courses: formatJsonArray(courses),
        certificateUrl: certificateUrl || null,
        order: Number.isInteger(Number(order)) ? parseInt(order, 10) : 0,
        enabled: enabled !== undefined ? Boolean(enabled) : true,
      },
    });

    invalidatePortfolioCache();
    res.status(201).json({ success: true, data: edu });
  } catch (error) {
    console.error("Create education error:", error);
    res.status(500).json({ success: false, message: "Failed to create education" });
  }
});

// PUT /api/v1/education/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Education entry not found" });
    }

    const data = req.body;
    const updateData = {};

    const stringFields = ["institution", "degree", "field", "description", "logo", "gpa", "location", "certificateUrl"];
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

    const jsonFields = ["achievements", "technologies", "courses"];
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

    const edu = await prisma.education.update({
      where: { id },
      data: updateData,
    });

    invalidatePortfolioCache();
    res.json({ success: true, data: edu });
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({ success: false, message: "Failed to update education" });
  }
});

// DELETE /api/v1/education/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    invalidatePortfolioCache();
    res.json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({ success: false, message: "Failed to delete education" });
  }
});

// PUT /api/v1/education/reorder/batch (admin)
router.put("/reorder/batch", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { items, orderedIds } = req.body;
    if (Array.isArray(orderedIds)) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.education.update({ where: { id }, data: { order: index } })
        )
      );
    } else if (Array.isArray(items)) {
      await prisma.$transaction(
        items.map((item, index) =>
          prisma.education.update({
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