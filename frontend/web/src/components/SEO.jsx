import { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useProfile } from "../context/ProfileContext";
import { resolveUrl } from "../utils/resolveUrl";

function generateInitialsFavicon(initials, size = 64) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#2563eb"/>
    <text x="50%" y="50%" dy=".1em" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="${size * 0.45}" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function SEO({ title, description }) {
  const { settings } = usePortfolio();
  const { initials } = useProfile();

  useEffect(() => {
    const siteTitle = settings?.siteTitle || "Portfolio";
    const siteDesc = description || settings?.metaDescription || settings?.siteDescription || "Professional Portfolio";
    const siteUrl = settings?.siteUrl || window.location.origin;

    document.title = title ? `${title} | ${siteTitle}` : siteTitle;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", siteDesc);
    setMeta("keywords", settings?.metaKeywords || "");
    setMeta("og:title", title || siteTitle);
    setMeta("og:description", siteDesc);
    setMeta("og:url", siteUrl);
    setMeta("og:image", settings?.ogImage || "");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title || siteTitle);
    setMeta("twitter:description", siteDesc);

    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (settings?.favicon) {
      link.href = resolveUrl(settings.favicon);
    } else if (initials) {
      link.href = generateInitialsFavicon(initials);
    }
  }, [title, description, settings, initials]);

  return null;
}
