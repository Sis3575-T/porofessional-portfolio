import express from "express";
import { prisma } from "shared";
import { getCachedPortfolio, setCachedPortfolio } from "../services/portfolioCache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cached = getCachedPortfolio();
    if (cached) {
      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      res.setHeader("ETag", cached.etag);
      if (req.headers["if-none-match"] === cached.etag) {
        return res.status(304).end();
      }
      return res.json({ success: true, data: cached.data });
    }

    const [
      heroRes, aboutRes, skillsRes, servicesRes,
      expRes, eduRes, projRes, testRes, settingsRes
    ] = await Promise.allSettled([
      prisma.hero.findFirst({
        where: { enabled: true },
        select: {
          id: true, greeting: true, name: true, title: true,
          description: true, primaryCTA: true, secondaryCTA: true,
          profileImage: true, backgroundImage: true, enabled: true,
        },
      }),
      prisma.about.findFirst({
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
      }),
      prisma.skill.findMany({
        where: { enabled: true },
        orderBy: { order: "asc" },
        select: {
          id: true, name: true, icon: true, category: true,
          proficiency: true, description: true, order: true, enabled: true,
        },
      }),
      prisma.service.findMany({
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
      }),
      prisma.experience.findMany({
        where: { enabled: true },
        orderBy: { order: "asc" },
        select: {
          id: true, company: true, position: true, description: true,
          logo: true, startDate: true, endDate: true, isCurrent: true,
          employmentType: true, location: true, companyUrl: true,
          technologies: true, responsibilities: true, achievements: true,
          galleryImages: true, order: true, enabled: true,
        },
      }),
      prisma.education.findMany({
        where: { enabled: true },
        orderBy: { order: "asc" },
        select: {
          id: true, institution: true, degree: true, field: true,
          description: true, logo: true, startDate: true, endDate: true,
          isCurrent: true, gpa: true, location: true, achievements: true,
          technologies: true, courses: true, certificateUrl: true,
          order: true, enabled: true,
        },
      }),
      prisma.project.findMany({
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
      }),
      prisma.testimonial.findMany({
        where: { enabled: true },
        orderBy: { order: "asc" },
        select: {
          id: true, name: true, position: true, company: true,
          avatar: true, rating: true, review: true, order: true, enabled: true,
        },
      }),
      prisma.setting.findFirst({
        select: {
          id: true, siteTitle: true, siteDescription: true, siteUrl: true,
          favicon: true, logo: true, logo_dark: true, socialLinks: true,
          contactEmail: true, contactPhone: true, address: true,
          availability: true, responseTime: true, workingHours: true,
          metaKeywords: true, metaDescription: true, ogImage: true,
          googleAnalytics: true, hero3dConfig: true, uiConfig: true,
          sectionVisibility: true,
        },
      }),
    ]);

    const payload = {
      hero: heroRes.status === "fulfilled" ? heroRes.value : null,
      about: aboutRes.status === "fulfilled" ? aboutRes.value : null,
      skills: skillsRes.status === "fulfilled" ? skillsRes.value : [],
      services: servicesRes.status === "fulfilled" ? servicesRes.value : [],
      experiences: expRes.status === "fulfilled" ? expRes.value : [],
      education: eduRes.status === "fulfilled" ? eduRes.value : [],
      projects: projRes.status === "fulfilled" ? projRes.value : [],
      testimonials: testRes.status === "fulfilled" ? testRes.value : [],
      settings: settingsRes.status === "fulfilled" ? settingsRes.value : null,
    };

    const entry = setCachedPortfolio(payload);
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
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
