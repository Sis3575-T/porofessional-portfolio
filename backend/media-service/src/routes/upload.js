import express from "express";
import multer from "multer";
import { cloudinary, configureCloudinary } from "../config/cloudinary.js";
import { authenticateToken } from "shared";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG, SVG, and WEBP files are allowed"), false);
    }
  },
});

const router = express.Router();

router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    configureCloudinary();

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ success: false, message: "Cloudinary not configured" });
    }

    const b64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "portfolio",
      resource_type: "auto",
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        filename: result.public_id,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message, error.http_code || "");
    res.status(500).json({ success: false, message: error.message || "Failed to upload file" });
  }
});

export default router;
