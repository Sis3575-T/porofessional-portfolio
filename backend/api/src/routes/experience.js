// services/api/src/routes/experience.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/experience (public)
router.get("/", async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { enabled: true },
      orderBy: { startDate: "desc" },
    });

    res.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
});

// POST /api/v1/experience (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      company,
      position,
      description,
      logo,
      startDate,
      endDate,
      isCurrent,
      technologies,
    } = req.body;

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        logo,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies),
      },
    });

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create experience",
    });
  }
});

// PUT /api/v1/experience/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      description,
      logo,
      startDate,
      endDate,
      isCurrent,
      technologies,
    } = req.body;

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company: company || undefined,
        position: position || undefined,
        description: description || undefined,
        logo: logo || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isCurrent: isCurrent !== undefined ? isCurrent : undefined,
        technologies: technologies ? (typeof technologies === "string" ? technologies : JSON.stringify(technologies)) : undefined,
      },
    });

    res.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update experience",
    });
  }
});

// DELETE /api/v1/experience/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.experience.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
});

export default router;
