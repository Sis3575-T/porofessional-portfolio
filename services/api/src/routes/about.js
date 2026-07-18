// services/api/src/routes/about.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/about (public)
router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      where: { enabled: true },
    });

    res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch about",
    });
  }
});

// PUT /api/v1/about (admin)
router.put(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        biography,
        summary,
        profileImage,
        yearsOfExperience,
        downloadCVUrl,
        location,
        email,
        phone,
        nationality,
        languages,
      } = req.body;

      const about = await prisma.about.upsert({
        where: { id: "about-1" },
        update: {
          biography: biography || undefined,
          summary: summary || undefined,
          profileImage: profileImage || undefined,
          yearsOfExperience: yearsOfExperience || undefined,
          downloadCVUrl: downloadCVUrl || undefined,
          location: location || undefined,
          email: email || undefined,
          phone: phone || undefined,
          nationality: nationality || undefined,
          languages: languages || undefined,
        },
        create: {
          id: "about-1",
          biography: biography || "",
          summary: summary || "",
        },
      });

      res.json({
        success: true,
        message: "About updated successfully",
        data: about,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update about",
      });
    }
  }
);

export default router;
