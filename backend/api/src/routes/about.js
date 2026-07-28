import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      where: { enabled: true },
    });
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch about" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      biography, summary, profileImage, yearsOfExperience, downloadCVUrl,
      location, email, phone, nationality, languages,
      subtitle, heading, name, degree, availability, freelance,
      glbModel, statistics, featureCards, techIcons,
      background, decoration, animationSettings,
      visibility, order, enabled,
    } = req.body;

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
        statistics: statistics ? (typeof statistics === "string" ? statistics : JSON.stringify(statistics)) : undefined,
        featureCards: featureCards ? (typeof featureCards === "string" ? featureCards : JSON.stringify(featureCards)) : undefined,
        techIcons: techIcons ? (typeof techIcons === "string" ? techIcons : JSON.stringify(techIcons)) : undefined,
        background: background ? (typeof background === "string" ? background : JSON.stringify(background)) : undefined,
        decoration: decoration ? (typeof decoration === "string" ? decoration : JSON.stringify(decoration)) : undefined,
        animationSettings: animationSettings ? (typeof animationSettings === "string" ? animationSettings : JSON.stringify(animationSettings)) : undefined,
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
