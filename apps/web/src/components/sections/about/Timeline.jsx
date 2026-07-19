import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Timeline({ experiences }) {
  if (!experiences || experiences.length === 0) return null;

  const sorted = [...experiences]
    .filter((e) => e.enabled !== false)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-transparent" />

      <div className="space-y-8">
        {sorted.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative pl-12 group"
          >
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors z-10">
              {exp.logo ? (
                <img src={exp.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <Briefcase size={16} className="text-cyan-400" />
              )}
            </div>

            <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 group-hover:border-slate-700/60 transition-all">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="text-xs text-cyan-400 font-mono">
                  {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <h4 className="text-base font-semibold text-white">{exp.position}</h4>
              <p className="text-sm text-cyan-400/80 mb-2">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{exp.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
