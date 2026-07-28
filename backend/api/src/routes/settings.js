// services/api/src/routes/settings.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/settings (public)
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.setting.findFirst();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
});

// PUT /api/v1/settings (admin)
router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      siteTitle,
      siteDescription,
      siteUrl,
      favicon,
      logo,
      logo_dark,
      contactEmail,
      contactPhone,
      address,
      metaKeywords,
      metaDescription,
      ogImage,
      socialLinks,
    } = req.body;

    const settings = await prisma.setting.upsert({
      where: { id: "settings-1" },
      update: {
        siteTitle: siteTitle || undefined,
        siteDescription: siteDescription || undefined,
        siteUrl: siteUrl || undefined,
        favicon: favicon || undefined,
        logo: logo || undefined,
        logo_dark: logo_dark || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        address: address || undefined,
        metaKeywords: metaKeywords || undefined,
        metaDescription: metaDescription || undefined,
        ogImage: ogImage || undefined,
        socialLinks: socialLinks ? (typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks)) : undefined,
      },
      create: {
        id: "settings-1",
        siteTitle: siteTitle || "Portfolio",
        siteDescription: siteDescription || "My Portfolio",
      },
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
});

export default router;
k