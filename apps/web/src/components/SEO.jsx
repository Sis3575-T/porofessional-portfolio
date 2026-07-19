import { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export default function SEO({ title, description }) {
  const { settings } = usePortfolio();

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
  }, [title, description, settings]);

  return null;
}
