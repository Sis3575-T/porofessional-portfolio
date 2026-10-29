import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken, requireAdmin, prisma } from "shared";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function configureCloudinary() {
  if (process.env.CLOUDINARY_CLOUD_NAME && !cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
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

      let photoUrl = null;

      // Try Cloudinary first if configured
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          configureCloudinary();
          const b64 = req.file.buffer.toString("base64");
          const dataURI = `data:${req.file.mimetype};base64,${b64}`;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "portfolio/avatar",
            resource_type: "image",
          });
          photoUrl = result.secure_url;
        } catch (cloudErr) {
          console.warn("[AVATAR] Cloudinary upload failed, falling back to local:", cloudErr.message);
        }
      }

      // Local fallback if Cloudinary not available or failed
      if (!photoUrl) {
        const ext = req.file.originalname.split(".").pop() || "png";
        const filename = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filepath = path.join(uploadsDir, filename);
        await fs.promises.writeFile(filepath, req.file.buffer);
        photoUrl = `/uploads/${filename}`;
      }

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
      const { avatarId, modelUrl, photoUrl, gender, clothing, position, rotation, scale, visible } = req.body;
      await prisma.avatar3D.deleteMany();
      const avatar = await prisma.avatar3D.create({
        data: {
          avatarId: avatarId || `avatar-${Date.now()}`,
          modelUrl: modelUrl || null,
          photoUrl: photoUrl || null,
          gender: gender || "male",
          clothing: clothing || "default",
          position: typeof position === "object" ? JSON.stringify(position) : position,
          rotation: typeof rotation === "object" ? JSON.stringify(rotation) : rotation,
          scale: typeof scale === "object" ? JSON.stringify(scale) : scale,
          visible: visible !== undefined ? Boolean(visible) : true,
        },
      });
      res.json({ success: true, message: "Avatar saved", data: avatar });
    } catch (error) {
      console.error("Save avatar error:", error);
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
      if (avatar?.photoUrl && avatar.photoUrl.startsWith("http") && avatar.photoUrl.includes("cloudinary")) {
        try {
          configureCloudinary();
          const parts = avatar.photoUrl.split("/");
          const publicIdWithFolder = parts.slice(-2).join("/");
          const publicId = publicIdWithFolder.replace(/\.[^.]+$/, "");
          await cloudinary.uploader.destroy(publicId).catch(() => {});
        } catch {}
      }
      await prisma.avatar3D.deleteMany();
      res.json({ success: true, message: "Avatar deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete avatar" });
    }
  }
);

export default router;