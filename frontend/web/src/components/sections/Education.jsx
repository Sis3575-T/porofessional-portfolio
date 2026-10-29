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

export default function Education() {
  const { education } = usePortfolio();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const educationItems = useMemo(
    () => (Array.isArray(education) ? education : []),
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

        {/* Grid / Card Layout or Empty State */}
        {educationItems.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] p-8 max-w-xl mx-auto shadow-soft-xs">
            <GraduationCap className="w-10 h-10 mx-auto text-[#94A3B8] mb-3 opacity-60" />
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              No Education Found
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Education records added in the admin dashboard will appear here.
            </p>
          </div>
        ) : (
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
                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight truncate">
                          {edu.institution}
                        </h3>
                        <p className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] truncate">
                          {edu.degree}
                        </p>
                        {edu.field && (
                          <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate mt-0.5">
                            {edu.field}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-[#475569] dark:text-[#94A3B8]">
                      {startDateStr && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                          <Calendar size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                          <span>
                            {startDateStr} – {endDateStr}
                          </span>
                        </span>
                      )}
                      {edu.location && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                          <MapPin size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                          <span>{edu.location}</span>
                        </span>
                      )}
                      {edu.gpa && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                          <Award size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
                          <span>GPA: {edu.gpa}</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {edu.description && (
                      <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] mb-4 font-normal">
                        {edu.description}
                      </p>
                    )}

                    {/* Key Highlights / Achievements */}
                    {achievements.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2 flex items-center gap-1.5">
                          <Award size={12} /> Key Highlights
                        </h4>
                        <ul className="space-y-1.5">
                          {achievements.map((ach, achIdx) => (
                            <li
                              key={achIdx}
                              className="text-xs text-[#0F172A] dark:text-[#F8FAFC] flex items-start gap-2"
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={10} strokeWidth={3} />
                              </span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Relevant Coursework */}
                    {courses.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2 flex items-center gap-1.5">
                          <BookOpen size={12} /> Relevant Coursework
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {courses.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#F8FAFC] dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certificate Link */}
                  {edu.certificateUrl && (
                    <div className="pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B] mt-2">
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
        )}
      </div>
    </section>
  );
}