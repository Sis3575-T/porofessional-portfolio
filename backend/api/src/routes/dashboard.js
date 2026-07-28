import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [projects, messages, skills, visitorCount, recentMessages] =
      await Promise.all([
        prisma.project.count({ where: { enabled: true } }),
        prisma.contactMessage.count(),
        prisma.skill.count({ where: { enabled: true } }),
        prisma.project.aggregate({
          _sum: { viewCount: true },
        }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, subject: true, createdAt: true, isRead: true },
        }),
      ]);

    const totalViews = visitorCount._sum.viewCount || 0;

    const mostViewed = await prisma.project.findFirst({
      orderBy: { viewCount: "desc" },
      select: { title: true, viewCount: true },
    });

    res.json({
      success: true,
      data: {
        projects,
        messages,
        skills,
        visitors: totalViews,
        recentMessages,
        mostViewedProject: mostViewed,
        totalViews,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

export default router;
