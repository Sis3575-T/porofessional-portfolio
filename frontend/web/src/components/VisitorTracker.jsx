import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "../hooks/useAnalytics";

// VisitorTracker is a lightweight wrapper around useAnalytics
// It's included in public layout only - admin layout never mounts it
export default function VisitorTracker() {
  const { trackPage } = useAnalytics();
  return null;
}
