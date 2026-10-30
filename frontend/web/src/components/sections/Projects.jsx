import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, Layers, ArrowRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { resolveUrl, API_URL } from "../../utils/resolveUrl";

function parseTech(tech) {
  if (!tech) return [];
  if (Array.isArray(tech)) return tech;
  try {
    const parsed = JSON.parse(tech);
    return Array.isArray(parsed) ? parsed : [tech];
  } catch {
    return [tech];
  }
}

export default function Projects() {
  const { projects, isFetching } = usePortfolio();
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Strictly respect database projects; do not resurrect mock/deleted projects
  const projectList = Array.isArray(projects) ? projects : [];

  const categories = useMemo(() => {
    const set = new Set();
    projectList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [projectList]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "ALL") return projectList;
    return projectList.filter((p) => p.category === activeCategory);
  }, [projectList, activeCategory]);

  return (
    <section
      id="projects"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-projects)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6]">
                Featured Projects
              </h2>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Some of the projects I&apos;ve built with passion and purpose.
            </p>
          </div>

          <a
            href="https://github.com/Sis3575-T"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-[#3B82F6] hover:underline shrink-0"
          >
            <span>View All on GitHub</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#2563EB] text-white shadow-soft-xs"
                    : "bg-white dark:bg-[#161F30] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                }`}
              >
                {cat === "ALL" ? "All Projects" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeleton */}
        {isFetching && projectList.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] rounded-[24px] p-6 h-72 flex flex-col justify-between"
              >
                <div className="w-full h-36 bg-[#EDF4FD] dark:bg-[#1E293B] rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-[#EDF4FD] dark:bg-[#1E293B] rounded w-3/4" />
                  <div className="h-3 bg-[#EDF4FD] dark:bg-[#1E293B] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-[24px] bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-sm">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#D8E5F8] dark:border-[#334155] flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
              <Layers size={26} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              No Projects Found
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto mt-1.5 leading-relaxed">
              {activeCategory === "ALL"
                ? "No projects have been published yet. Projects created in the admin dashboard will appear here automatically."
                : `No projects found in category "${activeCategory}".`}
            </p>
          </div>
        ) : (
          /* 3-Column Responsive Cards Grid matching reference */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProjects.map((project) => {
              const techList = parseTech(project.technologies);
              return (
                <div
                  key={project.id}
                  className="group flex flex-col bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] rounded-[24px] overflow-hidden hover:border-[#246BFD] shadow-soft-sm hover:shadow-soft-3d hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Thumbnail / Visual Area */}
                  <div className="relative h-44 sm:h-48 w-full bg-[#F7FAFE] dark:bg-[#0B0F17] overflow-hidden border-b border-[#D8E5F8] dark:border-[#1E293B]">
                    {project.thumbnail ? (
                      <img
                        src={resolveUrl(project.thumbnail)}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          if (API_URL && !e.currentTarget.src.startsWith(API_URL)) {
                            const clean = project.thumbnail.startsWith("/") ? project.thumbnail : `/${project.thumbnail}`;
                            e.currentTarget.src = `${API_URL}${clean}`;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#475569] dark:text-[#94A3B8] bg-gradient-to-br from-[#F8FAFC] to-[#F0F4F8] dark:from-[#0B0F17] dark:to-[#111827]">
                        <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] mb-2">
                          <Layers size={20} />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center">
                          {project.title}
                        </span>
                        <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                          {project.category || "Full-Stack Project"}
                        </span>
                      </div>
                    )}

                    {/* Category Pill */}
                    {project.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-white/95 dark:bg-[#161F30]/95 text-[#14213D] dark:text-[#3B82F6] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-xs">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content matching reference */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#14213D] dark:text-[#F8FAFC] tracking-tight group-hover:text-[#246BFD] dark:group-hover:text-[#3B82F6] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] leading-relaxed line-clamp-2 font-normal">
                        {project.shortDescription || project.description}
                      </p>

                      {/* Tech Badges matching reference */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {techList.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#EDF4FD] dark:bg-[#111827] text-[#52607A] dark:text-[#94A3B8] border border-[#D8E5F8]/70 dark:border-[#1E293B]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions: View Project link matching reference */}
                    <div className="mt-5 pt-3.5 border-t border-[#D8E5F8] dark:border-[#1E293B] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </button>

                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#475569] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#3B82F6] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors"
                            title="Open Live Preview"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#475569] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#3B82F6] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors"
                            title="Source Code"
                          >
                            <Github size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#0B0F17]/60 backdrop-blur-xs"
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="pr-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6]">
                  {selected.category || "Project Details"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                  {selected.title}
                </h3>
              </div>

              <div className="mt-4 space-y-4 text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                <p>{selected.description || selected.shortDescription}</p>

                {selected.challenge && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-1">
                      Technical Challenge
                    </h4>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                      {selected.challenge}
                    </p>
                  </div>
                )}

                {selected.solution && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-1">
                      Architectural Solution
                    </h4>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                      {selected.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              {selected.technologies && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parseTech(selected.technologies).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-semibold bg-[#F8FAFC] dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-7 pt-5 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-3">
                {selected.liveUrl && (
                  <a
                    href={selected.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-soft-xs transition"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {selected.githubUrl && (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-[#F8FAFC] dark:bg-[#111827] dark:hover:bg-[#161F30] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB] text-xs sm:text-sm font-semibold rounded-2xl transition"
                  >
                    <Github size={14} /> Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
