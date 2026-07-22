import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const settings = await prisma.setting.findFirst();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { socialLinks, hero3dConfig, uiConfig, sectionVisibility, ...rest } = req.body;

    const stringify = (val) => val ? (typeof val === "string" ? val : JSON.stringify(val)) : undefined;

    const settings = await prisma.setting.upsert({
      where: { id: "settings-1" },
      update: {
        ...rest,
        socialLinks: stringify(socialLinks),
        hero3dConfig: stringify(hero3dConfig),
        uiConfig: stringify(uiConfig),
        sectionVisibility: stringify(sectionVisibility),
      },
      create: {
        id: "settings-1",
        siteTitle: "Portfolio",
        siteDescription: "My Portfolio",
        ...rest,
        socialLinks: stringify(socialLinks),
        hero3dConfig: stringify(hero3dConfig),
        uiConfig: stringify(uiConfig),
        sectionVisibility: stringify(sectionVisibility),
      },
    });

    res.json({ success: true, message: "Settings updated successfully", data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
});

export default router;
