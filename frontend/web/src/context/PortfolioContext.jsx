import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { heroAPI, aboutAPI, skillsAPI, servicesAPI, experienceAPI, educationAPI, projectsAPI, testimonialsAPI, settingsAPI } from "../services/api";

export const PortfolioContext = createContext();

const CACHE_KEY = "portfolio_cache";
const CACHE_TTL = 5 * 60 * 1000;

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.ts > CACHE_TTL) return null;
    return cached.data;
  } catch { return null; }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export function PortfolioProvider({ children }) {
  const cached = loadCache();

  const [hero, setHero] = useState(cached?.hero ?? null);
  const [about, setAbout] = useState(cached?.about ?? null);
  const [skills, setSkills] = useState(cached?.skills ?? []);
  const [services, setServices] = useState(cached?.services ?? []);
  const [experiences, setExperiences] = useState(cached?.experiences ?? []);
  const [education, setEducation] = useState(cached?.education ?? []);
  const [projects, setProjects] = useState(cached?.projects ?? []);
  const [testimonials, setTestimonials] = useState(cached?.testimonials ?? []);
  const [settings, setSettings] = useState(cached?.settings ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const results = await Promise.allSettled([
        heroAPI.get(),
        aboutAPI.get(),
        skillsAPI.getAll(),
        servicesAPI.getAll(),
        experienceAPI.getAll(),
        educationAPI.getAll(),
        projectsAPI.getAll({ limit: 50 }),
        testimonialsAPI.getAll(),
        settingsAPI.get(),
      ]);

      const [heroRes, aboutRes, skillsRes, servicesRes, expRes, eduRes, projRes, testRes, settingsRes] = results;

      const data = {};
      if (heroRes.status === "fulfilled") { const v = heroRes.value.data.data; setHero(v); data.hero = v; }
      if (aboutRes.status === "fulfilled") { const v = aboutRes.value.data.data; setAbout(v); data.about = v; }
      if (skillsRes.status === "fulfilled") { const v = Array.isArray(skillsRes.value.data.data) ? skillsRes.value.data.data : []; setSkills(v); data.skills = v; }
      if (servicesRes.status === "fulfilled") { const v = Array.isArray(servicesRes.value.data.data) ? servicesRes.value.data.data : []; setServices(v); data.services = v; }
      if (expRes.status === "fulfilled") { const v = Array.isArray(expRes.value.data.data) ? expRes.value.data.data : []; setExperiences(v); data.experiences = v; }
      if (eduRes.status === "fulfilled") { const v = Array.isArray(eduRes.value.data.data) ? eduRes.value.data.data : []; setEducation(v); data.education = v; }
      if (projRes.status === "fulfilled") { const v = Array.isArray(projRes.value.data.data) ? projRes.value.data.data : []; setProjects(v); data.projects = v; }
      if (testRes.status === "fulfilled") { const v = Array.isArray(testRes.value.data.data) ? testRes.value.data.data : []; setTestimonials(v); data.testimonials = v; }
      if (settingsRes.status === "fulfilled") { const v = settingsRes.value.data.data; setSettings(v); data.settings = v; }

      saveCache(data);

      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount === results.length) {
        setError("Failed to load portfolio data");
      } else if (failedCount > 0) {
        console.warn(`${failedCount} API endpoints failed to load`);
      }
    } catch (err) {
      setError("Failed to load portfolio data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <PortfolioContext.Provider
      value={{
        hero, about, skills, services, experiences,
        education, projects, testimonials, settings,
        loading, error, refetch: fetchAll,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
