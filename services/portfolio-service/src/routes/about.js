import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ where: { enabled: true } });
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch about" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { biography, summary, profileImage, yearsOfExperience, downloadCVUrl, location, email, phone, nationality, languages, subtitle, heading, name, degree, availability, freelance, glbModel, statistics, featureCards, techIcons, background, decoration, animationSettings, visibility, order, enabled } = req.body;

    const stringify = (val) => val ? (typeof val === "string" ? val : JSON.stringify(val)) : undefined;

    const about = await prisma.about.upsert({
      where: { id: "about-1" },
      update: {
        biography: biography ?? undefined,
        summary: summary ?? undefined,
        profileImage: profileImage ?? undefined,
        yearsOfExperience: yearsOfExperience ?? undefined,
        downloadCVUrl: downloadCVUrl ?? undefined,
        location: location ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
        nationality: nationality ?? undefined,
        languages: languages ?? undefined,
        subtitle: subtitle ?? undefined,
        heading: heading ?? undefined,
        name: name ?? undefined,
        degree: degree ?? undefined,
        availability: availability ?? undefined,
        freelance: freelance ?? undefined,
        glbModel: glbModel ?? undefined,
        statistics: stringify(statistics),
        featureCards: stringify(featureCards),
        techIcons: stringify(techIcons),
        background: stringify(background),
        decoration: stringify(decoration),
        animationSettings: stringify(animationSettings),
        visibility: visibility ?? undefined,
        order: order ?? undefined,
        enabled: enabled ?? undefined,
      },
      create: {
        id: "about-1",
        biography: biography || "",
        summary: summary || "",
      },
    });

    res.json({ success: true, message: "About updated successfully", data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update about" });
  }
});

export default router;
