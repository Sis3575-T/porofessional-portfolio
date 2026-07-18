import { useState } from "react";
import { ExternalLink, Github, Search, ArrowRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const categoryLabels = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  MOBILE: "Mobile",
  UIUX: "UI/UX",
  AI: "AI",
  OTHER: "Other",
};

export default function Projects() {
  const { projects, loading } = usePortfolio();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const categories = ["ALL", ...new Set(projects.map((p) => p.category))];

  const filtered = projects.filter((p) => {
    const matchCategory = filter === "ALL" || p.category === filter;
    const searchLower = search.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <section id="projects" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-72 bg-slate-800 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          Featured <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          A showcase of my recent work
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
                }`}
              >
                {cat === "ALL" ? "All" : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const techs = project.technologies ? JSON.parse(project.technologies) : [];
            return (
              <div
                key={project.id}
                className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-slate-500 text-sm">{project.category}</p>
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full">
                      Featured
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-white/20 transition">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-white/20 transition">
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs text-cyan-400 font-medium">{categoryLabels[project.category]}</span>
                  <h3 className="text-lg font-semibold text-white mt-1 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {techs.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded">
                        {tech}
                      </span>
                    ))}
                    {techs.length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-500 rounded">
                        +{techs.length - 4}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/projects/${project.slug}`}
                    className="text-sm text-cyan-400 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Details <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No projects found</p>
          </div>
        )}
      </div>
    </section>
  );
}
