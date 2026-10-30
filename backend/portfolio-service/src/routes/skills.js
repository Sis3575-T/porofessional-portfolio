import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

const VALID_CATEGORIES = [
  "FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "TOOLS",
  "LANGUAGES", "SOFT_SKILLS", "OTHER",
];

router.get("/", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, icon: true, category: true,
        proficiency: true, description: true, order: true,
      },
    });
    res.json({ success: true, data: skills });
  } catch (error) {
    console.error("Fetch skills error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
});

const fetchAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: skills });
  } catch (error) {
    console.error("Fetch skills admin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
};

router.get("/admin", authenticateToken, requireAdmin, fetchAllSkills);
router.get("/all", authenticateToken, requireAdmin, fetchAllSkills);

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon, category, proficiency, description, order, enabled } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const validatedCategory = VALID_CATEGORIES.includes(category) ? category : "OTHER";

    const skill = await prisma.skill.create({
      data: {
        name: String(name).trim(),
        icon: icon ? String(icon).trim() : null,
        category: validatedCategory,
        proficiency: proficiency !== undefined ? Math.min(100, Math.max(0, parseInt(proficiency) || 80)) : 80,
        description: description ? String(description).trim() : null,
        order: order !== undefined ? parseInt(order) || 0 : 0,
        enabled: enabled !== false,
      },
    });

    invalidatePortfolioCache();

    res.status(201).json({ success: true, message: "Skill created successfully", data: skill });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create skill" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, category, proficiency, description, order, enabled } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (icon !== undefined) updateData.icon = icon ? String(icon).trim() : null;
    if (category !== undefined) {
      updateData.category = VALID_CATEGORIES.includes(category) ? category : "OTHER";
    }
    if (proficiency !== undefined) {
      updateData.proficiency = Math.min(100, Math.max(0, parseInt(proficiency) || 0));
    }
    if (description !== undefined) updateData.description = description ? String(description).trim() : null;
    if (order !== undefined) updateData.order = parseInt(order) || 0;
    if (enabled !== undefined) updateData.enabled = Boolean(enabled);

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    invalidatePortfolioCache();

    res.json({ success: true, message: "Skill updated successfully", data: skill });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update skill" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    invalidatePortfolioCache();

    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete skill" });
  }
});

router.put("/reorder/batch", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds must be an array" });
    }
    const updates = orderedIds.map((id, index) =>
      prisma.skill.update({ where: { id }, data: { order: index } })
    );
    await prisma.$transaction(updates);
    invalidatePortfolioCache();

    res.json({ success: true, message: "Skills reordered" });
  } catch (error) {
    console.error("Reorder skills error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to reorder skills" });
  }
});

export default router;
