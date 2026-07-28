import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { requestLogger, errorHandler, rateLimiter } from "shared";
import uploadRoutes from "./routes/upload.js";
import mediaRoutes from "./routes/media.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/media", mediaRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "media-service", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
