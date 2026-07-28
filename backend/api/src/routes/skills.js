// services/api/src/routes/skills.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/skills (public)
router.get("/", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
});

// POST /api/v1/skills (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon, category, proficiency, description } = req.body;

    const skill = await prisma.skill.create({
      data: {
        name,
        icon,
        category,
        proficiency: proficiency || 80,
        description,
        order: await prisma.skill.count(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
});

// PUT /api/v1/skills/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, category, proficiency, description } = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: name || undefined,
        icon: icon || undefined,
        category: category || undefined,
        proficiency: proficiency || undefined,
        description: description || undefined,
      },
    });

    res.json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
});

// DELETE /api/v1/skills/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.skill.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
});

export default router;
