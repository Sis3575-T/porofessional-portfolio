import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { authenticateToken } from "shared";

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
    }));

    res.json({ success: true, data: files });
  } catch (error) {
    console.error("Media error:", error);
    res.status(500).json({ success: false, message: "Failed to list media" });
  }
});

router.delete("/:filename", authenticateToken, async (req, res) => {
  try {
    configureCloudinary();
    const { filename } = req.params;

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "portfolio/",
      max_results: 100,
    });

    const file = result.resources.find(
      (r) => r.public_id === filename || r.public_id.split("/").pop() === filename
    );

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    await cloudinary.uploader.destroy(file.public_id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Media delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete file" });
  }
});

export default router;
