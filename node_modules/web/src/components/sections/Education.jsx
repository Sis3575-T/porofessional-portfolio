import { GraduationCap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function Education() {
  const { education, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="education" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            {[1].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <h2 className="text-center mb-4 text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Education</span>
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Academic background
        </p>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-cyan-500 to-transparent" />

          {education.map((edu) => {
            const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            return (
              <div key={edu.id} className="relative pl-20 pb-12 last:pb-0">
                <div className="absolute left-4 w-9 h-9 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                  <GraduationCap size={16} className="text-purple-400" />
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                  <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                  <p className="text-purple-400 text-sm mb-1">{edu.institution}</p>
                  <p className="text-slate-500 text-sm mb-3">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.field && <p className="text-slate-400 text-sm mb-2">{edu.field}</p>}
                  {edu.gpa && <p className="text-slate-400 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-slate-400 text-sm mt-3">{edu.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
