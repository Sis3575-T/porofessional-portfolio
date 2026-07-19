import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create testimonial" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update testimonial" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete testimonial" });
  }
});

export default router;
