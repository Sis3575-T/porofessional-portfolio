import express from "express";
import crypto from "crypto";
import { authenticateToken, requireAdmin, prisma } from "shared";

const router = express.Router();

// ============ Bot Detection ============
const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /sogou/i, /exabot/i, /facebot/i, /facebookexternalhit/i,
  /ia_archiver/i, /alexabot/i, /mj12bot/i, /ahrefsbot/i, /semrushbot/i,
  /dotbot/i, /rogerbot/i, /linkedinbot/i, /embedly/i, /quora link preview/i,
  /showyoubot/i, /outbrain/i, /pinterest/i, /slackbot/i, /vkShare/i,
  /W3C_Validator/i, /whatsapp/i, /flipboard/i, /tumblr/i, /bitlybot/i,
  /skypeuripreview/i, /nuzzel/i, /discordbot/i, /qwantify/i, /pinterestbot/i,
  /bitrix link preview/i, /xing-contenttabreceiver/i, /chrome-lighthouse/i,
  /telegrambot/i, /seznambot/i, /crawler/i, /spider/i, /bot\//i,
  /Lighthouse/i, /HeadlessChrome/i, /Puppeteer/i, /Playwright/i,
  /Selenium/i, /PhantomJS/i, /Nightmare/i, /Webdriver/i,
];

function isBot(ua) {
  if (!ua) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(ua));
}

// ============ Admin Bypass ============
function isAdminBypass(req) {
  return req.headers["x-admin-bypass"] === "true";
}

// ============ IP Hashing (SHA-256 for privacy) ============
function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex");
}

// ============ UA Parsing ============
function parseUA(ua) {
  if (!ua) return { browser: "Unknown", os: "Unknown", deviceType: "desktop" };
  let browser = "Other";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  let os = "Other";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let deviceType = "desktop";
  if (ua.includes("Mobile") || ua.includes("Android")) deviceType = "mobile";
  else if (ua.includes("iPad")) deviceType = "tablet";

  return { browser, os, deviceType };
}

// ============ JSON Parser ============
function parseJSON(str, fallback) {
  try { return typeof str === "string" ? JSON.parse(str) : (str || fallback); }
  catch { return fallback; }
}

// ============ IP Detection ============
function getClientIp(req) {
  const cf = req.headers["cf-connecting-ip"];
  if (cf && !isPrivateIp(cf)) return cf;

  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const ips = xff.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (!isPrivateIp(ip)) return ip;
    }
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp && !isPrivateIp(realIp)) return realIp;

  const remote = req.socket?.remoteAddress || req.ip || null;
  if (remote && !isPrivateIp(remote)) return remote;
  return null;
}

function isPrivateIp(ip) {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, "");
  if (clean === "127.0.0.1" || clean === "::1" || clean === "localhost") return true;
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(clean)) return true;
  if (/^(0\.|255\.255\.255\.255)/.test(clean)) return true;
  return false;
}

// ============ Geolocation (ip-api.com free fallback + ipinfo.io with token) ============
const geoCache = new Map();

async function detectLocation(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return { country: null, region: null, city: null, latitude: null, longitude: null, timezone: null };
  }
  if (geoCache.has(ip)) return geoCache.get(ip);

  const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    let loc = null;

    if (IPINFO_TOKEN) {
      try {
        const response = await fetch(`https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`, { signal: controller.signal });
        const data = await response.json();
        if (data.country) {
          loc = {
            country: data.country || null,
            region: data.region || null,
            city: data.city || null,
            latitude: data.loc?.split(",")?.[0] || null,
            longitude: data.loc?.split(",")?.[1] || null,
            timezone: data.timezone || null,
          };
        }
      } catch {}
    }

    if (!loc) {
      try {
        const response = await fetch(`https://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon,timezone`, { signal: controller.signal });
        const data = await response.json();
        if (data.status === "success" && data.country) {
          loc = {
            country: data.country || null,
            region: data.regionName || null,
            city: data.city || null,
            latitude: data.lat?.toString() || null,
            longitude: data.lon?.toString() || null,
            timezone: data.timezone || null,
          };
        }
      } catch {}
    }

    clearTimeout(timeout);

    if (loc) {
      geoCache.set(ip, loc);
      if (geoCache.size > 500) {
        const firstKey = geoCache.keys().next().value;
        geoCache.delete(firstKey);
      }
      return loc;
    }
  } catch {}
  clearTimeout(timeout);
  return { country: null, region: null, city: null, latitude: null, longitude: null, timezone: null };
}

// ============ In-memory rate limiter for track endpoint ============
const trackRateMap = new Map();
const TRACK_WINDOW_MS = 60 * 1000;
const TRACK_MAX = 30;

function trackRateLimit(req, res, next) {
  const ip = getClientIp(req) || req.ip || "unknown";
  const now = Date.now();
  const entry = trackRateMap.get(ip);
  if (!entry || now - entry.start > TRACK_WINDOW_MS) {
    trackRateMap.set(ip, { start: now, count: 1 });
    return next();
  }
  entry.count++;
  if (entry.count > TRACK_MAX) {
    return res.status(429).json({ success: false, message: "Too many requests" });
  }
  next();
}

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of trackRateMap) {
    if (now - val.start > TRACK_WINDOW_MS * 2) trackRateMap.delete(key);
  }
}, 60000);

// ============ PUBLIC: Track page view / event ============
router.post("/track", trackRateLimit, async (req, res) => {
  try {
    const { visitorId, page, event, data } = req.body;
    if (!visitorId || !page) {
      return res.status(400).json({ success: false, message: "visitorId and page required" });
    }

    const ua = req.headers["user-agent"] || "";

    if (isBot(ua)) {
      return res.json({ success: true, data: { skipped: true, reason: "bot" } });
    }
    if (isAdminBypass(req)) {
      return res.json({ success: true, data: { skipped: true, reason: "admin" } });
    }

    const { browser, os, deviceType } = parseUA(ua);
    const language = req.headers["accept-language"]?.split(",")[0]?.split(";")[0] || "en";
    const referrer = req.headers["referer"] || req.body.referrer || null;
    const screenResolution = data?.screen ? `${data.screen.width}x${data.screen.height}` : null;
    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const location = await detectLocation(ip);

    let visitor = await prisma.visitor.findFirst({ where: { visitorId } });

    if (!visitor) {
      visitor = await prisma.visitor.upsert({
        where: { visitorId },
        create: {
          visitorId,
          browser, os, deviceType, language, referrer, screenResolution,
          ipHash,
          country: location.country, region: location.region, city: location.city,
          latitude: location.latitude, longitude: location.longitude,
          timezone: location.timezone || data?.timezone || null,
          pagesVisited: JSON.stringify([page]),
          projectsViewed: JSON.stringify(data?.projectSlug ? [data.projectSlug] : []),
          skillsViewed: /skills/i.test(page),
          servicesViewed: /services/i.test(page),
          experienceViewed: /experience/i.test(page),
          educationViewed: /education/i.test(page),
          contactViewed: /contact/i.test(page),
        },
        update: {
          lastVisitAt: new Date(),
          totalVisits: { increment: 1 },
          browser, os, deviceType, language, screenResolution,
          country: location.country || undefined,
          region: location.region || undefined,
          city: location.city || undefined,
          latitude: location.latitude || undefined,
          longitude: location.longitude || undefined,
          timezone: location.timezone || data?.timezone || undefined,
          referrer,
        },
      });

      await prisma.visit.create({
        data: {
          visitorId: visitor.id,
          visitNumber: 1,
          pagesViewed: JSON.stringify([page]),
          actions: JSON.stringify(event ? [{ event, data, page, time: new Date().toISOString() }] : []),
          referrer,
        },
      });

      return res.json({ success: true, data: { isNew: true, visitorId: visitor.visitorId } });
    }

    const pages = parseJSON(visitor.pagesVisited, []);
    if (!pages.includes(page)) pages.push(page);

    const projects = parseJSON(visitor.projectsViewed, []);
    if (data?.projectSlug && !projects.includes(data.projectSlug)) projects.push(data.projectSlug);

    const now = new Date();
    const lastVisit = new Date(visitor.lastVisitAt);
    const diffHours = (now - lastVisit) / (1000 * 60 * 60);
    const isNewSession = diffHours > 0.5;
    const newVisitCount = isNewSession ? visitor.totalVisits + 1 : visitor.totalVisits;

    await prisma.visitor.update({
      where: { id: visitor.id },
      data: {
        lastVisitAt: now,
        totalVisits: newVisitCount,
        pagesVisited: JSON.stringify(pages),
        projectsViewed: JSON.stringify(projects),
        country: location.country || visitor.country,
        region: location.region || visitor.region,
        city: location.city || visitor.city,
        latitude: location.latitude || visitor.latitude,
        longitude: location.longitude || visitor.longitude,
        timezone: location.timezone || data?.timezone || visitor.timezone,
        browser, os, deviceType, language, screenResolution,
        skillsViewed: visitor.skillsViewed || /skills/i.test(page),
        servicesViewed: visitor.servicesViewed || /services/i.test(page),
        experienceViewed: visitor.experienceViewed || /experience/i.test(page),
        educationViewed: visitor.educationViewed || /education/i.test(page),
        contactViewed: visitor.contactViewed || /contact/i.test(page),
        contactSubmissions: visitor.contactSubmissions + (event === "contact_submit" ? 1 : 0),
        resumeDownloads: visitor.resumeDownloads + (event === "resume_download" ? 1 : 0),
      },
    });

    if (isNewSession) {
      await prisma.visit.create({
        data: {
          visitorId: visitor.id,
          visitNumber: newVisitCount,
          pagesViewed: JSON.stringify([page]),
          actions: JSON.stringify(event ? [{ event, data, page, time: new Date().toISOString() }] : []),
          referrer,
        },
      });
    } else {
      const currentVisit = await prisma.visit.findFirst({
        where: { visitorId: visitor.id },
        orderBy: { startedAt: "desc" },
      });
      if (currentVisit) {
        const vPages = parseJSON(currentVisit.pagesViewed, []);
        if (!vPages.includes(page)) vPages.push(page);
        const vActions = parseJSON(currentVisit.actions, []);
        if (event) vActions.push({ event, data, page, time: new Date().toISOString() });
        const duration = Math.floor((now - new Date(currentVisit.startedAt)) / 1000);
        await prisma.visit.update({
          where: { id: currentVisit.id },
          data: { pagesViewed: JSON.stringify(vPages), actions: JSON.stringify(vActions), duration },
        });
      }
    }

    res.json({ success: true, data: { isNew: false, visitorId: visitor.visitorId } });
  } catch (error) {
    console.error("Track error:", error);
    res.status(500).json({ success: false, message: "Failed to track" });
  }
});

// ============ PUBLIC: Start session ============
router.post("/session/start", async (req, res) => {
  try {
    const { visitorId } = req.body;
    if (!visitorId) return res.status(400).json({ success: false, message: "visitorId required" });
    if (isAdminBypass(req)) return res.json({ success: true });

    const visitor = await prisma.visitor.findFirst({ where: { visitorId } });
    if (!visitor) return res.json({ success: true });

    const now = new Date();
    const lastVisit = new Date(visitor.lastVisitAt);
    const diffHours = (now - lastVisit) / (1000 * 60 * 60);

    if (diffHours > 0.5) {
      await prisma.visit.create({
        data: {
          visitorId: visitor.id,
          visitNumber: visitor.totalVisits + 1,
          startedAt: now,
          pagesViewed: JSON.stringify([]),
          actions: JSON.stringify([]),
        },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Session start error:", error);
    res.status(500).json({ success: false, message: "Failed to start session" });
  }
});

// ============ PUBLIC: End session ============
router.post("/session/end", async (req, res) => {
  try {
    const { visitorId, duration } = req.body;
    if (!visitorId) return res.status(400).json({ success: false, message: "visitorId required" });
    if (isAdminBypass(req)) return res.json({ success: true });

    const visitor = await prisma.visitor.findFirst({ where: { visitorId } });
    if (!visitor) return res.json({ success: true });

    await prisma.visitor.update({
      where: { id: visitor.id },
      data: { totalTimeSpent: { increment: duration || 0 } },
    });

    const visit = await prisma.visit.findFirst({
      where: { visitorId: visitor.id },
      orderBy: { startedAt: "desc" },
    });
    if (visit) {
      await prisma.visit.update({
        where: { id: visit.id },
        data: { endedAt: new Date(), duration: duration || visit.duration },
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to end session" });
  }
});

// ============ ADMIN: Dashboard stats ============
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const where = { isBot: false };
    const now = new Date();

    const totalVisitors = await prisma.visitor.count({ where });
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const onlineNow = await prisma.visitor.count({ where: { isBot: false, lastVisitAt: { gte: oneHourAgo } } });

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const uniqueToday = await prisma.visitor.count({ where: { isBot: false, lastVisitAt: { gte: todayStart } } });

    const totalPageViews = await prisma.visit.count();
    const totalVisitsResult = await prisma.visitor.aggregate({ where, _sum: { totalVisits: true, totalTimeSpent: true } });
    const totalVisits = totalVisitsResult._sum.totalVisits || 0;
    const totalTime = totalVisitsResult._sum.totalTimeSpent || 0;
    const avgDuration = totalVisitors > 0 ? Math.round(totalTime / totalVisitors) : 0;

    const visitors = await prisma.visitor.findMany({ where, select: { totalVisits: true } });
    const returningVisitors = visitors.filter((v) => v.totalVisits > 1).length;

    // Breakdowns
    const allVisitors = await prisma.visitor.findMany({
      where,
      select: { country: true, city: true, browser: true, os: true, deviceType: true },
    });
    const countryCounts = {};
    const cityCounts = {};
    const browserCounts = {};
    const osCounts = {};
    const deviceCounts = {};
    for (const v of allVisitors) {
      if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
      if (v.city) cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;
      if (v.deviceType) deviceCounts[v.deviceType] = (deviceCounts[v.deviceType] || 0) + 1;
    }

    const sortEntries = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

    // Top pages
    const allPages = await prisma.visitor.findMany({ where, select: { pagesVisited: true } });
    const pageCount = {};
    for (const v of allPages) {
      const pages = parseJSON(v.pagesVisited, []);
      for (const p of pages) pageCount[p] = (pageCount[p] || 0) + 1;
    }

    // Top projects
    const allProjects = await prisma.visitor.findMany({ where, select: { projectsViewed: true } });
    const projCount = {};
    for (const v of allProjects) {
      const projs = parseJSON(v.projectsViewed, []);
      for (const p of projs) projCount[p] = (projCount[p] || 0) + 1;
    }

    // Totals
    const totalDownloads = await prisma.visitor.aggregate({ where, _sum: { resumeDownloads: true } });
    const totalSubmissions = await prisma.visitor.aggregate({ where, _sum: { contactSubmissions: true } });

    // Growth data (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const growthVisitors = await prisma.visitor.findMany({
      where: { isBot: false, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const dailyGrowth = {};
    for (const v of growthVisitors) {
      const day = v.createdAt.toISOString().split("T")[0];
      dailyGrowth[day] = (dailyGrowth[day] || 0) + 1;
    }
    const growth = Object.entries(dailyGrowth).map(([date, count]) => ({ date, count }));

    res.json({
      success: true,
      data: {
        totalVisitors,
        returningVisitors,
        newVisitors: totalVisitors - returningVisitors,
        uniqueToday,
        totalVisits,
        totalPageViews,
        onlineNow,
        avgDuration,
        topCountries: sortEntries(countryCounts),
        topCities: sortEntries(cityCounts),
        browsers: sortEntries(browserCounts),
        osList: sortEntries(osCounts),
        devices: sortEntries(deviceCounts),
        topPages: sortEntries(pageCount),
        topProjects: sortEntries(projCount),
        totalResumeDownloads: totalDownloads._sum.resumeDownloads || 0,
        totalContactSubmissions: totalSubmissions._sum.contactSubmissions || 0,
        growth,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// ============ ADMIN: List visitors ============
router.get("/visitors", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isBot: false };
    if (search) {
      where.OR = [
        { visitorId: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { browser: { contains: search, mode: "insensitive" } },
        { os: { contains: search, mode: "insensitive" } },
      ];
    }

    const [visitors, total] = await Promise.all([
      prisma.visitor.findMany({
        where,
        orderBy: { lastVisitAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.visitor.count({ where }),
    ]);

    res.json({
      success: true,
      data: visitors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Visitors list error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visitors" });
  }
});

// ============ ADMIN: Visitor profile ============
router.get("/visitors/:visitorId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const visitor = await prisma.visitor.findFirst({
      where: { visitorId: req.params.visitorId },
      include: { visits: { orderBy: { startedAt: "desc" } } },
    });
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    res.json({ success: true, data: visitor });
  } catch (error) {
    console.error("Visitor profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visitor" });
  }
});

// ============ ADMIN: Delete single visitor ============
router.delete("/visitors/:visitorId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const visitor = await prisma.visitor.findFirst({ where: { visitorId: req.params.visitorId } });
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    await prisma.visit.deleteMany({ where: { visitorId: visitor.id } });
    await prisma.visitor.delete({ where: { id: visitor.id } });
    res.json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    console.error("Delete visitor error:", error);
    res.status(500).json({ success: false, message: "Failed to delete visitor" });
  }
});

// ============ ADMIN: Delete ALL analytics data ============
router.delete("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const confirm = req.body.confirm;
    if (confirm !== "DELETE_ALL_ANALYTICS") {
      return res.status(400).json({
        success: false,
        message: "Send { confirm: 'DELETE_ALL_ANALYTICS' } to confirm",
      });
    }

    await prisma.visit.deleteMany();
    await prisma.visitor.deleteMany();

    res.json({ success: true, message: "All analytics data deleted" });
  } catch (error) {
    console.error("Delete all analytics error:", error);
    res.status(500).json({ success: false, message: "Failed to delete analytics data" });
  }
});

export default router;
