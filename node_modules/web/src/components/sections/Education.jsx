import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { AnimatedSection } from "../AnimatedSection";

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
    <AnimatedSection id="education" className="py-32" aria-label="Education section">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.p
          className="text-center text-sm font-medium text-cyan-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Academics
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400">Education</span>
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
          Academic background
        </motion.p>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-px bg-purple-500/50"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {education.map((edu, idx) => {
            const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            return (
              <motion.div
                key={edu.id}
                className="relative pl-20 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <motion.div
                  className="absolute left-4 w-9 h-9 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.2, type: "spring" }}
                >
                  <GraduationCap size={16} className="text-purple-400" />
                </motion.div>
                <motion.div
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
                  whileHover={{ x: 5 }}
                >
                  <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                  <p className="text-purple-400 text-sm mb-1">{edu.institution}</p>
                  <p className="text-slate-500 text-sm mb-3">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.field && <p className="text-slate-400 text-sm mb-2">{edu.field}</p>}
                  {edu.gpa && <p className="text-slate-400 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-slate-400 text-sm mt-3">{edu.description}</p>}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
