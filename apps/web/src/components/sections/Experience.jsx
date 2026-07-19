import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase } from "lucide-react";
import { AnimatedSection } from "../AnimatedSection";

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
    <AnimatedSection id="experience" className="py-32 relative overflow-hidden" aria-label="Experience section">
      <div className="absolute inset-0 bg-cyan-950/20" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.p
          className="text-center text-sm font-medium text-cyan-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Career
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400">Experience</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-cyan-600 rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-slate-400 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          My professional journey
        </motion.p>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-px bg-cyan-500/50"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {experiences.map((exp, idx) => {
            const techs = exp.technologies ? JSON.parse(exp.technologies) : [];
            const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            return (
              <motion.div
                key={exp.id}
                className="relative pl-20 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <motion.div
                  className={`absolute left-4 w-9 h-9 rounded-full border-2 flex items-center justify-center ${
                    exp.isCurrent
                      ? "bg-cyan-500/20 border-cyan-500"
                      : "bg-slate-800 border-slate-600"
                  }`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                >
                  <Briefcase size={16} className={exp.isCurrent ? "text-cyan-400" : "text-slate-400"} />
                </motion.div>

                <motion.div
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
                  whileHover={{ x: 5, borderColor: "rgba(34,211,238,0.2)" }}
                >
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
                      {techs.map((tech, ti) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: ti * 0.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
