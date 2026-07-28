import express from "express";
import crypto from "crypto";
import { authenticateToken, requireAdmin, rateLimiter, prisma } from "shared";
import { sendReplyToUser } from "../services/email.js";

const router = express.Router();

const publicRateLimit = rateLimiter(15 * 60 * 1000, 100);

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/[<>"'&]/g, (ch) => {
    const map = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[ch] || ch;
  });
}

// ========== VISITOR: Send message (no email to admin) ==========
router.post("/", publicRateLimit, async (req, res) => {
  try {
    const { visitorToken, name, email, phone, subject, message, honeypot } = req.body;

    if (honeypot && honeypot.length > 0) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (message.trim().length > 5000) {
      return res.status(400).json({ success: false, message: "Message is too long" });
    }

    const token = visitorToken || crypto.randomUUID();

    const contact = await prisma.contactMessage.create({
      data: {
        visitorToken: token,
        fullName: name && name.trim() ? sanitize(name.trim()) : null,
        email: email && email.trim() ? email.trim().toLowerCase() : null,
        phone: phone && phone.trim() ? sanitize(phone.trim()) : null,
        subject: subject && subject.trim() ? sanitize(subject.trim()) : null,
        message: sanitize(message.trim()),
      },
    });

    console.log(`[CONTACT] New message from ${contact.fullName || "Anonymous"} (${contact.email || "no email"})`);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { visitorToken: token, id: contact.id },
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
});

// ========== VISITOR: Check for reply ==========
router.get("/reply/:token", async (req, res) => {
  try {
    const contact = await prisma.contactMessage.findFirst({
      where: { visitorToken: req.params.token },
      orderBy: { createdAt: "desc" },
      select: { id: true, reply: true, repliedAt: true, createdAt: true },
    });

    if (!contact) {
      return res.status(404).json({ success: false, message: "No messages found" });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error("Reply check error:", error);
    res.status(500).json({ success: false, message: "Failed to check reply" });
  }
});

// ========== ADMIN: Unread count ==========
router.get("/unread-count/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const count = await prisma.contactMessage.count({ where: { isRead: false, isArchived: false } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch unread count" });
  }
});

// ========== ADMIN: List messages ==========
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const search = (req.query.search || "").trim();
    const status = req.query.status;

    const where = {};
    if (status === "UNREAD") where.isRead = false;
    else if (status === "READ") { where.isRead = true; where.isArchived = false; where.repliedAt = null; }
    else if (status === "REPLIED") where.repliedAt = { not: null };
    else if (status === "ARCHIVED") where.isArchived = true;
    else where.isArchived = false;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ where, skip, take: limitNum, orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// ========== ADMIN: Get single message ==========
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    if (!message.isRead) {
      await prisma.contactMessage.update({ where: { id: message.id }, data: { isRead: true } });
      message.isRead = true;
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch message" });
  }
});

// ========== ADMIN: Reply (sends email to visitor) ==========
router.post("/:id/reply", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || typeof reply !== "string" || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply is required" });
    }
    if (reply.trim().length > 10000) {
      return res.status(400).json({ success: false, message: "Reply is too long" });
    }

    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    let emailSent = false;
    let emailError = null;
    if (message.email) {
      try {
        emailSent = await sendReplyToUser({
          to: message.email,
          name: message.fullName || "Visitor",
          subject: message.subject || "Your message",
          reply: reply.trim(),
        });
      } catch (e) {
        emailError = e.message;
      }
    }

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { reply: reply.trim(), repliedAt: new Date(), isRead: true },
    });

    res.json({
      success: true,
      message: emailSent
        ? "Reply sent to visitor's email"
        : message.email
          ? emailError ? `Reply saved (email error: ${emailError})` : "Reply saved (email failed to send)"
          : "Reply saved (visitor provided no email)",
      data: updated,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
});

// ========== ADMIN: Test email configuration ==========
router.post("/test-email", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { to } = req.body;
    const testAddress = to || process.env.ADMIN_EMAIL || "sisay3575@gmail.com";
    console.log("[EMAIL-TEST] Testing SMTP config, sending test to:", testAddress);
    console.log("[EMAIL-TEST] SMTP_HOST:", process.env.SMTP_HOST);
    console.log("[EMAIL-TEST] SMTP_USER:", process.env.SMTP_USER);
    console.log("[EMAIL-TEST] SMTP_PORT:", process.env.SMTP_PORT);
    console.log("[EMAIL-TEST] SMTP_PASS set:", !!process.env.SMTP_PASS);

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });

    const info = await transporter.sendMail({
      from: `"${process.env.SITE_NAME || "Portfolio"}" <${process.env.SMTP_USER}>`,
      to: testAddress,
      subject: "Test email from Portfolio Admin",
      html: "<h2>Test Email</h2><p>If you receive this, your SMTP configuration is working correctly.</p>",
    });

    console.log("[EMAIL-TEST] Success! messageId:", info.messageId);
    res.json({ success: true, message: "Test email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("[EMAIL-TEST] Failed:", error);
    res.status(500).json({
      success: false,
      message: "Test email failed",
      error: error.message,
      code: error.code,
      command: error.command,
    });
  }
});

// ========== ADMIN: Mark read/unread ==========
router.patch("/:id/read", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: !message.isRead },
    });

    res.json({ success: true, message: updated.isRead ? "Marked as read" : "Marked as unread", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

// ========== ADMIN: Archive/unarchive ==========
router.patch("/:id/archive", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isArchived: !message.isArchived },
    });

    res.json({ success: true, message: updated.isArchived ? "Archived" : "Restored", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

// ========== ADMIN: Delete ==========
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

export default router;
