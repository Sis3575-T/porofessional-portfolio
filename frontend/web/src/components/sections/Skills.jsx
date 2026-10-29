import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { resolveUrl } from "../../utils/resolveUrl";

// Official branded icons for recognized skill names
const BRAND_ICONS = {
  javascript: (
    <svg className="w-4 h-4 text-[#F7DF1E]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M3 3h18v18H3V3zm14.5 13.5c-.8.8-1.9 1.2-3.1 1.2-2.3 0-3.6-1.4-3.6-3.4 0-2.3 1.5-3.5 3.8-3.5.7 0 1.4.1 2 .4v1.5c-.6-.3-1.2-.5-1.9-.5-1.3 0-2.1.7-2.1 1.9 0 1.1.7 1.8 2 1.8.7 0 1.3-.2 1.8-.5v-2.2h-2v-1.4h3.6v4.7h-.5zM7.8 17.7H6.3v-5.6h1.5v5.6z" />
    </svg>
  ),
  typescript: (
    <svg className="w-4 h-4 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-5h2v5zm0-7h-2V7h2v2.5z" />
    </svg>
  ),
  react: (
    <svg className="w-4 h-4 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.8" />
    </svg>
  ),
  "node.js": (
    <svg className="w-4 h-4 text-[#339933]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.7v10.6L12 24l10-5.7V7.7L12 2zm0 2.3l7.8 4.5v8.4L12 21.7 4.2 17.2V8.8L12 4.3z" />
    </svg>
  ),
  node: (
    <svg className="w-4 h-4 text-[#339933]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.7v10.6L12 24l10-5.7V7.7L12 2zm0 2.3l7.8 4.5v8.4L12 21.7 4.2 17.2V8.8L12 4.3z" />
    </svg>
  ),
  express: <span className="font-mono text-xs font-bold text-[#475569] dark:text-[#94A3B8]">ex</span>,
  mongodb: (
    <svg className="w-4 h-4 text-[#47A248]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5C11.5 3.5 6 9.5 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-5.5-5.5-11.5-6-13.5zm0 18c-2.2 0-4-1.8-4-4 0-3.3 3.3-7.5 4-8.8.7 1.3 4 5.5 4 8.8 0 2.2-1.8 4-4 4z" />
    </svg>
  ),
  postgresql: (
    <svg className="w-4 h-4 text-[#336791]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9 0 3.53 2.04 6.58 5 8.05v-2.29c-1.78-.96-3-2.83-3-4.76 0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.93-1.22 3.8-3 4.76v2.29c2.96-1.47 5-4.52 5-8.05 0-4.97-4.03-9-9-9z" />
    </svg>
  ),
  "html/css": (
    <svg className="w-4 h-4 text-[#E44D26]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.3 4.8H5.2l.4 4.5h12.7l-.4 4.5-5.9 1.6-5.9-1.6-.3-3.1H3.6l.5 5.5 7.9 2.2 7.9-2.2 1-11.4z" />
    </svg>
  ),
  html: (
    <svg className="w-4 h-4 text-[#E44D26]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.3 4.8H5.2l.4 4.5h12.7l-.4 4.5-5.9 1.6-5.9-1.6-.3-3.1H3.6l.5 5.5 7.9 2.2 7.9-2.2 1-11.4z" />
    </svg>
  ),
  css: (
    <svg className="w-4 h-4 text-[#264DE4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.3 4.8H5.2l.4 4.5h12.7l-.4 4.5-5.9 1.6-5.9-1.6-.3-3.1H3.6l.5 5.5 7.9 2.2 7.9-2.2 1-11.4z" />
    </svg>
  ),
  "rest apis": (
    <svg className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 17 4 4 4-4" />
    </svg>
  ),
  docker: (
    <svg className="w-4 h-4 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 1.07v3.29h2.95v-3.3H13zm-3.64 0v3.29h2.95v-3.3H9.36zm7.28 3.98v3.3h2.95v-3.3h-2.95zm-3.64 0v3.3h2.95v-3.3H13zm-3.64 0v3.3h2.95v-3.3H9.36zm-3.64 0v3.3h2.95v-3.3H5.72z" />
    </svg>
  ),
  git: (
    <svg className="w-4 h-4 text-[#F05032]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.6 10.6L10.6 2.6c.8-.8 2.1-.8 2.8 0l8 8c.8.8.8 2.1 0 2.8l-8 8c-.8.8-2.1.8-2.8 0l-8-8c-.8-.7-.8-2 0-2.8z" />
    </svg>
  ),
  python: (
    <svg className="w-4 h-4 text-[#3776AB]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-3.1 0-5 1.7-5 3.8v2.2h5v.8H5c-2.3 0-4 1.7-4 4.2 0 2.3 1.9 4 4.2 4h1.8v-2.2c0-2.1 1.9-3.8 5-3.8h5V8.8c0-2.1-1.9-3.8-5-3.8h-4V2h5z" />
    </svg>
  ),
  tailwind: (
    <svg className="w-4 h-4 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8 1.4 1.4 3 3 6.3 3 3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8-1.4-1.4-3-3-6.3-3zM6 12c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8 1.4 1.4 3 3 6.3 3 3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8-1.4-1.4-3-3-6.3-3z" />
    </svg>
  ),
};

const CATEGORIES = [
  { id: "ALL", label: "All Skills" },
  { id: "FRONTEND", label: "Frontend" },
  { id: "BACKEND", label: "Backend" },
  { id: "DATABASE", label: "Databases" },
  { id: "TOOLS", label: "Tools & AI" },
];

function getSkillIcon(skill) {
  const lower = skill.name.toLowerCase().trim();
  if (BRAND_ICONS[lower]) return BRAND_ICONS[lower];

  // If icon is image url
  if (skill.icon && (skill.icon.startsWith("http") || skill.icon.startsWith("/"))) {
    return (
      <img
        src={resolveUrl(skill.icon)}
        alt={skill.name}
        className="w-4 h-4 object-contain rounded"
        loading="lazy"
      />
    );
  }

  // Generic indicator
  return <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />;
}

export default function Skills() {
  const { skills } = usePortfolio();
  const [selectedCat, setSelectedCat] = useState("ALL");

  const databaseSkills = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    return skills.filter((s) => s.enabled !== false);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCat === "ALL") return databaseSkills;
    return databaseSkills.filter((s) => {
      if (selectedCat === "TOOLS") {
        return s.category === "TOOLS" || s.category === "AI" || s.category === "DEVOPS";
      }
      return s.category === selectedCat;
    });
  }, [databaseSkills, selectedCat]);

  return (
    <section
      id="skills"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-skills)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header matching reference */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
              My Skills
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight">
            Technologies I work with
          </p>
        </div>

        {databaseSkills.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] p-8 max-w-xl mx-auto shadow-soft-xs">
            <Code2 className="w-10 h-10 mx-auto text-[#94A3B8] mb-3 opacity-60" />
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              No Skills Found
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Skills added in the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          <motion.div
            className="rounded-[24px] p-4 sm:p-6 bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-3d"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-[#D8E5F8]/70 dark:border-[#1E293B]/70">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#246BFD] text-white shadow-soft-xs"
                        : "bg-[#EDF4FD] dark:bg-[#111827] text-[#52607A] dark:text-[#94A3B8] border border-[#D8E5F8] dark:border-[#1E293B] hover:border-[#246BFD]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Chips Grid */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {filteredSkills.map((tech) => (
                <div
                  key={tech.id || tech.name}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EDF4FD]/70 dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-xs sm:text-sm font-semibold text-[#14213D] dark:text-[#F8FAFC] shadow-soft-xs hover:border-[#246BFD]/60 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="shrink-0 flex items-center justify-center">
                    {getSkillIcon(tech)}
                  </span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}