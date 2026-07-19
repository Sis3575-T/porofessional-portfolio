import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

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

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { icon, title, description, features, order, enabled } = req.body;
    const service = await prisma.service.create({
      data: {
        icon,
        title,
        description,
        features: features ? JSON.stringify(features) : undefined,
        order,
        enabled,
      },
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create service" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features, order, enabled } = req.body;
    const service = await prisma.service.update({
      where: { id },
      data: {
        icon,
        title,
        description,
        features: features ? JSON.stringify(features) : undefined,
        order,
        enabled,
      },
    });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
});

export default router;
