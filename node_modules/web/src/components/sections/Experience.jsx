import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase } from "lucide-react";

export default function Experience() {
  const { experiences, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="experience" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Experience</span>
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          My professional journey
        </p>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent" />

          {experiences.map((exp, idx) => {
            const techs = exp.technologies ? JSON.parse(exp.technologies) : [];
            const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            return (
              <div key={exp.id} className="relative pl-20 pb-12 last:pb-0">
                <div className={`absolute left-4 w-9 h-9 rounded-full border-2 flex items-center justify-center ${
                  exp.isCurrent
                    ? "bg-cyan-500/20 border-cyan-500"
                    : "bg-slate-800 border-slate-600"
                }`}>
                  <Briefcase size={16} className={exp.isCurrent ? "text-cyan-400" : "text-slate-400"} />
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                  <p className="text-cyan-400 text-sm mb-2">{exp.company}</p>
                  <p className="text-slate-500 text-sm mb-3">
                    {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </p>
                  <p className="text-slate-400 text-sm mb-4">{exp.description}</p>
                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
