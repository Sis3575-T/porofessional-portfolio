import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, "../../uploads/avatar");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported image format. Use PNG, JPG, or WEBP."));
    }
  },
});

// GET /api/v1/avatar - Get saved avatar (public)
router.get("/", async (req, res) => {
  try {
    const avatar = await prisma.avatar3D.findFirst({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch avatar" });
  }
});

// POST /api/v1/avatar/generate - Generate 3D avatar from photo (admin)
router.post(
  "/generate",
  authenticateToken,
  requireAdmin,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No photo uploaded" });
      }

      const photoUrl = `/uploads/avatar/${req.file.filename}`;

      // In production, this would call Ready Player Me, Meshy AI, or similar
      // For now, we store the photo and return a placeholder model URL
      const avatarId = `avatar-${Date.now()}`;
      const modelUrl = photoUrl; // In production: URL to generated GLB file

      // Delete previous avatar
      await prisma.avatar3D.deleteMany();

      const avatar = await prisma.avatar3D.create({
        data: {
          avatarId,
          photoUrl,
          modelUrl,
          gender: req.body.gender || "male",
          clothing: req.body.clothing || "default",
        },
      });

      res.json({
        success: true,
        message: "Avatar generated successfully",
        data: {
          avatarId: avatar.avatarId,
          modelUrl: avatar.modelUrl,
          photoUrl: avatar.photoUrl,
        },
      });
    } catch (error) {
      console.error("Avatar generation error:", error);
      res.status(500).json({ success: false, message: "Failed to generate avatar" });
    }
  }
);

// POST /api/v1/avatar - Save avatar data (admin)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { avatarId, modelUrl, photoUrl } = req.body;

      await prisma.avatar3D.deleteMany();

      const avatar = await prisma.avatar3D.create({
        data: { avatarId, modelUrl, photoUrl },
      });

      res.json({ success: true, message: "Avatar saved", data: avatar });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to save avatar" });
    }
  }
);

// DELETE /api/v1/avatar - Delete avatar (admin)
router.delete(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await prisma.avatar3D.deleteMany();
      res.json({ success: true, message: "Avatar deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete avatar" });
    }
  }
);

export default router;
