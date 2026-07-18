// services/api/src/routes/testimonials.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/testimonials (public)
router.get("/", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
});

// POST /api/v1/testimonials (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, position, company, avatar, rating, review } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        position,
        company,
        avatar,
        rating: rating || 5,
        review,
        order: await prisma.testimonial.count(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
    });
  }
});

// PUT /api/v1/testimonials/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, company, avatar, rating, review } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name || undefined,
        position: position || undefined,
        company: company || undefined,
        avatar: avatar || undefined,
        rating: rating || undefined,
        review: review || undefined,
      },
    });

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
});

// DELETE /api/v1/testimonials/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
});

export default router;
