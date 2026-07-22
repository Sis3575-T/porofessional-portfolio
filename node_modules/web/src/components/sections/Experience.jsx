import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase } from "lucide-react";
import { AnimatedSection } from "../AnimatedSection";

const defaultExperiences = [
  {
    id: "exp-1",
    position: "Full Stack Developer",
    company: "Independent & Freelance Projects",
    startDate: "2023-01-01",
    endDate: "2026-01-01",
    isCurrent: true,
    description:
      "Building modern web experiences with React, Node.js, Express, MongoDB, and clean UI systems for startups and personal products.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  },
  {
    id: "exp-2",
    position: "MERN Stack Developer",
    company: "Product-focused development",
    startDate: "2022-01-01",
    endDate: "2024-01-01",
    isCurrent: false,
    description:
      "Developed full-stack applications with authentication, REST APIs, payment integrations, and polished dashboards.",
    technologies: ["React", "Express", "MongoDB", "JWT", "REST APIs"],
  },
  {
    id: "exp-3",
    position: "Computer Science Student",
    company: "Software engineering studies",
    startDate: "2021-01-01",
    endDate: "2025-01-01",
    isCurrent: false,
    description:
      "Studied software engineering, algorithms, and emerging technologies while building practical portfolio projects.",
    technologies: ["Algorithms", "Data Structures", "System Design", "AI"],
  },
];

export default function Experience() {
  const { experiences, loading } = usePortfolio();
  const experienceItems = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  if (loading) {
    return (
      <section id="experience" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-100 rounded mx-auto" />
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection id="experience" theme="experience" className="py-4 overflow-hidden" aria-label="Experience section">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-accent-blue tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Career
        </motion.p>
        <motion.h2
          className="text-center text-gray-900 text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          My <span className="text-accent-blue">Experience</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-accent-gray rounded-full mx-auto mt-4 mb-4"
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
          My professional journey
        </motion.p>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-px bg-blue-200"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {experienceItems.map((exp, idx) => {
            const techs = Array.isArray(exp.technologies)
              ? exp.technologies
              : exp.technologies
                ? JSON.parse(exp.technologies)
                : [];
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
                  className="absolute left-4 w-9 h-9 rounded-full border-2 flex items-center justify-center bg-accent-blue border-white shadow-lg shadow-gray-100"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                >
                  <Briefcase size={16} className="text-white" />
                </motion.div>

                <motion.div
                  className="bg-white border border-gray-200 rounded-2xl p-6 transition-all"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)" }}
                  whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.06), 0 16px 36px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {exp.isCurrent && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-accent-blue text-white rounded-full shadow-sm">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
                  <p className="text-gray-400 text-sm mb-3">
                    {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">{exp.description}</p>
                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech, ti) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1 text-xs bg-white/80 text-gray-700 rounded-full border border-gray-200"
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
