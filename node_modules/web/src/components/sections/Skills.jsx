import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

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
  FRONTEND: "from-cyan-500 to-blue-500",
  BACKEND: "from-green-500 to-emerald-500",
  DATABASE: "from-yellow-500 to-orange-500",
  DEVOPS: "from-purple-500 to-pink-500",
  TOOLS: "from-slate-400 to-slate-500",
  LANGUAGES: "from-red-500 to-rose-500",
  SOFT_SKILLS: "from-teal-400 to-cyan-400",
  OTHER: "from-gray-400 to-gray-500",
};

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
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          My <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Skills</span>
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Technologies and tools I work with
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
              }`}
            >
              {cat === "ALL" ? "All" : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                  <span className="text-xs text-slate-500">{categoryLabels[skill.category]}</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {skill.proficiency}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category]} transition-all duration-1000`}
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
