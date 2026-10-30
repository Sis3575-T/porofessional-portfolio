import express from "express";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { invalidatePortfolioCache } from "../services/portfolioCache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ where: { enabled: true } });
    res.json({ success: true, data: about });
  } catch (error) {
    console.error("Fetch about error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch about", error: error.message });
  }
});

router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const about = await prisma.about.findFirst();
    res.json({ success: true, data: about });
  } catch (error) {
    console.error("Fetch about admin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch about" });
  }
});

router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      biography, summary, profileImage, yearsOfExperience, downloadCVUrl,
      location, email, phone, nationality, languages, subtitle, heading,
      name, degree, availability, freelance, glbModel, statistics,
      featureCards, techIcons, background, decoration, animationSettings,
      visibility, order, enabled
    } = req.body;

    const stringify = (val) => {
      if (val === undefined) return undefined;
      if (val === null || val === "") return null;
      return typeof val === "string" ? val : JSON.stringify(val);
    };

    const existing = await prisma.about.findFirst();
    const aboutId = existing?.id || req.body.id || "about-1";

    const updateData = {};
    if (biography !== undefined) updateData.biography = String(biography);
    if (summary !== undefined) updateData.summary = String(summary);
    if (profileImage !== undefined) updateData.profileImage = profileImage ? String(profileImage).trim() : null;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = parseInt(yearsOfExperience) || 0;
    if (downloadCVUrl !== undefined) updateData.downloadCVUrl = downloadCVUrl ? String(downloadCVUrl).trim() : null;
    if (location !== undefined) updateData.location = location ? String(location).trim() : null;
    if (email !== undefined) updateData.email = email ? String(email).trim() : null;
    if (phone !== undefined) updateData.phone = phone ? String(phone).trim() : null;
    if (nationality !== undefined) updateData.nationality = nationality ? String(nationality).trim() : null;
    if (languages !== undefined) updateData.languages = languages ? String(languages).trim() : null;
    if (subtitle !== undefined) updateData.subtitle = String(subtitle).trim();
    if (heading !== undefined) updateData.heading = String(heading).trim();
    if (name !== undefined) updateData.name = String(name).trim();
    if (degree !== undefined) updateData.degree = degree ? String(degree).trim() : null;
    if (availability !== undefined) updateData.availability = String(availability).trim();
    if (freelance !== undefined) updateData.freelance = String(freelance).trim();
    if (glbModel !== undefined) updateData.glbModel = glbModel ? String(glbModel).trim() : null;
    if (statistics !== undefined) updateData.statistics = stringify(statistics);
    if (featureCards !== undefined) updateData.featureCards = stringify(featureCards);
    if (techIcons !== undefined) updateData.techIcons = stringify(techIcons);
    if (background !== undefined) updateData.background = stringify(background);
    if (decoration !== undefined) updateData.decoration = stringify(decoration);
    if (animationSettings !== undefined) updateData.animationSettings = stringify(animationSettings);
    if (visibility !== undefined) updateData.visibility = String(visibility);
    if (order !== undefined) updateData.order = parseInt(order) || 0;
    if (enabled !== undefined) updateData.enabled = Boolean(enabled);

    const about = await prisma.about.upsert({
      where: { id: aboutId },
      update: updateData,
      create: {
        id: aboutId,
        biography: biography ? String(biography) : "",
        summary: summary ? String(summary) : "",
        name: name ? String(name).trim() : "Sisay Temesgen",
        subtitle: subtitle ? String(subtitle).trim() : "ABOUT ME",
        heading: heading ? String(heading).trim() : "Crafting Digital Experiences That Make an Impact",
        downloadCVUrl: downloadCVUrl ? String(downloadCVUrl).trim() : "/Sisay_Temesgen_CV.pdf",
        yearsOfExperience: parseInt(yearsOfExperience) || 3,
        enabled: true,
      },
    });

    invalidatePortfolioCache();

    res.json({ success: true, message: "About updated successfully", data: about });
  } catch (error) {
    console.error("Update about error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update about" });
  }
});

export default router;
