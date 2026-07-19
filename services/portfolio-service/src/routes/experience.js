import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { company, position, description, logo, startDate, endDate, isCurrent, technologies, order, enabled } = req.body;
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        logo,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        technologies: technologies ? JSON.stringify(technologies) : null,
        order,
        enabled,
      },
    });
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create experience" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.technologies) updateData.technologies = JSON.stringify(updateData.technologies);
    const experience = await prisma.experience.update({ where: { id }, data: updateData });
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update experience" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete experience" });
  }
});

export default router;
