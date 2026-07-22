import { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { AnimatedSection, AnimatedCard } from "../AnimatedSection";

const categoryLabels = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  DEVOPS: "DevOps",
  TOOLS: "Tools",
  LANGUAGES: "Languages",
  SOFT_SKILLS: "Soft Skills",
  OTHER: "Other",
};

const defaultSkills = [
  { id: "skill-react", name: "React", category: "FRONTEND" },
  { id: "skill-tailwind", name: "Tailwind CSS", category: "FRONTEND" },
  { id: "skill-html", name: "HTML5", category: "FRONTEND" },
  { id: "skill-css", name: "CSS3", category: "FRONTEND" },
  { id: "skill-js", name: "JavaScript", category: "LANGUAGES" },
  { id: "skill-ts", name: "TypeScript", category: "LANGUAGES" },
  { id: "skill-node", name: "Node.js", category: "BACKEND" },
  { id: "skill-express", name: "Express", category: "BACKEND" },
  { id: "skill-php", name: "PHP", category: "BACKEND" },
  { id: "skill-java", name: "Java", category: "BACKEND" },
  { id: "skill-mongodb", name: "MongoDB", category: "DATABASE" },
  { id: "skill-postgres", name: "PostgreSQL", category: "DATABASE" },
  { id: "skill-mysql", name: "MySQL", category: "DATABASE" },
  { id: "skill-docker", name: "Docker", category: "DEVOPS" },
  { id: "skill-git", name: "Git", category: "TOOLS" },
  { id: "skill-github", name: "GitHub", category: "TOOLS" },
  { id: "skill-figma", name: "Figma", category: "TOOLS" },
  { id: "skill-ai", name: "AI & Automation", category: "OTHER" },
  { id: "skill-collab", name: "Team Collaboration", category: "SOFT_SKILLS" },
  { id: "skill-problem", name: "Problem Solving", category: "SOFT_SKILLS" },
];

function SkillIcon({ name, accentColor = "#94a3b8" }) {
  const key = name?.toLowerCase() || "";
  const iconColor = accentColor;

  if (key.includes("react")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <circle cx="20" cy="20" r="3.5" fill={iconColor} />
        <ellipse cx="20" cy="20" rx="14" ry="5" stroke={iconColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        <ellipse cx="20" cy="20" rx="14" ry="5" stroke={iconColor} strokeWidth="1.2" fill="none" opacity="0.6" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="14" ry="5" stroke={iconColor} strokeWidth="1.2" fill="none" opacity="0.6" transform="rotate(120 20 20)" />
      </svg>
    );
  }

  if (key.includes("html")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M13 12h14l-1.5 16-5.5 2-5.5-2L13 12z" fill={iconColor} opacity="0.18" />
        <path d="M15 14l10 1-1 11-4 1.5-4-1.5-1-4" stroke={iconColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes("css")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M12 11h16l-1.4 16-6.6 3-6.6-3L12 11z" fill={iconColor} opacity="0.16" />
        <path d="M14 14h12l-.8 10-5.2 2-5.2-2-.8-4" stroke={iconColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes("node")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M20 4l14 8v16l-14 8-14-8V12l14-8z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}15`} />
        <circle cx="20" cy="20" r="3" fill={iconColor} opacity="0.5" />
        <path d="M20 7v26M6 12l28 16" stroke={iconColor} strokeWidth="0.8" opacity="0.3" />
      </svg>
    );
  }

  if (key.includes("typescript") || key === "ts") {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="4" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <text x="20" y="26" textAnchor="middle" fill={iconColor} fontSize="16" fontWeight="bold" fontFamily="monospace">TS</text>
      </svg>
    );
  }

  if (key.includes("javascript") || key === "js") {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="4" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <text x="20" y="26" textAnchor="middle" fill={iconColor} fontSize="16" fontWeight="bold" fontFamily="monospace">JS</text>
      </svg>
    );
  }

  if (key.includes("python")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M16 4h8v4h-8z" fill={iconColor} opacity="0.7" />
        <path d="M16 32h8v4h-8z" fill={iconColor} opacity="0.7" />
        <rect x="12" y="8" width="16" height="24" rx="3" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <circle cx="17" cy="13" r="1" fill={iconColor} />
        <circle cx="23" cy="27" r="1" fill={iconColor} />
      </svg>
    );
  }

  if (key.includes("docker")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="4" y="18" width="32" height="14" rx="2" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <rect x="8" y="22" width="4" height="4" rx="0.5" fill={iconColor} opacity="0.5" />
        <rect x="14" y="22" width="4" height="4" rx="0.5" fill={iconColor} opacity="0.5" />
        <rect x="20" y="22" width="4" height="4" rx="0.5" fill={iconColor} opacity="0.5" />
        <rect x="26" y="22" width="4" height="4" rx="0.5" fill={iconColor} opacity="0.5" />
        <path d="M10 18V12h4v6" stroke={iconColor} strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  if (key.includes("mongo")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M20 4c-4 10-4 18 0 32 4-14 4-22 0-32z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <circle cx="20" cy="8" r="1.5" fill={iconColor} />
      </svg>
    );
  }

  if (key.includes("postgres") || key.includes("sql")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <ellipse cx="20" cy="26" rx="14" ry="10" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}08`} />
        <path d="M20 16v14" stroke={iconColor} strokeWidth="1.5" />
        <path d="M14 20c4-2 8-2 12 0" stroke={iconColor} strokeWidth="1" opacity="0.5" />
        <rect x="18" y="8" width="4" height="10" rx="1" stroke={iconColor} strokeWidth="1" fill={`${iconColor}10`} />
      </svg>
    );
  }

  if (key.includes("figma")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M16 12c0-2 2-3 4-3s4 1 4 3c0 1.5-1 2.5-2.5 3 1.5.5 2.5 1.5 2.5 3 0 2-2 3-4 3s-4-1-4-3c0-1.5 1-2.5 2.5-3-1.5-.5-2.5-1.5-2.5-3z" fill={iconColor} opacity="0.85" />
      </svg>
    );
  }

  if (key.includes("github")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M19.5 11c-4.5 0-8.2 3.7-8.2 8.3 0 3.7 2.4 6.8 5.7 7.9.4.1.6-.2.6-.4v-1.4c-2.3.5-2.8-1-2.8-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.8 0.8 2.2.6.1-.5.3-.8.5-1-1.8-.2-3.7-.9-3.7-4.1 0-.9.3-1.7.8-2.2-.1-.2-.3-.9.1-1.9 0 0 .7-.2 2.3.8.7-.2 1.4-.3 2.1-.3.7 0 1.4.1 2.1.3 1.6-1 2.3-.8 2.3-.8.4 1 .2 1.7.1 1.9.5.5.8 1.3.8 2.2 0 3.2-1.9 3.9-3.7 4.1.3.3.6.8.6 1.5v2.3c0 .2.2.5.6.4 3.3-1.1 5.7-4.2 5.7-7.9 0-4.6-3.7-8.3-8.2-8.3z" fill={iconColor} />
      </svg>
    );
  }

  if (key.includes("git")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <circle cx="12" cy="8" r="3" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <circle cx="28" cy="20" r="3" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <circle cx="12" cy="32" r="3" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <path d="M12 11v18M14 11l13 7" stroke={iconColor} strokeWidth="1.2" />
      </svg>
    );
  }

  if (key.includes("aws")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M20 4l14 8v16l-14 8-14-8V12l14-8z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <path d="M14 22l4 4 8-8" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes("next")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}08`} />
        <text x="20" y="26" textAnchor="middle" fill={iconColor} fontSize="14" fontWeight="bold" fontFamily="monospace">N</text>
      </svg>
    );
  }

  if (key.includes("three")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <polygon points="20,6 34,30 6,30" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}10`} />
        <polygon points="20,12 29,27 11,27" stroke={iconColor} strokeWidth="0.8" fill="none" opacity="0.4" />
        <circle cx="20" cy="22" r="4" stroke={iconColor} strokeWidth="1" fill="none" />
      </svg>
    );
  }

  if (key.includes("tailwind")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M8 26c4-12 10-16 18-12-4 6-8 10-18 12z" fill={`${iconColor}20`} stroke={iconColor} strokeWidth="1" />
        <path d="M14 28c4-8 10-10 16-6-4 4-8 6-16 6z" fill={`${iconColor}15`} stroke={iconColor} strokeWidth="0.8" />
      </svg>
    );
  }

  if (key.includes("graphql")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M20 6L6 20l14 14 14-14L20 6z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}08`} />
        <path d="M12 26l16-12M12 14l16 12M20 4v4M20 32v4" stroke={iconColor} strokeWidth="1" opacity="0.5" />
      </svg>
    );
  }

  if (key.includes("firebase")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M20 36L8 24l6-18 6 12 6-12 6 18-12 12z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}08`} />
        <path d="M14 24h12M17 18l3 6 3-6" stroke={iconColor} strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }

  if (key.includes("redis")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M8 20l12-8 12 8-12 8-12-8z" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}08`} />
        <path d="M14 20l6 4 6-4" stroke={iconColor} strokeWidth="1" opacity="0.5" />
      </svg>
    );
  }

  if (key.includes("express")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <path d="M6 20c4-8 10-8 14 0" stroke={iconColor} strokeWidth="1.5" fill="none" />
        <path d="M20 20c4-8 10-8 14 0" stroke={iconColor} strokeWidth="1.5" fill="none" />
        <path d="M28 20c-2 6-6 10-8 12" stroke={iconColor} strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  if (key.includes("tailwind")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M13 28c2.5-8 6.5-10.5 12-8-2.5 3-5 5-12 8z" fill={iconColor} opacity="0.75" />
        <path d="M15.5 30c2.3-5.5 6.2-7 10.5-4.5-2.3 2.2-4.7 3.5-10.5 4.5z" fill={iconColor} opacity="0.45" />
      </svg>
    );
  }

  if (key.includes("ai") || key.includes("automation") || key.includes("machine")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <path d="M20 12l6 3v10l-6 3-6-3V15l6-3z" fill={iconColor} opacity="0.2" />
        <path d="M20 15v10M14 17l12 6M14 23l12-6" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("team") || key.includes("collaboration") || key.includes("problem") || key.includes("solving")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
        <rect x="6" y="6" width="28" height="28" rx="6" stroke={iconColor} strokeWidth="1.5" fill={`${iconColor}12`} />
        <circle cx="16" cy="18" r="3" fill={iconColor} opacity="0.8" />
        <circle cx="24" cy="18" r="3" fill={iconColor} opacity="0.8" />
        <path d="M12 28c1.5-3 4.2-4.5 8-4.5s6.5 1.5 8 4.5" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
      <circle cx="20" cy="20" r="16" stroke={iconColor} strokeWidth="1.2" fill={`${iconColor}08`} />
      <text x="20" y="26" textAnchor="middle" fill={iconColor} fontSize="17" fontWeight="bold" fontFamily="system-ui">
        {initial}
      </text>
    </svg>
  );
}

export default function Skills() {
  const { skills, loading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const skillList = skills && skills.length > 0 ? skills : defaultSkills;

  const categories = ["ALL", ...new Set(skillList.map((s) => s.category))];
  const filtered = activeCategory === "ALL" ? skillList : skillList.filter((s) => s.category === activeCategory);

  if (loading) {
    return (
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-100 rounded mx-auto" />
            <div className="flex gap-4 justify-center">
              {[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-gray-100 rounded-full" />)}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection id="skills" theme="skills" className="py-4 overflow-hidden" aria-label="Skills section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-accent-blue tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Expertise
        </motion.p>
        <motion.h2
          className="text-center text-gray-900 text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          My <span className="text-accent-blue">Skills</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-accent-blue rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-gray-400 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Technologies and tools I work with
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-accent-blue text-white shadow-lg shadow-blue-100"
                  : "bg-white/80 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat === "ALL" ? "All" : categoryLabels[cat] || cat}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((skill, i) => {
            const accentColor = skill.category === "FRONTEND" ? "#111111" : skill.category === "BACKEND" ? "#2563EB" : skill.category === "DATABASE" ? "#4B5563" : skill.category === "DEVOPS" ? "#111111" : skill.category === "TOOLS" ? "#2563EB" : skill.category === "LANGUAGES" ? "#4B5563" : skill.category === "SOFT_SKILLS" ? "#111111" : "#4B5563";
            const cardClass = "bg-white border-gray-200";
            return (
              <AnimatedCard key={skill.id} className={`group relative bg-white ${cardClass} rounded-2xl p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] hover:-translate-y-1`} index={i}>
                <div className="flex items-center gap-3">
                  <SkillIcon name={skill.name} accentColor={accentColor} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-900 transition-colors">{skill.name}</h3>
                    <span className="text-xs text-gray-400">{categoryLabels[skill.category] || skill.category}</span>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
