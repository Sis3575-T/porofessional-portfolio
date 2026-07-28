// services/api/src/routes/services.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/services (public)
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
});

// POST /api/v1/services (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { icon, title, description, features } = req.body;

    const service = await prisma.service.create({
      data: {
        icon,
        title,
        description,
        features: typeof features === "string" ? features : JSON.stringify(features),
        order: await prisma.service.count(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
});

// PUT /api/v1/services/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        icon: icon || undefined,
        title: title || undefined,
        description: description || undefined,
        features: features ? (typeof features === "string" ? features : JSON.stringify(features)) : undefined,
      },
    });

    res.json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
});

// DELETE /api/v1/services/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
});

export default router;
