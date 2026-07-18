import { createContext, useContext, useState, useEffect } from "react";
import { heroAPI, aboutAPI, skillsAPI, servicesAPI, experienceAPI, educationAPI, projectsAPI, testimonialsAPI, settingsAPI, contactAPI } from "../services/api";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
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

      if (heroRes.status === "fulfilled") setHero(heroRes.value.data.data);
      if (aboutRes.status === "fulfilled") setAbout(aboutRes.value.data.data);
      if (skillsRes.status === "fulfilled") setSkills(skillsRes.value.data.data);
      if (servicesRes.status === "fulfilled") setServices(servicesRes.value.data.data);
      if (expRes.status === "fulfilled") setExperiences(expRes.value.data.data);
      if (eduRes.status === "fulfilled") setEducation(eduRes.value.data.data);
      if (projRes.status === "fulfilled") setProjects(projRes.value.data.data);
      if (testRes.status === "fulfilled") setTestimonials(testRes.value.data.data);
      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value.data.data);
    } catch (err) {
      setError("Failed to load portfolio data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

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
