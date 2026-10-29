import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  portfolioAPI, heroAPI, aboutAPI, skillsAPI, servicesAPI,
  experienceAPI, educationAPI, projectsAPI, testimonialsAPI, settingsAPI
} from "../services/api";

export const PortfolioContext = createContext();

const CACHE_KEY = "portfolio_cache_v2";
const CACHE_TTL = 5 * 1000; // 5 seconds

const defaultHero = {
  name: "Sisay Temesgen",
  title: "Full-Stack Developer & AI Learner",
  greeting: "Hello, I'm",
  description: "I build modern, responsive, and high-performance web applications with clean code, robust APIs, and user-centered design.",
  primaryCTA: "View Projects",
  secondaryCTA: "Contact Me",
  profileImage: "/hero-developer.png",
  enabled: true,
};

const defaultAbout = {
  name: "Sisay Temesgen",
  location: "Bahir Dar, Ethiopia",
  email: "sisay3575@gmail.com",
  phone: "0935756054",
  availability: "Available for projects",
  biography: "I am a dedicated full-stack developer and AI learner focused on building fast, accessible, and resilient web applications. With hands-on expertise across JavaScript, React, Node.js, Express, MongoDB, and PostgreSQL, I engineer clean APIs, intuitive interfaces, and efficient databases.",
  summary: "Specialized in JavaScript, React, Node.js, Express, MongoDB, and PostgreSQL. Passionate about AI integration and scalable software architectures.",
  yearsOfExperience: 3,
  profileImage: "/sisay-portrait.jpg",
  enabled: true,
};

const defaultSettings = {
  siteTitle: "Sisay Temesgen | Full-Stack Developer & AI Learner",
  siteDescription: "Professional portfolio of Sisay Temesgen, a full-stack developer and AI learner specializing in modern web applications with React, Node.js, PostgreSQL, and REST APIs.",
  contactEmail: "sisay3575@gmail.com",
  contactPhone: "0935756054",
  socialLinks: JSON.stringify({
    github: "https://github.com/Sis3575-T",
    linkedin: "https://www.linkedin.com/in/sisay-temesgen-412290447/",
    telegram: "https://t.me/sisaytem",
    twitter: "https://twitter.com",
  }),
  hero3dConfig: JSON.stringify({ mode: "office", autoRotate: true, autoRotateSpeed: 0.3, mouseInteraction: true }),
  sectionVisibility: JSON.stringify({
    hero: true, about: true, skills: true, services: true,
    experience: true, education: true, projects: true,
    testimonials: true, contact: true, footer: true,
  }),
};

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

  const [hero, setHero] = useState(cached?.hero ?? defaultHero);
  const [about, setAbout] = useState(cached?.about ?? defaultAbout);
  const [skills, setSkills] = useState(cached?.skills ?? []);
  const [services, setServices] = useState(cached?.services ?? []);
  const [experiences, setExperiences] = useState(cached?.experiences ?? []);
  const [education, setEducation] = useState(cached?.education ?? []);
  const [projects, setProjects] = useState(cached?.projects ?? []);
  const [testimonials, setTestimonials] = useState(cached?.testimonials ?? []);
  const [settings, setSettings] = useState(cached?.settings ?? defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    // Try consolidated endpoint first in 1 single network request
    try {
      const res = await portfolioAPI.get({ headers: { "Cache-Control": "no-cache" } });
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        if (d.hero) setHero(d.hero);
        if (d.about) setAbout(d.about);
        if (Array.isArray(d.skills)) setSkills(d.skills);
        if (Array.isArray(d.services)) setServices(d.services);
        if (Array.isArray(d.experiences)) setExperiences(d.experiences);
        if (Array.isArray(d.education)) setEducation(d.education);
        if (Array.isArray(d.projects)) setProjects(d.projects);
        if (Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
        if (d.settings) setSettings(d.settings);

        saveCache({
          hero: d.hero || defaultHero,
          about: d.about || defaultAbout,
          skills: d.skills || [],
          services: d.services || [],
          experiences: d.experiences || [],
          education: d.education || [],
          projects: d.projects || [],
          testimonials: d.testimonials || [],
          settings: d.settings || defaultSettings,
        });

        setIsFetching(false);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Consolidated endpoint unavailable, falling back to individual calls:", err?.message);
    }

    // Fallback: Individual endpoint requests
    try {
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
      if (heroRes.status === "fulfilled" && heroRes.value.data.data) {
        const v = heroRes.value.data.data;
        setHero(v);
        data.hero = v;
      }
      if (aboutRes.status === "fulfilled" && aboutRes.value.data.data) {
        const v = aboutRes.value.data.data;
        setAbout(v);
        data.about = v;
      }
      if (skillsRes.status === "fulfilled") {
        const v = Array.isArray(skillsRes.value.data.data) ? skillsRes.value.data.data : [];
        setSkills(v);
        data.skills = v;
      }
      if (servicesRes.status === "fulfilled") {
        const v = Array.isArray(servicesRes.value.data.data) ? servicesRes.value.data.data : [];
        setServices(v);
        data.services = v;
      }
      if (expRes.status === "fulfilled") {
        const v = Array.isArray(expRes.value.data.data) ? expRes.value.data.data : [];
        setExperiences(v);
        data.experiences = v;
      }
      if (eduRes.status === "fulfilled") {
        const v = Array.isArray(eduRes.value.data.data) ? eduRes.value.data.data : [];
        setEducation(v);
        data.education = v;
      }
      if (projRes.status === "fulfilled") {
        const v = Array.isArray(projRes.value.data.data) ? projRes.value.data.data : [];
        setProjects(v);
        data.projects = v;
      }
      if (testRes.status === "fulfilled") {
        const v = Array.isArray(testRes.value.data.data) ? testRes.value.data.data : [];
        setTestimonials(v);
        data.testimonials = v;
      }
      if (settingsRes.status === "fulfilled" && settingsRes.value.data.data) {
        const v = settingsRes.value.data.data;
        setSettings(v);
        data.settings = v;
      }

      saveCache(data);

      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount === results.length) {
        setError("Failed to load portfolio data");
      }
    } catch (err) {
      setError("Failed to load portfolio data");
      console.error(err);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // 1. BroadcastChannel listener for real-time cross-tab updates from admin dashboard
    let channel;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("portfolio_updates");
        channel.onmessage = () => {
          try { localStorage.removeItem(CACHE_KEY); } catch {}
          fetchAll();
        };
      }
    } catch {}

    // 2. Storage event listener (fallback for cross-tab sync)
    const handleStorage = (e) => {
      if (e.key === "portfolio_sync_trigger") {
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        fetchAll();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Tab visibility listener: automatically refresh when returning to tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchAll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [fetchAll]);

  const hasData = useMemo(() => ({
    hero: !!hero,
    about: !!about,
    skills: skills.length > 0,
    services: services.length > 0,
    experience: experiences.length > 0,
    education: education.length > 0,
    projects: projects.length > 0,
    testimonials: testimonials.length > 0,
  }), [hero, about, skills, services, experiences, education, projects, testimonials]);

  const value = useMemo(() => ({
    hero, about, skills, services, experiences,
    education, projects, testimonials, settings,
    loading, isFetching, error, refetch: fetchAll, hasData,
  }), [hero, about, skills, services, experiences, education, projects, testimonials, settings, loading, isFetching, error, fetchAll, hasData]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
