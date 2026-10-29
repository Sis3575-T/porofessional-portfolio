import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

// GET /api/v1/testimonials (public - enabled only)
router.get("/", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, position: true, company: true,
        avatar: true, rating: true, review: true, order: true, enabled: true,
      },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
});

// GET /api/v1/testimonials/admin (admin - all)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
});

// POST /api/v1/testimonials (admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, position, company, avatar, rating, review, order, enabled } = req.body;
    if (!name || !review) {
      return res.status(400).json({ success: false, message: "Name and review are required" });
    }

    const parsedRating = Number.isInteger(Number(rating)) ? Math.max(1, Math.min(5, parseInt(rating, 10))) : 5;
    const parsedOrder = Number.isInteger(Number(order)) ? parseInt(order, 10) : 0;

    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        position: position || "",
        company: company || "",
        avatar: avatar || null,
        rating: parsedRating,
        review: review.trim(),
        order: parsedOrder,
        enabled: enabled !== undefined ? Boolean(enabled) : true,
      },
    });

    invalidatePortfolioCache();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({ success: false, message: "Failed to create testimonial" });
  }
});

// PUT /api/v1/testimonials/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    const data = req.body;
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.position !== undefined) updateData.position = data.position;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.avatar !== undefined) updateData.avatar = data.avatar === "" ? null : data.avatar;
    if (data.review !== undefined) updateData.review = data.review.trim();
    if (data.rating !== undefined) {
      updateData.rating = Number.isInteger(Number(data.rating)) ? Math.max(1, Math.min(5, parseInt(data.rating, 10))) : existing.rating;
    }
    if (data.order !== undefined) {
      updateData.order = Number.isInteger(Number(data.order)) ? parseInt(data.order, 10) : existing.order;
    }
    if (data.enabled !== undefined) updateData.enabled = Boolean(data.enabled);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    invalidatePortfolioCache();
    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({ success: false, message: "Failed to update testimonial" });
  }
});

// DELETE /api/v1/testimonials/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    invalidatePortfolioCache();
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ success: false, message: "Failed to delete testimonial" });
  }
});

export default router;