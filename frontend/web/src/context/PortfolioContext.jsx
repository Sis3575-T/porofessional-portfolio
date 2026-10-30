import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  portfolioAPI, heroAPI, aboutAPI, skillsAPI, servicesAPI,
  experienceAPI, educationAPI, projectsAPI, testimonialsAPI, settingsAPI
} from "../services/api";

export const PortfolioContext = createContext();

const CACHE_KEY = "portfolio_cache_v2";
const CACHE_TTL = 30 * 1000; // 30 seconds

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

const defaultProjects = [
  {
    id: "cmvtwnbak00028dclz6y9y0vn",
    title: "Abay Car Rental System",
    slug: "abay-car-rental-system",
    description: "Abay Car Rental system is a user-friendly web application that allows customers to browse available vehicles, compare prices, and book cars online with ease. It provides secure booking management, customer accounts, and an admin dashboard for managing vehicles, reservations, payments, and customer.",
    shortDescription: "Complete vehicle booking platform with customer accounts and admin vehicle/fleet management.",
    thumbnail: "/uploads/media_1793299777754_y4o6uxh.png",
    category: "FULLSTACK",
    technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
    features: JSON.stringify(["Vehicle Catalog", "Online Booking", "Customer Portal", "Fleet Management"]),
    liveUrl: "https://frontend-snowy-ten-96.vercel.app/",
    githubUrl: "https://github.com/Sis3575-T",
    featured: true,
    order: 0,
    enabled: true,
  },
  {
    id: "cmvtwst1600048dclp6ftw56k",
    title: "Abay Grand Hotel",
    slug: "abay-grand-hotel",
    description: "Elegant hotel booking and management system with stunning design and seamless user experience. Features include room reservations, availability calendar, guest management, and online booking with real-time updates. A modern hospitality solution built for luxury accommodations.",
    shortDescription: "Modern luxury hotel booking system with real-time room reservations and guest management.",
    thumbnail: "/uploads/media_1793300382530_9fr1dq0.png",
    category: "FULLSTACK",
    technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
    features: JSON.stringify(["Room Booking", "Availability Calendar", "Guest Management", "Online Payments"]),
    liveUrl: "https://abay-grand-hotel-1.vercel.app/",
    githubUrl: "https://github.com/Sis3575-T/Abay-Grand_Hotels",
    featured: true,
    order: 1,
    enabled: true,
  },
];

const defaultSkills = [
  { id: "s-1", name: "React", category: "FRONTEND", proficiency: 95, order: 0, enabled: true },
  { id: "s-2", name: "TypeScript", category: "LANGUAGES", proficiency: 90, order: 1, enabled: true },
  { id: "s-3", name: "Node.js", category: "BACKEND", proficiency: 88, order: 2, enabled: true },
  { id: "s-4", name: "PostgreSQL", category: "DATABASE", proficiency: 85, order: 3, enabled: true },
  { id: "s-5", name: "Docker", category: "DEVOPS", proficiency: 80, order: 4, enabled: true },
  { id: "s-6", name: "Tailwind CSS", category: "FRONTEND", proficiency: 92, order: 5, enabled: true },
  { id: "s-7", name: "Next.js", category: "FRONTEND", proficiency: 90, order: 6, enabled: true },
  { id: "s-8", name: "Prisma", category: "BACKEND", proficiency: 87, order: 7, enabled: true },
  { id: "s-9", name: "Git", category: "TOOLS", proficiency: 90, order: 8, enabled: true },
  { id: "s-10", name: "Python", category: "LANGUAGES", proficiency: 75, order: 9, enabled: true },
  { id: "s-11", name: "MongoDB", category: "DATABASE", proficiency: 78, order: 10, enabled: true },
  { id: "s-12", name: "AWS", category: "DEVOPS", proficiency: 72, order: 11, enabled: true },
  { id: "s-13", name: "Communication", category: "SOFT_SKILLS", proficiency: 90, order: 12, enabled: true },
  { id: "s-14", name: "Problem Solving", category: "SOFT_SKILLS", proficiency: 95, order: 13, enabled: true },
];

const defaultServices = [
  {
    id: "serv-1",
    title: "Full Stack Web Development",
    description: "Complete web applications from database to user interface, built with modern frameworks and best practices.",
    features: JSON.stringify(["React/Next.js Frontend", "Node.js Backend", "PostgreSQL Database", "Responsive Design"]),
    enabled: true,
    order: 0,
  },
  {
    id: "serv-2",
    title: "REST & GraphQL API Development",
    description: "Robust, secure, and scalable APIs engineered with comprehensive documentation and authentication.",
    features: JSON.stringify(["RESTful Architecture", "Authentication & Authorization", "Database Design", "Performance Optimization"]),
    enabled: true,
    order: 1,
  },
  {
    id: "serv-3",
    title: "UI/UX & Frontend Engineering",
    description: "Converting designs into responsive, accessible, pixel-perfect web interfaces with modern animations.",
    features: JSON.stringify(["Responsive Layouts", "Tailwind CSS & Framer Motion", "Cross-browser Compatibility", "Accessibility"]),
    enabled: true,
    order: 2,
  },
  {
    id: "serv-4",
    title: "Cloud Deployment & DevOps",
    description: "Seamless deployment pipelines, containerization, and reliable serverless cloud architectures.",
    features: JSON.stringify(["Docker Containerization", "CI/CD Pipelines", "Vercel & Render Cloud Hosting", "Database Management"]),
    enabled: true,
    order: 3,
  },
];

const defaultExperiences = [
  {
    id: "exp-1",
    company: "Freelance & Open Source",
    position: "Full-Stack Developer",
    description: "Building production-grade web applications, customized client systems, and participating in modern web technology initiatives.",
    startDate: "2023-01-01",
    isCurrent: true,
    technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Docker", "Tailwind CSS"]),
    order: 0,
    enabled: true,
  },
];

const defaultEducation = [
  {
    id: "edu-1",
    institution: "Bahir Dar University",
    degree: "Bachelor of Science",
    field: "Computer Science & Engineering",
    description: "Focused on software engineering principles, full-stack architecture, algorithms, and artificial intelligence.",
    startDate: "2020-09-01",
    endDate: "2024-07-01",
    isCurrent: false,
    location: "Bahir Dar, Ethiopia",
    technologies: JSON.stringify(["JavaScript", "Python", "SQL", "Data Structures", "Algorithms"]),
    order: 0,
    enabled: true,
  },
];

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
  const [skills, setSkills] = useState(
    Array.isArray(cached?.skills) && cached.skills.length > 0 ? cached.skills : defaultSkills
  );
  const [services, setServices] = useState(
    Array.isArray(cached?.services) && cached.services.length > 0 ? cached.services : defaultServices
  );
  const [experiences, setExperiences] = useState(
    Array.isArray(cached?.experiences) && cached.experiences.length > 0 ? cached.experiences : defaultExperiences
  );
  const [education, setEducation] = useState(
    Array.isArray(cached?.education) && cached.education.length > 0 ? cached.education : defaultEducation
  );
  const [projects, setProjects] = useState(
    Array.isArray(cached?.projects) && cached.projects.length > 0 ? cached.projects : defaultProjects
  );
  const [testimonials, setTestimonials] = useState(cached?.testimonials ?? []);
  const [settings, setSettings] = useState(cached?.settings ?? defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const retryTimeoutRef = useRef(null);

  const fetchAll = useCallback(async (retryCount = 0) => {
    setIsFetching(true);
    setError(null);

    // Try consolidated endpoint first in 1 single network request
    try {
      const res = await portfolioAPI.get({ headers: { "Cache-Control": "no-cache" } });
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        if (d.hero) setHero(d.hero);
        if (d.about) setAbout(d.about);
        if (Array.isArray(d.skills) && d.skills.length > 0) setSkills(d.skills);
        if (Array.isArray(d.services) && d.services.length > 0) setServices(d.services);
        if (Array.isArray(d.experiences) && d.experiences.length > 0) setExperiences(d.experiences);
        if (Array.isArray(d.education) && d.education.length > 0) setEducation(d.education);
        if (Array.isArray(d.projects) && d.projects.length > 0) setProjects(d.projects);
        if (Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
        if (d.settings) setSettings(d.settings);

        saveCache({
          hero: d.hero || defaultHero,
          about: d.about || defaultAbout,
          skills: (Array.isArray(d.skills) && d.skills.length > 0) ? d.skills : defaultSkills,
          services: (Array.isArray(d.services) && d.services.length > 0) ? d.services : defaultServices,
          experiences: (Array.isArray(d.experiences) && d.experiences.length > 0) ? d.experiences : defaultExperiences,
          education: (Array.isArray(d.education) && d.education.length > 0) ? d.education : defaultEducation,
          projects: (Array.isArray(d.projects) && d.projects.length > 0) ? d.projects : defaultProjects,
          testimonials: d.testimonials || [],
          settings: d.settings || defaultSettings,
        });

        setIsFetching(false);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Consolidated endpoint unavailable, trying individual calls:", err?.message);
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
      let hasSuccessfulData = false;

      if (heroRes.status === "fulfilled" && heroRes.value.data?.data) {
        setHero(heroRes.value.data.data);
        data.hero = heroRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (aboutRes.status === "fulfilled" && aboutRes.value.data?.data) {
        setAbout(aboutRes.value.data.data);
        data.about = aboutRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value.data?.data) && skillsRes.value.data.data.length > 0) {
        setSkills(skillsRes.value.data.data);
        data.skills = skillsRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (servicesRes.status === "fulfilled" && Array.isArray(servicesRes.value.data?.data) && servicesRes.value.data.data.length > 0) {
        setServices(servicesRes.value.data.data);
        data.services = servicesRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (expRes.status === "fulfilled" && Array.isArray(expRes.value.data?.data) && expRes.value.data.data.length > 0) {
        setExperiences(expRes.value.data.data);
        data.experiences = expRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (eduRes.status === "fulfilled" && Array.isArray(eduRes.value.data?.data) && eduRes.value.data.data.length > 0) {
        setEducation(eduRes.value.data.data);
        data.education = eduRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (projRes.status === "fulfilled" && Array.isArray(projRes.value.data?.data) && projRes.value.data.data.length > 0) {
        setProjects(projRes.value.data.data);
        data.projects = projRes.value.data.data;
        hasSuccessfulData = true;
      }
      if (testRes.status === "fulfilled" && Array.isArray(testRes.value.data?.data)) {
        setTestimonials(testRes.value.data.data);
        data.testimonials = testRes.value.data.data;
      }
      if (settingsRes.status === "fulfilled" && settingsRes.value.data?.data) {
        setSettings(settingsRes.value.data.data);
        data.settings = settingsRes.value.data.data;
      }

      if (hasSuccessfulData) {
        saveCache(data);
      } else if (retryCount < 2) {
        // Render free-tier cold starts may take 20-40s; retry with backoff
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          fetchAll(retryCount + 1);
        }, 4000 * (retryCount + 1));
      }
    } catch (err) {
      console.warn("Individual API calls error:", err?.message);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

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

    const handleStorage = (e) => {
      if (e.key === "portfolio_sync_trigger") {
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        fetchAll();
      }
    };
    window.addEventListener("storage", handleStorage);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchAll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      if (channel) channel.close();
      clearTimeout(retryTimeoutRef.current);
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
