import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { requestLogger, errorHandler, rateLimiter } from "shared";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter());

app.use("/api/v1/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-service", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
