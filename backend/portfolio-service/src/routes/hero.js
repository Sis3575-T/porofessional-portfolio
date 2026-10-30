import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst({
      where: { enabled: true },
      select: {
        id: true, greeting: true, name: true, title: true,
        description: true, primaryCTA: true, secondaryCTA: true,
        profileImage: true, backgroundImage: true,
      },
    });
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error("Fetch hero error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hero", error: error.message });
  }
});

router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst();
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error("Fetch hero admin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hero" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { greeting, name, title, description, primaryCTA, secondaryCTA, profileImage, backgroundImage, enabled } = req.body;

    const existing = await prisma.hero.findFirst();
    const heroId = existing?.id || req.body.id || "hero-1";

    const updateData = {};
    if (greeting !== undefined) updateData.greeting = String(greeting).trim();
    if (name !== undefined) updateData.name = String(name).trim();
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (primaryCTA !== undefined) updateData.primaryCTA = String(primaryCTA).trim();
    if (secondaryCTA !== undefined) updateData.secondaryCTA = String(secondaryCTA).trim();
    if (profileImage !== undefined) updateData.profileImage = profileImage ? String(profileImage).trim() : null;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage ? String(backgroundImage).trim() : null;
    if (enabled !== undefined) updateData.enabled = Boolean(enabled);

    const hero = await prisma.hero.upsert({
      where: { id: heroId },
      update: updateData,
      create: {
        id: heroId,
        greeting: greeting ? String(greeting).trim() : "Hello, I'm",
        name: name ? String(name).trim() : "Sisay Temesgen",
        title: title ? String(title).trim() : "Full-Stack Developer",
        description: description ? String(description).trim() : "",
        primaryCTA: primaryCTA ? String(primaryCTA).trim() : "View Projects",
        secondaryCTA: secondaryCTA ? String(secondaryCTA).trim() : "Contact Me",
        profileImage: profileImage ? String(profileImage).trim() : null,
        backgroundImage: backgroundImage ? String(backgroundImage).trim() : null,
        enabled: true,
      },
    });

    invalidatePortfolioCache();

    res.json({ success: true, message: "Hero updated successfully", data: hero });
  } catch (error) {
    console.error("Update hero error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update hero" });
  }
});

export default router;
