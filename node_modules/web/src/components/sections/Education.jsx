import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { AnimatedSection } from "../AnimatedSection";

const defaultEducation = [
  {
    id: "edu-1",
    degree: "BSc. Computer Science",
    institution: "University of Applied Sciences",
    startDate: "2021-01-01",
    endDate: "2025-01-01",
    field: "Software Engineering, Algorithms, and Emerging Technologies",
    gpa: "3.7/4.0",
    description:
      "Focused on software engineering fundamentals, distributed systems, and AI-driven product development.",
  },
  {
    id: "edu-2",
    degree: "Professional Development",
    institution: "Self-directed learning",
    startDate: "2022-01-01",
    endDate: "2026-01-01",
    field: "Frontend, Backend, and Modern Web Architecture",
    description:
      "Built practical projects around React, Node.js, databases, deployment, and product design.",
  },
];

export default function Education() {
  const { education, loading } = usePortfolio();
  const educationItems = education && education.length > 0 ? education : defaultEducation;

  if (loading) {
    return (
      <section id="education" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-100 rounded mx-auto" />
            {[1].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection id="education" theme="education" className="py-4" aria-label="Education section">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-accent-blue tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Academics
        </motion.p>
        <motion.h2
          className="text-center text-gray-900 text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          My <span className="text-accent-blue">Education</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-accent-blue rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-gray-500 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Academic background
        </motion.p>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-px bg-blue-200"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {educationItems.map((edu, idx) => {
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
                  className="absolute left-4 w-9 h-9 rounded-full bg-accent-blue border-2 border-white flex items-center justify-center shadow-lg shadow-blue-100"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.2, type: "spring" }}
                >
                  <GraduationCap size={16} className="text-white" />
                </motion.div>
                <motion.div
                  className="bg-white border border-gray-200 rounded-2xl p-6 transition-all"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)" }}
                  whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.06), 0 16px 36px rgba(0,0,0,0.08)" }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600 text-sm mb-1">{edu.institution}</p>
                  <p className="text-gray-400 text-sm mb-3">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.field && <p className="text-gray-500 text-sm mb-2">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-500 text-sm mt-3">{edu.description}</p>}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
