import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const settings = await prisma.setting.findFirst({
      select: {
        id: true, siteTitle: true, siteDescription: true, siteUrl: true,
        favicon: true, logo: true, logo_dark: true, socialLinks: true,
        contactEmail: true, contactPhone: true, address: true,
        availability: true, responseTime: true, workingHours: true,
        metaKeywords: true, metaDescription: true, ogImage: true,
        hero3dConfig: true, uiConfig: true, sectionVisibility: true,
      },
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { socialLinks, hero3dConfig, uiConfig, sectionVisibility, ...rest } = req.body;

    const stringify = (val) => {
      if (val === undefined) return undefined;
      if (val === null || val === "") return null;
      return typeof val === "string" ? val : JSON.stringify(val);
    };

    const existing = await prisma.setting.findFirst();
    const settingId = existing?.id || req.body.id || "settings-1";

    const updateData = { ...rest };
    if (socialLinks !== undefined) updateData.socialLinks = stringify(socialLinks);
    if (hero3dConfig !== undefined) updateData.hero3dConfig = stringify(hero3dConfig);
    if (uiConfig !== undefined) updateData.uiConfig = stringify(uiConfig);
    if (sectionVisibility !== undefined) updateData.sectionVisibility = stringify(sectionVisibility);

    // Normalize empty strings to null for nullable database columns
    const nullableFields = [
      "siteUrl", "favicon", "logo", "logo_dark", "contactEmail",
      "contactPhone", "address", "availability", "responseTime",
      "workingHours", "metaKeywords", "metaDescription", "ogImage",
      "googleAnalytics",
    ];
    for (const f of nullableFields) {
      if (updateData[f] !== undefined && (updateData[f] === "" || updateData[f] === null)) {
        updateData[f] = null;
      }
    }

    const settings = await prisma.setting.upsert({
      where: { id: settingId },
      update: updateData,
      create: {
        id: settingId,
        siteTitle: updateData.siteTitle || "Sisay Temesgen - Portfolio",
        siteDescription: updateData.siteDescription || "Professional Full-Stack Developer Portfolio",
        ...updateData,
      },
    });

    invalidatePortfolioCache();

    res.json({ success: true, message: "Settings updated successfully", data: settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update settings" });
  }
});

export default router;
