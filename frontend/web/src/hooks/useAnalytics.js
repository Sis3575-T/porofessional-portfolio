import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:10000").replace(/\/+$/, "");
const VISITOR_ID_KEY = "portfolio_visitor_id";
const SESSION_START_KEY = "portfolio_session_start";
const EXCLUDE_KEY = "portfolio_analytics_exclude";

function isAdminBypass() {
  try {
    return localStorage.getItem(EXCLUDE_KEY) === "true";
  } catch {
    return false;
  }
}

function getAdminHeaders() {
  return isAdminBypass() ? { "x-admin-bypass": "true" } : {};
}

// Generate a stable fingerprint hash asynchronously in idle time
async function generateFingerprint() {
  const parts = [];

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("portfolio-fp", 2, 15);
      parts.push(canvas.toDataURL());
    }
  } catch {}

  // WebGL renderer
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        parts.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        parts.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
      }
      parts.push(gl.getParameter(gl.VERSION));
    }
  } catch {}

  // Screen properties
  parts.push(`${screen.width}x${screen.height}`);
  parts.push(`${screen.colorDepth}`);
  parts.push(`${window.devicePixelRatio || 1}`);

  // Navigator properties
  parts.push(navigator.language || "");
  parts.push(navigator.platform || "");
  parts.push(navigator.hardwareConcurrency || "");
  parts.push(navigator.maxTouchPoints || "");
  parts.push(navigator.cookieEnabled ? "1" : "0");

  // Timezone
  try {
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
  } catch {}

  const raw = parts.join("|||");
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

let cachedVisitorId = null;

function getVisitorId() {
  if (cachedVisitorId) return cachedVisitorId;

  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (id && id.startsWith("fp-")) {
      cachedVisitorId = id;
      return id;
    }
  } catch {}

  const fallback = `fp-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  cachedVisitorId = fallback;
  try {
    localStorage.setItem(VISITOR_ID_KEY, fallback);
  } catch {}

  // Compute refined fingerprint in idle time without blocking UI
  const scheduleIdle = typeof window !== "undefined" && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb) => setTimeout(cb, 2500);

  scheduleIdle(() => {
    generateFingerprint()
      .then((hash) => {
        const fpId = `fp-${hash}`;
        try {
          localStorage.setItem(VISITOR_ID_KEY, fpId);
        } catch {}
        cachedVisitorId = fpId;
      })
      .catch(() => {});
  });

  return fallback;
}

function getSessionStart() {
  try {
    let start = sessionStorage.getItem(SESSION_START_KEY);
    if (!start) {
      start = Date.now().toString();
      sessionStorage.setItem(SESSION_START_KEY, start);
    }
    return parseInt(start);
  } catch {
    return Date.now();
  }
}

function getScreenInfo() {
  return {
    width: typeof screen !== "undefined" ? screen.width : 1920,
    height: typeof screen !== "undefined" ? screen.height : 1080,
    colorDepth: typeof screen !== "undefined" ? screen.colorDepth : 24,
    pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
  };
}

export function useAnalytics() {
  const location = useLocation();
  const trackedPages = useRef(new Set());
  const sessionStart = useRef(getSessionStart());

  const trackPage = useCallback(async (page, event, data) => {
    if (isAdminBypass()) return;
    try {
      const visitorId = getVisitorId();
      await axios.post(`${API_URL}/api/v1/analytics/track`, {
        visitorId,
        page,
        event,
        data: { ...data, screen: getScreenInfo(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || null,
      }, { headers: getAdminHeaders(), timeout: 5000 });
    } catch {
      // Silently fail - analytics should never break user experience
    }
  }, []);

  const trackEvent = useCallback(async (event, data) => {
    if (isAdminBypass()) return;
    try {
      const visitorId = getVisitorId();
      const page = window.location.hash || window.location.pathname;
      await axios.post(`${API_URL}/api/v1/analytics/track`, {
        visitorId,
        page,
        event,
        data: { ...data, screen: getScreenInfo() },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }, { headers: getAdminHeaders(), timeout: 5000 });
    } catch {}
  }, []);

  const endSession = useCallback(async () => {
    if (isAdminBypass()) return;
    try {
      const visitorId = getVisitorId();
      const duration = Math.floor((Date.now() - sessionStart.current) / 1000);
      await axios.post(`${API_URL}/api/v1/analytics/session/end`, {
        visitorId,
        duration,
      }, { headers: getAdminHeaders(), timeout: 3000 });
    } catch {}
  }, []);

  // Track route changes
  useEffect(() => {
    const page = location.pathname + (location.hash || "");
    if (!trackedPages.current.has(page)) {
      trackedPages.current.add(page);
      trackPage(page);
    }
  }, [location, trackPage]);

  // Session end on unload
  useEffect(() => {
    const handleBeforeUnload = () => endSession();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") endSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endSession]);

  return { trackPage, trackEvent, endSession, visitorId: getVisitorId() };
}

export { getVisitorId, isAdminBypass };
