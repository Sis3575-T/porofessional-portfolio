import express from "express";
import { prisma } from "shared";
import { getCachedPortfolio, setCachedPortfolio } from "../services/portfolioCache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cached = getCachedPortfolio();
    if (cached) {
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("ETag", cached.etag);
      if (req.headers["if-none-match"] === cached.etag) {
        return res.status(304).end();
      }
      return res.json({ success: true, data: cached.data });
    }

    // Sequential queries reuse the single database connection and avoid Neon WebSocket concurrency limits
    const hero = await prisma.hero.findFirst({
      where: { enabled: true },
      select: {
        id: true, greeting: true, name: true, title: true,
        description: true, primaryCTA: true, secondaryCTA: true,
        profileImage: true, backgroundImage: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] hero fetch warning:", err.message);
      return null;
    });

    const about = await prisma.about.findFirst({
      where: { enabled: true },
      select: {
        id: true, biography: true, summary: true, profileImage: true,
        yearsOfExperience: true, downloadCVUrl: true, location: true,
        email: true, phone: true, nationality: true, languages: true,
        subtitle: true, heading: true, name: true, degree: true,
        availability: true, freelance: true, glbModel: true,
        statistics: true, featureCards: true, techIcons: true,
        background: true, decoration: true, animationSettings: true,
        visibility: true, order: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] about fetch warning:", err.message);
      return null;
    });

    const skills = await prisma.skill.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, icon: true, category: true,
        proficiency: true, description: true, order: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] skills fetch warning:", err.message);
      return [];
    });

    const services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, slug: true, title: true, shortDescription: true,
        description: true, fullDescription: true, icon: true, iconUrl: true,
        heroImage: true, galleryImages: true, technologies: true,
        features: true, tools: true, process: true, liveUrl: true,
        githubUrl: true, docsUrl: true, caseStudyUrl: true,
        buttonText: true, buttonColor: true, accentColor: true,
        enabled: true, order: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] services fetch warning:", err.message);
      return [];
    });

    const experiences = await prisma.experience.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, company: true, position: true, description: true,
        logo: true, startDate: true, endDate: true, isCurrent: true,
        employmentType: true, location: true, companyUrl: true,
        technologies: true, responsibilities: true, achievements: true,
        galleryImages: true, order: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] experiences fetch warning:", err.message);
      return [];
    });

    const education = await prisma.education.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, institution: true, degree: true, field: true,
        description: true, logo: true, startDate: true, endDate: true,
        isCurrent: true, gpa: true, location: true, achievements: true,
        technologies: true, courses: true, certificateUrl: true,
        order: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] education fetch warning:", err.message);
      return [];
    });

    const projects = await prisma.project.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      take: 50,
      select: {
        id: true, title: true, slug: true, description: true,
        shortDescription: true, thumbnail: true, images: true,
        category: true, technologies: true, features: true,
        liveUrl: true, githubUrl: true, featured: true,
        order: true, viewCount: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] projects fetch warning:", err.message);
      return [];
    });

    const testimonials = await prisma.testimonial.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, position: true, company: true,
        avatar: true, rating: true, review: true, order: true, enabled: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] testimonials fetch warning:", err.message);
      return [];
    });

    const settings = await prisma.setting.findFirst({
      select: {
        id: true, siteTitle: true, siteDescription: true, siteUrl: true,
        favicon: true, logo: true, logo_dark: true, socialLinks: true,
        contactEmail: true, contactPhone: true, address: true,
        availability: true, responseTime: true, workingHours: true,
        metaKeywords: true, metaDescription: true, ogImage: true,
        googleAnalytics: true, hero3dConfig: true, uiConfig: true,
        sectionVisibility: true,
      },
    }).catch((err) => {
      console.warn("[PORTFOLIO] settings fetch warning:", err.message);
      return null;
    });

    const payload = {
      hero,
      about,
      skills: Array.isArray(skills) ? skills : [],
      services: Array.isArray(services) ? services : [],
      experiences: Array.isArray(experiences) ? experiences : [],
      education: Array.isArray(education) ? education : [],
      projects: Array.isArray(projects) ? projects : [],
      testimonials: Array.isArray(testimonials) ? testimonials : [],
      settings,
    };

    const entry = setCachedPortfolio(payload);
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("ETag", entry.etag);

    if (req.headers["if-none-match"] === entry.etag) {
      return res.status(304).end();
    }

    return res.json({ success: true, data: payload });
  } catch (error) {
    console.error("Consolidated portfolio fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch portfolio data" });
  }
});

export default router;