import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "shared";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true } } },
      }),
      prisma.activity.count(),
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Activities error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch activities" });
  }
});

export default router;
