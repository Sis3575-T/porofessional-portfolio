// services/api/src/routes/hero.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/hero (public)
router.get("/", async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst({
      where: { enabled: true },
    });

    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero",
    });
  }
});

// PUT /api/v1/hero (admin)
router.put(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        greeting,
        name,
        title,
        description,
        primaryCTA,
        secondaryCTA,
        profileImage,
        backgroundImage,
      } = req.body;

      const hero = await prisma.hero.upsert({
        where: { id: "hero-1" },
        update: {
          greeting: greeting || undefined,
          name: name || undefined,
          title: title || undefined,
          description: description || undefined,
          primaryCTA: primaryCTA || undefined,
          secondaryCTA: secondaryCTA || undefined,
          profileImage: profileImage || undefined,
          backgroundImage: backgroundImage || undefined,
        },
        create: {
          id: "hero-1",
          greeting: greeting || "Hello",
          name: name || "Developer",
          title: title || "Title",
          description: description || "Description",
          primaryCTA: primaryCTA || "CTA",
          secondaryCTA: secondaryCTA || "CTA",
        },
      });

      res.json({
        success: true,
        message: "Hero updated successfully",
        data: hero,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update hero",
      });
    }
  }
);

export default router;
