import { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useProfile } from "../context/ProfileContext";
import { resolveUrl } from "../utils/resolveUrl";

function generateInitialsFavicon(initials, size = 64) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#78649D"/>
    <text x="50%" y="50%" dy=".1em" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="${size * 0.45}" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function SEO({ title, description }) {
  const { settings } = usePortfolio();
  const { initials } = useProfile();

  useEffect(() => {
    const siteTitle = settings?.siteTitle || "Sisay Temesgen - Full-Stack Developer and AI Learner";
    const siteDesc =
      description ||
      settings?.metaDescription ||
      settings?.siteDescription ||
      "Professional portfolio of Sisay Temesgen, a full-stack developer and AI learner specializing in modern web applications with React, Node.js, Express, PostgreSQL, and REST APIs.";
    const siteUrl = settings?.siteUrl || "https://sisay-temesgen.vercel.app";

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
    setMeta("keywords", settings?.metaKeywords || "developer, portfolio, fullstack, react, nodejs, postgresql, ai learner, ethiopia");
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
    const faviconUrl = settings?.favicon ? resolveUrl(settings.favicon) : generateInitialsFavicon(initials || "ST");
    link.href = faviconUrl;
  }, [title, description, settings, initials]);

  return null;
}
