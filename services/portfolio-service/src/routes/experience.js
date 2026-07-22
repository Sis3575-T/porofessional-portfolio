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

router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { company, position, description, logo, startDate, endDate, isCurrent, employmentType, location, companyUrl, technologies, responsibilities, achievements, galleryImages, order, enabled } = req.body;
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        logo,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        employmentType,
        location,
        companyUrl,
        technologies: technologies ? JSON.stringify(technologies) : null,
        responsibilities: responsibilities ? JSON.stringify(responsibilities) : null,
        achievements: achievements ? JSON.stringify(achievements) : null,
        galleryImages: galleryImages ? JSON.stringify(galleryImages) : null,
        order: order || 0,
        enabled: enabled !== false,
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
    if (updateData.responsibilities) updateData.responsibilities = JSON.stringify(updateData.responsibilities);
    if (updateData.achievements) updateData.achievements = JSON.stringify(updateData.achievements);
    if (updateData.galleryImages) updateData.galleryImages = JSON.stringify(updateData.galleryImages);
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

router.put("/reorder/batch", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Items array is required" });
    }
    await Promise.all(
      items.map((item) =>
        prisma.experience.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

export default router;
