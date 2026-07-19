import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(uploadsDir)
      .filter((f) => f !== ".gitkeep")
      .map((filename) => {
        const stat = fs.statSync(path.join(uploadsDir, filename));
        return {
          id: filename,
          filename,
          url: `/uploads/${filename}`,
          size: stat.size,
          createdAt: stat.birthtime,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, data: files });
  } catch (error) {
    console.error("Media error:", error);
    res.status(500).json({ success: false, message: "Failed to list media" });
  }
});

export default router;
