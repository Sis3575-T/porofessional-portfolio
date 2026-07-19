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

const categoryColors = {
  FRONTEND: "#22d3ee",
  BACKEND: "#22c55e",
  DATABASE: "#eab308",
  DEVOPS: "#a855f7",
  TOOLS: "#94a3b8",
  LANGUAGES: "#ef4444",
  SOFT_SKILLS: "#2dd4bf",
  OTHER: "#9ca3af",
};

function SkillIcon({ name, color }) {
  const key = name?.toLowerCase() || "";
  const iconColor = color || "#22d3ee";

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

  const categories = ["ALL", ...new Set(skills.map((s) => s.category))];
  const filtered = activeCategory === "ALL" ? skills : skills.filter((s) => s.category === activeCategory);

  if (loading) {
    return (
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="flex gap-4 justify-center">
              {[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-slate-800 rounded-full" />)}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection id="skills" className="py-32 relative overflow-hidden" aria-label="Skills section">
      <div className="absolute inset-0 bg-cyan-950/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.p
          className="text-center text-sm font-medium text-cyan-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Expertise
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          My <span className="text-cyan-400">Skills</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-cyan-600 rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-slate-400 mb-12 max-w-2xl mx-auto"
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
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
              }`}
            >
              {cat === "ALL" ? "All" : categoryLabels[cat] || cat}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((skill, i) => {
            const dotColor = categoryColors[skill.category] || "#94a3b8";
            return (
              <AnimatedCard key={skill.id} className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all hover:-translate-y-1" index={i}>
                <div className="flex items-center gap-3">
                  <SkillIcon name={skill.name} color={dotColor} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">{skill.name}</h3>
                    <span className="text-xs text-slate-500">{categoryLabels[skill.category] || skill.category}</span>
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
