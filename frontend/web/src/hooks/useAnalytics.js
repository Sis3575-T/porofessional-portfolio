import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const VISITOR_ID_KEY = "portfolio_visitor_id";
const SESSION_START_KEY = "portfolio_session_start";
const EXCLUDE_KEY = "portfolio_analytics_exclude";

function isAdminBypass() {
  return localStorage.getItem(EXCLUDE_KEY) === "true";
}

function getAdminHeaders() {
  return isAdminBypass() ? { "x-admin-bypass": "true" } : {};
}

// Generate a stable fingerprint hash from browser properties
async function generateFingerprint() {
  const parts = [];

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("portfolio-fp", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("portfolio-fp", 4, 17);
    parts.push(canvas.toDataURL());
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
  parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "");

  // Font detection
  try {
    const testFonts = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Palatino", "Garamond", "Comic Sans MS", "Impact", "Lucida Console"];
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.left = "-9999px";
    span.style.fontSize = "72px";
    span.innerHTML = "mmmmmmmmmmlli";
    document.body.appendChild(span);
    const baseWidthPx = span.offsetWidth;
    let fontList = "";
    for (const font of testFonts) {
      span.style.fontFamily = `'${font}', monospace`;
      if (span.offsetWidth !== baseWidthPx) fontList += font;
    }
    document.body.removeChild(span);
    parts.push(fontList);
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

  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (id && id.startsWith("fp-")) {
    cachedVisitorId = id;
    return id;
  }

  // Generate async, fall back to UUID
  generateFingerprint()
    .then((hash) => {
      const fpId = `fp-${hash}`;
      localStorage.setItem(VISITOR_ID_KEY, fpId);
      cachedVisitorId = fpId;
    })
    .catch(() => {
      const fallback = `fp-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(VISITOR_ID_KEY, fallback);
      cachedVisitorId = fallback;
    });

  if (!id) {
    id = `fp-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  cachedVisitorId = id;
  return id;
}

function getSessionStart() {
  let start = sessionStorage.getItem(SESSION_START_KEY);
  if (!start) {
    start = Date.now().toString();
    sessionStorage.setItem(SESSION_START_KEY, start);
  }
  return parseInt(start);
}

function getScreenInfo() {
  return {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

export function useAnalytics() {
  const location = useLocation();
  const trackedPages = useRef(new Set());
  const sessionStart = useRef(getSessionStart());
  const hasTrackedCurrentPage = useRef(false);

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
    } catch (err) {
      // Silently fail - analytics should never break the app
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
    } catch (err) {}
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
    } catch (err) {}
  }, []);

  // Track route changes
  useEffect(() => {
    const page = location.pathname + (location.hash || "");
    if (!trackedPages.current.has(page)) {
      trackedPages.current.add(page);
      trackPage(page);
    }
    hasTrackedCurrentPage.current = true;
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
      endSession();
    };
  }, [endSession]);

  return { trackPage, trackEvent, endSession, visitorId: getVisitorId() };
}

export { getVisitorId, isAdminBypass };
