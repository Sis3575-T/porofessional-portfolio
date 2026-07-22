import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch education" });
  }
});

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

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      institution, degree, field, description, logo,
      startDate, endDate, isCurrent, gpa, location,
      achievements, technologies, courses, certificateUrl,
      order, enabled,
    } = req.body;
    const edu = await prisma.education.create({
      data: {
        institution,
        degree,
        field: field || "",
        description: description || "",
        logo: logo || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        gpa: gpa || null,
        location: location || null,
        achievements: achievements || null,
        technologies: technologies || null,
        courses: courses || null,
        certificateUrl: certificateUrl || null,
        order: order || 0,
        enabled: enabled !== undefined ? enabled : true,
      },
    });
    res.status(201).json({ success: true, data: edu });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create education" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    const edu = await prisma.education.update({ where: { id }, data: updateData });
    res.json({ success: true, data: edu });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update education" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    res.json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete education" });
  }
});

export default router;
