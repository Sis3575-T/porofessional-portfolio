import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT) || 5000,
  database: {
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/portfolio",
  },
  api: {
    version: "v1",
    prefix: "/api",
    baseUrl: process.env.API_URL || "http://localhost:5000",
  },
  services: {
    ipinfo: {
      token: process.env.IPINFO_TOKEN || "",
    },
    fingerprint: {
      apiUrl: process.env.FINGERPRINT_API_URL || "",
      apiKey: process.env.FINGERPRINT_API_KEY || "",
    },
  },
  analytics: {
    sessionTimeout: 30 * 60 * 1000,
    maxPageViewsPerVisitor: 100,
    botDetection: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    },
    rateLimitTrack: {
      windowMs: 1 * 60 * 1000,
      maxRequests: 30,
    },
  },
  security: {
    hashIP: true,
    hashUserAgent: true,
    preserveBrowserEngine: true,
    preserveOS: true,
    preserveDevice: true,
  },
  cors: {
    allowedOrigins: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  },
};
