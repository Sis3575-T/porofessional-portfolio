// services/api/src/routes/contact.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { sendContactNotification } from "../services/email.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/v1/contact (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    sendContactNotification({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// GET /api/v1/contact (admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const messages = await prisma.contactMessage.findMany({
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.contactMessage.count();

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// GET /api/v1/contact/:id (admin)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
    });
  }
});

// PUT /api/v1/contact/:id (admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead, isArchived } = req.body;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? isRead : undefined,
        isArchived: isArchived !== undefined ? isArchived : undefined,
      },
    });

    res.json({
      success: true,
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
});

// DELETE /api/v1/contact/:id (admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
});

export default router;
