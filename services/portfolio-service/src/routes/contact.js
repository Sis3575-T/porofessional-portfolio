import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";
import { sendContactNotification, sendReplyToUser } from "../services/email.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    sendContactNotification({ name, email, subject, message });

    res.status(201).json({ success: true, message: "Message sent successfully", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ skip, take: limitNum, orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.count(),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { total, page: pageNum, limit: limitNum },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch message" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isRead, isArchived } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: isRead !== undefined ? isRead : undefined, isArchived: isArchived !== undefined ? isArchived : undefined },
    });
    res.json({ success: true, message: "Message updated successfully", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update message" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
});

router.post("/:id/reply", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply text is required" });
    }

    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    const emailSent = await sendReplyToUser({
      to: message.email,
      name: message.name,
      subject: message.subject,
      reply: reply.trim(),
    });

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { reply: reply.trim(), repliedAt: new Date(), isRead: true },
    });

    res.json({
      success: true,
      message: emailSent ? "Reply sent to user's email" : "Reply saved (email not sent — SMTP not configured)",
      data: updated,
      emailSent,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
});

export default router;
