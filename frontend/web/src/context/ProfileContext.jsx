import { createContext, useContext, useMemo } from "react";
import { usePortfolio } from "./PortfolioContext";

const ProfileContext = createContext();

function getInitials(name) {
  if (!name) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function ProfileProvider({ children }) {
  const portfolio = usePortfolio();

  const value = useMemo(() => {
    const { hero, about, settings, loading, refetch } = portfolio;

    const name = about?.name || hero?.name || "Sisay Temesgen";
    const email = about?.email || settings?.contactEmail || "sisay@example.com";
    const initials = getInitials(name) || "ST";
    const siteTitle = settings?.siteTitle || "Sisay Temesgen";
    const socialLinks = (() => {
      try {
        const raw = settings?.socialLinks || hero?.socialLinks;
        if (!raw) return {};
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch { return {}; }
    })();

    return { name, email, initials, siteTitle, socialLinks, about, hero, settings, loading, refetch };
  }, [portfolio]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export { getInitials };
