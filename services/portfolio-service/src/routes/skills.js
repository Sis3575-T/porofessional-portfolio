import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon, category, proficiency, description, order, enabled } = req.body;
    const skill = await prisma.skill.create({
      data: { name, icon, category, proficiency, description, order, enabled },
    });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create skill" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, category, proficiency, description, order, enabled } = req.body;
    const skill = await prisma.skill.update({
      where: { id },
      data: { name, icon, category, proficiency, description, order, enabled },
    });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update skill" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete skill" });
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
    res.json({ success: true, message: "Skills reordered" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reorder skills" });
  }
});

export default router;
