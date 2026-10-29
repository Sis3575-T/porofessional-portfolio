import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { authenticateToken, prisma } from "shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../../uploads");

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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const assetsMap = new Map();

    // 1. Fetch persistent records from database
    try {
      const dbAssets = await prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
      });
      for (const asset of dbAssets) {
        assetsMap.set(asset.url, {
          id: asset.id,
          filename: asset.filename,
          url: asset.url,
          size: asset.size || 0,
          mimetype: asset.mimeType || "",
          createdAt: asset.createdAt,
          storage: asset.url.startsWith("http") ? "cloudinary" : "local",
        });
      }
    } catch (dbErr) {
      console.warn("[MEDIA] DB fetch warning:", dbErr.message);
    }

    // 2. Add Cloudinary assets if configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        configureCloudinary();
        const result = await cloudinary.api.resources({
          type: "upload",
          prefix: "portfolio/",
          max_results: 100,
        });

        for (const r of result.resources) {
          if (!assetsMap.has(r.secure_url)) {
            assetsMap.set(r.secure_url, {
              id: r.public_id,
              filename: r.public_id.split("/").pop(),
              url: r.secure_url,
              size: r.bytes,
              mimetype: r.format,
              createdAt: r.created_at,
              storage: "cloudinary",
            });
          }
        }
      } catch (cloudErr) {
        console.warn("[MEDIA] Cloudinary fetch error:", cloudErr.message);
      }
    }

    // 3. Add local disk files
    if (fs.existsSync(uploadsDir)) {
      try {
        const fileNames = await fs.promises.readdir(uploadsDir);
        for (const name of fileNames) {
          const fileUrl = `/uploads/${name}`;
          if (!assetsMap.has(fileUrl)) {
            try {
              const stat = await fs.promises.stat(path.join(uploadsDir, name));
              assetsMap.set(fileUrl, {
                id: name,
                filename: name,
                url: fileUrl,
                size: stat.size,
                mimetype: name.split(".").pop(),
                createdAt: stat.birthtime,
                storage: "local",
              });
            } catch {}
          }
        }
      } catch {}
    }

    const files = Array.from(assetsMap.values());
    res.json({ success: true, data: files });
  } catch (error) {
    console.error("Media error:", error);
    res.status(500).json({ success: false, message: "Failed to list media" });
  }
});

router.delete("/:filename", authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;

    // 1. Delete from database if exists by id, filename, or url ending
    try {
      await prisma.mediaAsset.deleteMany({
        where: {
          OR: [
            { id: filename },
            { filename: filename },
            { url: { endsWith: filename } },
            { publicId: filename },
          ],
        },
      });
    } catch (dbErr) {
      console.warn("[MEDIA] DB delete warning:", dbErr.message);
    }

    // 2. Cloudinary deletion if applicable
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

    // 3. Check local file
    const localPath = path.join(uploadsDir, filename);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
      return res.json({ success: true, message: "File deleted successfully from local storage" });
    }

    return res.json({ success: true, message: "Asset removed" });
  } catch (error) {
    console.error("Media delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete file" });
  }
});

export default router;