import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cloudinary, configureCloudinary } from "../config/cloudinary.js";
import { authenticateToken } from "shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const imageUpload = multer({
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

const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
    }
  },
});

const router = express.Router();

router.post("/", authenticateToken, imageUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Attempt Cloudinary upload if cloud name is configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        configureCloudinary();
        const b64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "portfolio",
          resource_type: "auto",
        });

        return res.json({
          success: true,
          data: {
            url: result.secure_url,
            filename: result.public_id,
            size: req.file.size,
            mimetype: req.file.mimetype,
            storage: "cloudinary",
          },
        });
      } catch (cloudinaryErr) {
        console.warn("[UPLOAD] Cloudinary upload error, falling back to local:", cloudinaryErr.message);
      }
    }

    // Local disk fallback
    const ext = req.file.originalname.split(".").pop() || "png";
    const filename = `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filepath, req.file.buffer);

    return res.json({
      success: true,
      data: {
        url: `/uploads/${filename}`,
        filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        storage: "local",
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message, error.http_code || "");
    res.status(500).json({ success: false, message: error.message || "Failed to upload file" });
  }
});

router.post("/cv", authenticateToken, cvUpload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        configureCloudinary();
        const b64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "portfolio/cv",
          resource_type: "raw",
          format: req.file.originalname.split(".").pop(),
        });

        return res.json({
          success: true,
          data: {
            url: result.secure_url,
            filename: result.public_id,
            size: req.file.size,
            mimetype: req.file.mimetype,
            originalName: req.file.originalname,
            storage: "cloudinary",
          },
        });
      } catch (cloudinaryErr) {
        console.warn("[UPLOAD] Cloudinary CV upload error, falling back to local:", cloudinaryErr.message);
      }
    }

    // Local disk fallback
    const ext = req.file.originalname.split(".").pop() || "pdf";
    const filename = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filepath, req.file.buffer);

    return res.json({
      success: true,
      data: {
        url: `/uploads/${filename}`,
        filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
        storage: "local",
      },
    });
  } catch (error) {
    console.error("CV upload error:", error.message, error.http_code || "");
    res.status(500).json({ success: false, message: error.message || "Failed to upload CV" });
  }
});

export default router;
