import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { authenticateToken } from "shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../../uploads");

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

router.get("/", authenticateToken, async (req, res) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        configureCloudinary();
        const result = await cloudinary.api.resources({
          type: "upload",
          prefix: "portfolio/",
          max_results: 100,
        });

        const files = result.resources.map((r) => ({
          id: r.public_id,
          filename: r.public_id.split("/").pop(),
          url: r.secure_url,
          size: r.bytes,
          mimetype: r.format,
          createdAt: r.created_at,
          storage: "cloudinary",
        }));

        return res.json({ success: true, data: files });
      } catch (cloudErr) {
        console.warn("[MEDIA] Cloudinary fetch error, checking local uploads:", cloudErr.message);
      }
    }

    // Local uploads listing
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ success: true, data: [] });
    }

    const fileNames = await fs.promises.readdir(uploadsDir);
    const files = await Promise.all(
      fileNames.map(async (name) => {
        try {
          const stat = await fs.promises.stat(path.join(uploadsDir, name));
          return {
            id: name,
            filename: name,
            url: `/uploads/${name}`,
            size: stat.size,
            mimetype: name.split(".").pop(),
            createdAt: stat.birthtime,
            storage: "local",
          };
        } catch {
          return null;
        }
      })
    );

    res.json({ success: true, data: files.filter(Boolean) });
  } catch (error) {
    console.error("Media error:", error);
    res.status(500).json({ success: false, message: "Failed to list media" });
  }
});

router.delete("/:filename", authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        configureCloudinary();
        const result = await cloudinary.api.resources({
          type: "upload",
          prefix: "portfolio/",
          max_results: 100,
        });

        const file = result.resources.find(
          (r) => r.public_id === filename || r.public_id.split("/").pop() === filename
        );

        if (file) {
          await cloudinary.uploader.destroy(file.public_id);
          return res.json({ success: true, message: "File deleted successfully from Cloudinary" });
        }
      } catch (cloudErr) {
        console.warn("[MEDIA] Cloudinary delete failed:", cloudErr.message);
      }
    }

    // Check local file
    const localPath = path.join(uploadsDir, filename);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
      return res.json({ success: true, message: "File deleted successfully from local storage" });
    }

    return res.status(404).json({ success: false, message: "File not found" });
  } catch (error) {
    console.error("Media delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete file" });
  }
});

export default router;
