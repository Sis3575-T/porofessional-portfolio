import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "shared";
import http from "http";

const router = express.Router();
const prisma = new PrismaClient();

function parseUA(ua) {
  if (!ua) return { browser: "Unknown", os: "Unknown", deviceType: "desktop" };
  let browser = "Other";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

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

function parseJSON(str, fallback) {
  try { return typeof str === "string" ? JSON.parse(str) : (str || fallback); }
  catch { return fallback; }
}

const geoCache = new Map();

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || req.ip || null;
}

async function detectLocation(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return { country: null, region: null, city: null, timezone: null };
  }
  if (geoCache.has(ip)) return geoCache.get(ip);

  try {
    const data = await new Promise((resolve, reject) => {
      const req = http.get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`, { timeout: 2000 }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          try { resolve(JSON.parse(body)); } catch { reject(new Error("parse error")); }
        });
      });
      req.on("error", reject);
      req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    });

    if (data.status === "success") {
      const loc = { country: data.country || null, region: data.regionName || null, city: data.city || null, timezone: data.timezone || null };
      geoCache.set(ip, loc);
      if (geoCache.size > 500) {
        const firstKey = geoCache.keys().next().value;
        geoCache.delete(firstKey);
      }
      return loc;
    }
  } catch {}
  const fallback = { country: null, region: null, city: null, timezone: null };
  geoCache.set(ip, fallback);
  return fallback;
}

// ============ PUBLIC: Track page view / event ============
router.post("/track", async (req, res) => {
  try {
    const { visitorId, page, event, data } = req.body;
    if (!visitorId || !page) {
      return res.status(400).json({ success: false, message: "visitorId and page required" });
    }

    const ua = req.headers["user-agent"] || "";
    const { browser, os, deviceType } = parseUA(ua);
    const language = req.headers["accept-language"]?.split(",")[0]?.split(";")[0] || "en";
    const referrer = req.headers["referer"] || req.body.referrer || null;
    const ip = getClientIp(req);
    const location = await detectLocation(ip);

    let visitor = await prisma.visitor.findFirst({ where: { visitorId } });

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          visitorId,
          browser, os, deviceType, language, referrer,
          country: location.country, region: location.region, city: location.city,
          timezone: location.timezone || req.body.timezone || null,
          pagesVisited: JSON.stringify([page]),
          projectsViewed: JSON.stringify(data?.projectSlug ? [data.projectSlug] : []),
          skillsViewed: page === "/#skills" || page === "/skills",
          servicesViewed: page === "/#services" || page === "/services",
          experienceViewed: page === "/#experience" || page === "/experience",
          educationViewed: page === "/#education" || page === "/education",
          contactViewed: page === "/#contact" || page === "/contact",
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
        country: visitor.country || location.country,
        region: visitor.region || location.region,
        city: visitor.city || location.city,
        timezone: visitor.timezone || location.timezone || req.body.timezone,
        skillsViewed: visitor.skillsViewed || page.includes("skills"),
        servicesViewed: visitor.servicesViewed || page.includes("services"),
        experienceViewed: visitor.experienceViewed || page.includes("experience"),
        educationViewed: visitor.educationViewed || page.includes("education"),
        contactViewed: visitor.contactViewed || page.includes("contact"),
        contactSubmissions: visitor.contactSubmissions + (event === "contact_submit" ? 1 : 0),
        resumeDownloads: visitor.resumeDownloads + (event === "resume_download" ? 1 : 0),
      },
    });

    if (isNewSession) {
      const visitNumber = newVisitCount;
      await prisma.visit.create({
        data: {
          visitorId: visitor.id,
          visitNumber,
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

// ============ PUBLIC: End session ============
router.post("/session/end", async (req, res) => {
  try {
    const { visitorId, duration } = req.body;
    if (!visitorId) return res.status(400).json({ success: false, message: "visitorId required" });

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
        data: {
          endedAt: new Date(),
          duration: duration || visit.duration,
        },
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
    const totalVisitors = await prisma.visitor.count();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const onlineNow = await prisma.visitor.count({ where: { lastVisitAt: { gte: oneHourAgo } } });

    const visitors = await prisma.visitor.findMany({ select: { totalVisits: true, totalTimeSpent: true } });
    const returningVisitors = visitors.filter((v) => v.totalVisits > 1).length;
    const totalVisits = visitors.reduce((sum, v) => sum + v.totalVisits, 0);
    const totalTime = visitors.reduce((sum, v) => sum + v.totalTimeSpent, 0);
    const avgDuration = totalVisitors > 0 ? Math.round(totalTime / totalVisitors) : 0;

    const countryCounts = {};
    const cityCounts = {};
    const browserCounts = {};
    const osCounts = {};
    const deviceCounts = {};
    const allVisitors = await prisma.visitor.findMany({
      select: { country: true, city: true, browser: true, os: true, deviceType: true },
    });
    for (const v of allVisitors) {
      if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
      if (v.city) cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;
      if (v.deviceType) deviceCounts[v.deviceType] = (deviceCounts[v.deviceType] || 0) + 1;
    }

    const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
    const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
    const browsers = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
    const osList = Object.entries(osCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
    const devices = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

    const allPages = await prisma.visitor.findMany({ select: { pagesVisited: true } });
    const pageCount = {};
    for (const v of allPages) {
      const pages = parseJSON(v.pagesVisited, []);
      for (const p of pages) pageCount[p] = (pageCount[p] || 0) + 1;
    }
    const topPages = Object.entries(pageCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

    const allProjects = await prisma.visitor.findMany({ select: { projectsViewed: true } });
    const projCount = {};
    for (const v of allProjects) {
      const projs = parseJSON(v.projectsViewed, []);
      for (const p of projs) projCount[p] = (projCount[p] || 0) + 1;
    }
    const topProjects = Object.entries(projCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

    const totalDownloads = await prisma.visitor.aggregate({ _sum: { resumeDownloads: true } });
    const totalSubmissions = await prisma.visitor.aggregate({ _sum: { contactSubmissions: true } });

    res.json({
      success: true,
      data: {
        totalVisitors,
        returningVisitors,
        newVisitors: totalVisitors - returningVisitors,
        totalVisits,
        onlineNow,
        avgDuration,
        topCountries,
        topCities,
        browsers,
        osList,
        devices,
        topPages,
        topProjects,
        totalResumeDownloads: totalDownloads._sum.resumeDownloads || 0,
        totalContactSubmissions: totalSubmissions._sum.contactSubmissions || 0,
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

    const where = {};
    if (search) {
      where.OR = [
        { visitorId: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { browser: { contains: search, mode: "insensitive" } },
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
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
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
    res.status(500).json({ success: false, message: "Failed to fetch visitor" });
  }
});

// ============ ADMIN: Delete visitor ============
router.delete("/visitors/:visitorId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const visitor = await prisma.visitor.findFirst({ where: { visitorId: req.params.visitorId } });
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    await prisma.visit.deleteMany({ where: { visitorId: visitor.id } });
    await prisma.visitor.delete({ where: { id: visitor.id } });
    res.json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete visitor" });
  }
});

export default router;
