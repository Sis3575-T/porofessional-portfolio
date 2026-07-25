import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";
import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
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

      configureCloudinary();

      const b64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "portfolio/avatar",
        resource_type: "image",
      });

      const photoUrl = result.secure_url;
      const avatarId = `avatar-${Date.now()}`;
      const modelUrl = photoUrl;

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

router.delete(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const avatar = await prisma.avatar3D.findFirst({
        orderBy: { createdAt: "desc" },
      });
      if (avatar?.photoUrl) {
        configureCloudinary();
        const parts = avatar.photoUrl.split("/");
        const publicIdWithFolder = parts.slice(-2).join("/");
        const publicId = publicIdWithFolder.replace(/\.[^.]+$/, "");
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      await prisma.avatar3D.deleteMany();
      res.json({ success: true, message: "Avatar deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete avatar" });
    }
  }
);

export default router;
