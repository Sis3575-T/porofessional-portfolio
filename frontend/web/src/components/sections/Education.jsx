import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, MapPin, Calendar, Award, BookOpen, ExternalLink, Check } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { resolveUrl } from "../../utils/resolveUrl";

function parseJSON(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return [];
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const defaultEducation = [
  {
    id: "edu-1",
    institution: "Bahir Dar University",
    degree: "B.Sc. in Computer Science",
    field: "Computer Science & Engineering",
    description: "Rigorous academic study focusing on algorithms, distributed databases, software architecture, object-oriented design, web application development, and foundational artificial intelligence.",
    location: "Bahir Dar, Ethiopia",
    startDate: "2021-10-01",
    endDate: null,
    isCurrent: true,
    achievements: JSON.stringify([
      "Consistently strong academic performance in data structures, algorithms, and database systems",
      "Lead developer on university software engineering team projects",
      "Active participant in competitive programming and technology workshops",
    ]),
    courses: JSON.stringify([
      "Data Structures & Algorithms",
      "Database Systems & Design",
      "Software Engineering & Architecture",
      "Computer Networks",
      "Artificial Intelligence Fundamentals",
      "Web Technologies",
    ]),
  },
];

export default function Education() {
  const { education } = usePortfolio();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const educationItems = useMemo(
    () => (education && education.length > 0 ? education : defaultEducation),
    [education]
  );

  return (
    <section
      id="education"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-education)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
              Academic Background
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight">
            Education
          </p>
        </div>

        {/* Grid / Card Layout */}
        <div className={`grid gap-6 ${educationItems.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
          {educationItems.map((edu, index) => {
            const achievements = parseJSON(edu.achievements);
            const courses = parseJSON(edu.courses);
            const startDateStr = formatDate(edu.startDate);
            const endDateStr = edu.isCurrent ? "Present" : formatDate(edu.endDate);

            return (
              <motion.div
                key={edu.id || index}
                className="bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-soft-xs hover:border-[#2563EB]/50 hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0 overflow-hidden">
                      {edu.logo ? (
                        <img
                          src={resolveUrl(edu.logo)}
                          alt={edu.institution}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <GraduationCap size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-[#3B82F6] mt-0.5">
                        {edu.institution}
                      </p>
                      {edu.field && (
                        <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                          {edu.field}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                    {(startDateStr || endDateStr) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                        <Calendar size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                        <span>
                          {startDateStr} — {endDateStr}
                        </span>
                      </span>
                    )}
                    {edu.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                        <MapPin size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                        <span>{edu.location}</span>
                      </span>
                    )}
                    {edu.gpa && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/15 text-[#1E293B] dark:text-[#F8FAFC] font-bold border border-[#E2E8F0] dark:border-[#1E293B]">
                        <Award size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                        <span>GPA: {edu.gpa}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] mb-5 font-normal">
                      {edu.description}
                    </p>
                  )}

                  {/* Key Highlights */}
                  {achievements.length > 0 && (
                    <div className="mb-5 pt-3.5 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2.5 flex items-center gap-1.5">
                        <Award size={13} /> Key Highlights
                      </h4>
                      <ul className="space-y-1.5">
                        {achievements.map((item, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} strokeWidth={3} />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Coursework */}
                  {courses.length > 0 && (
                    <div className="mb-4 pt-3.5 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2.5 flex items-center gap-1.5">
                        <BookOpen size={13} /> Relevant Coursework
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {courses.map((course, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#F8FAFC] dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B]"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Certificate Link */}
                {edu.certificateUrl && (
                  <div className="pt-3.5 border-t border-[#E2E8F0]/70 dark:border-[#1E293B] mt-2">
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>View Credential / Certificate</span>
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
