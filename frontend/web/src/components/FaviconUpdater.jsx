import { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { resolveUrl } from "../utils/resolveUrl";

export default function FaviconUpdater() {
  const { settings } = usePortfolio();

  useEffect(() => {
    if (!settings?.logo) return;

    const logoUrl = resolveUrl(settings.logo);
    const faviconLinks = document.querySelectorAll('link[rel="icon"]');

    faviconLinks.forEach((link) => {
      if (link.type === "image/svg+xml") {
        link.href = logoUrl;
      }
    });

    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.href = logoUrl;
    }
  }, [settings?.logo]);

  return null;
}