import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";

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
    res.status(500).json({ success: false, message: "Failed to fetch hero" });
  }
});

router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst();
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch hero" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { greeting, name, title, description, primaryCTA, secondaryCTA, profileImage, backgroundImage } = req.body;

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
      },
    });

    res.json({ success: true, message: "Hero updated successfully", data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update hero" });
  }
});

export default router;
