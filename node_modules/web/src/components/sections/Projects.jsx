import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { resolveUrl } from "../../utils/resolveUrl";

export default function Projects() {
  const { projects, loading } = usePortfolio();
  const [selected, setSelected] = useState(null);

  const projectList = projects || [];

  if (loading) {
    return (
      <section id="projects" className="py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 bg-gray-100 rounded mx-auto" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-4 relative overflow-hidden" style={{ background: "var(--section-projects)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center text-gray-900 text-4xl font-bold mb-10">
          Projects
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {projectList.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)" }}
            >
              {/* Image */}
              <div className="h-56 bg-gray-100 overflow-hidden">
                {project.thumbnail ? (
                  <img
                    src={resolveUrl(project.thumbnail)}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ contentVisibility: "auto" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-5xl font-bold text-gray-200">{project.title.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Always visible buttons */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                {project.shortDescription && (
                  <p className="text-white text-sm text-center px-6 max-w-xs leading-relaxed drop-shadow-lg">
                    {project.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm transition hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm transition hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={14} /> GitHub
                  </a>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:scale-105"
                >
                  View Details
                </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
            <motion.div
              className="relative bg-white rounded-2xl max-w-lg w-full p-8"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-3 pr-8">{selected.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{selected.description}</p>
              {selected.technologies && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(selected.technologies)
                    ? selected.technologies
                    : (() => { try { const p = JSON.parse(selected.technologies); return Array.isArray(p) ? p : []; } catch { return []; } })()
                  ).map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {selected.liveUrl && (
                  <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:brightness-110 transition">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
                {selected.githubUrl && (
                  <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">
                    <Github size={16} /> GitHub
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
