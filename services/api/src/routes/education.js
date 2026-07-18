// services/api/src/routes/education.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/education (public)
router.get("/", async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      where: { enabled: true },
      orderBy: { startDate: "desc" },
    });

    res.json({
      success: true,
      data: education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
});

// POST /api/v1/education (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      institution,
      degree,
      field,
      description,
      logo,
      startDate,
      endDate,
      gpa,
    } = req.body;

    const edu = await prisma.education.create({
      data: {
        institution,
        degree,
        field,
        description,
        logo,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        gpa,
      },
    });

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: edu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create education",
    });
  }
});

// PUT /api/v1/education/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      institution,
      degree,
      field,
      description,
      logo,
      startDate,
      endDate,
      gpa,
    } = req.body;

    const edu = await prisma.education.update({
      where: { id },
      data: {
        institution: institution || undefined,
        degree: degree || undefined,
        field: field || undefined,
        description: description || undefined,
        logo: logo || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        gpa: gpa || undefined,
      },
    });

    res.json({
      success: true,
      message: "Education updated successfully",
      data: edu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
});

// DELETE /api/v1/education/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.education.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
});

export default router;
