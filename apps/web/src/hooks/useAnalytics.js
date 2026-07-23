import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const VISITOR_ID_KEY = "portfolio_visitor_id";
const SESSION_START_KEY = "portfolio_session_start";

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
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

export function useAnalytics() {
  const location = useLocation();
  const trackedPages = useRef(new Set());
  const sessionStart = useRef(getSessionStart());

  const trackPage = useCallback(async (page, event, data) => {
    try {
      const visitorId = getVisitorId();
      await axios.post(`${API_URL}/api/v1/analytics/track`, {
        visitorId,
        page,
        event,
        data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || null,
      });
    } catch (err) {
      console.warn("Analytics track failed:", err.message);
    }
  }, []);

  const trackEvent = useCallback(async (event, data) => {
    try {
      const visitorId = getVisitorId();
      const page = window.location.hash || window.location.pathname;
      await axios.post(`${API_URL}/api/v1/analytics/track`, {
        visitorId,
        page,
        event,
        data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } catch (err) {
      console.warn("Analytics event failed:", err.message);
    }
  }, []);

  const endSession = useCallback(async () => {
    try {
      const visitorId = getVisitorId();
      const duration = Math.floor((Date.now() - sessionStart.current) / 1000);
      await axios.post(`${API_URL}/api/v1/analytics/session/end`, {
        visitorId,
        duration,
      });
    } catch (err) {
      console.warn("Analytics session end failed:", err.message);
    }
  }, []);

  useEffect(() => {
    const page = location.pathname + (location.hash || "");
    if (!trackedPages.current.has(page)) {
      trackedPages.current.add(page);
      trackPage(page);
    }
  }, [location, trackPage]);

  useEffect(() => {
    const handleBeforeUnload = () => endSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      endSession();
    };
  }, [endSession]);

  return { trackPage, trackEvent, endSession, visitorId: getVisitorId() };
}

export { getVisitorId };
