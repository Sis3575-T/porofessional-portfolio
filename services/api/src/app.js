import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const allowedOrigins = [
  "http://localhost:5175",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) { cb(null, true); return; }
    if (allowedOrigins.some((o) => origin.startsWith(o.replace(/\/$/, "")))) {
      cb(null, true); return;
    }
    if (/^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      cb(null, true); return;
    }
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.options("*", cors({ origin: true, credentials: true }));

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const PORTFOLIO_SERVICE = process.env.PORTFOLIO_SERVICE_URL || "http://localhost:5002";
const MEDIA_SERVICE = process.env.MEDIA_SERVICE_URL || "http://localhost:5003";
const DASHBOARD_SERVICE = process.env.DASHBOARD_SERVICE_URL || "http://localhost:5004";

function proxyRequest(targetBase) {
  return (req, res) => {
    const targetUrl = new URL(req.originalUrl, targetBase);
    const isMultipart = req.headers["content-type"]?.startsWith("multipart/");

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: { ...req.headers },
    };

    delete options.headers["host"];

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error(`[Gateway] Proxy error to ${targetBase}:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: "Service unavailable" });
      }
    });

    if (isMultipart) {
      req.pipe(proxyReq);
    } else if (["POST", "PUT", "PATCH"].includes(req.method)) {
      proxyReq.write(JSON.stringify(req.body));
      proxyReq.end();
    } else {
      proxyReq.end();
    }
  };
}

app.use("/api/v1/auth", proxyRequest(AUTH_SERVICE));
app.use("/api/v1/hero", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/about", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/skills", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/services", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/experience", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/education", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/projects", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/testimonials", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/contact", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/settings", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/avatar", proxyRequest(PORTFOLIO_SERVICE));
app.use("/api/v1/upload", proxyRequest(MEDIA_SERVICE));
app.use("/api/v1/media", proxyRequest(MEDIA_SERVICE));
app.use("/api/v1/dashboard", proxyRequest(DASHBOARD_SERVICE));
app.use("/api/v1/activities", proxyRequest(DASHBOARD_SERVICE));

app.use("/uploads", (req, res) => {
  const targetBase = req.url.startsWith("/avatar") ? PORTFOLIO_SERVICE : MEDIA_SERVICE;
  const targetUrl = `${targetBase}/uploads${req.url}`;
  http.get(targetUrl, (proxyRes) => {
    if (proxyRes.statusCode === 404 && targetBase === MEDIA_SERVICE) {
      const fallbackUrl = `${PORTFOLIO_SERVICE}/uploads${req.url}`;
      http.get(fallbackUrl, (fallbackRes) => {
        res.writeHead(fallbackRes.statusCode, fallbackRes.headers);
        fallbackRes.pipe(res);
      }).on("error", () => {
        res.status(404).json({ success: false, message: "File not found" });
      });
    } else {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  }).on("error", () => {
    res.status(404).json({ success: false, message: "File not found" });
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    gateway: true,
    services: {
      auth: AUTH_SERVICE,
      portfolio: PORTFOLIO_SERVICE,
      media: MEDIA_SERVICE,
      dashboard: DASHBOARD_SERVICE,
    },
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

export default app;
