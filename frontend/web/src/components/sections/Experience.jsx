import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { resolveUrl } from "../../utils/resolveUrl";
import { X, ExternalLink, Building2, MapPin, Calendar, Briefcase, ChevronLeft, ChevronRight, Check } from "lucide-react";

function parseJSON(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function DetailModal({ experience, onClose }) {
  const technologies = parseJSON(experience.technologies);
  const responsibilities = parseJSON(experience.responsibilities);
  const achievements = parseJSON(experience.achievements);

  const startDate = experience.startDate
    ? new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  const endDate = experience.isCurrent
    ? "Present"
    : experience.endDate
    ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${experience.company} Experience Details`}
    >
      <div className="absolute inset-0 bg-[#0B0F17]/60 backdrop-blur-xs" />
      <motion.div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-lg overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18 }}
      >
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3.5">
              {experience.logo ? (
                <img
                  src={resolveUrl(experience.logo)}
                  alt={experience.company}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                  <Building2 size={22} />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {experience.company}
                </h3>
                <p className="text-sm font-semibold text-[#2563EB] dark:text-[#3B82F6]">
                  {experience.position}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-5 text-xs text-[#475569] dark:text-[#94A3B8]">
            {startDate && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                <Calendar size={12} className="text-[#2563EB] dark:text-[#3B82F6]" /> {startDate} – {endDate}
              </span>
            )}
            {experience.employmentType && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                <Briefcase size={12} className="text-[#2563EB] dark:text-[#3B82F6]" /> {experience.employmentType}
              </span>
            )}
            {experience.location && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold">
                <MapPin size={12} className="text-[#2563EB] dark:text-[#3B82F6]" /> {experience.location}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] mb-5 font-normal">
            {experience.description}
          </p>

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div className="mb-5 pt-4 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-3">
                Key Responsibilities
              </h4>
              <ul className="space-y-2">
                {responsibilities.map((resp, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-5 pt-4 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-3">
                Key Accomplishments
              </h4>
              <ul className="space-y-2">
                {achievements.map((ach, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="pt-4 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2.5">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Link */}
          {experience.companyUrl && (
            <div className="mt-6 pt-4 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors"
              >
                <ExternalLink size={13} />
                <span>Visit {experience.company}</span>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ExperienceCard({ experience, index, onOpen }) {
  const technologies = parseJSON(experience.technologies);
  const startDate = experience.startDate
    ? new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  const endDate = experience.isCurrent
    ? "Present"
    : experience.endDate
    ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  return (
    <div
      className="group relative rounded-3xl p-6 bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-xs hover:border-[#2563EB]/50 hover:shadow-soft transition-all flex flex-col justify-between shrink-0"
      style={{
        width: "min(340px, calc(100vw - 48px))",
        minHeight: 270,
      }}
    >
      <div>
        <div className="flex items-center gap-3.5 mb-4">
          {experience.logo ? (
            <img
              src={resolveUrl(experience.logo)}
              alt={experience.company}
              className="w-10 h-10 rounded-2xl object-cover border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6]">
              <Building2 size={20} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] truncate">
              {experience.company}
            </h3>
            <p className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] truncate">
              {experience.position}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs text-[#475569] dark:text-[#94A3B8]">
          <Calendar size={12} className="text-[#2563EB] dark:text-[#3B82F6]" />
          <span>
            {startDate} – {endDate}
          </span>
          {experience.location && (
            <>
              <span>•</span>
              <span className="truncate">{experience.location}</span>
            </>
          )}
        </div>

        <p className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-3 mb-4 leading-relaxed font-normal">
          {experience.description}
        </p>
      </div>

      <div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-0.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] font-semibold"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded text-[#2563EB] dark:text-[#3B82F6] font-bold">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpen(index)}
          className="w-full py-2.5 rounded-2xl text-xs font-semibold bg-[#F8FAFC] hover:bg-[#EFF6FF] dark:bg-[#111827] dark:hover:bg-[#161F30] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

const defaultExperiences = [
  {
    id: "exp-1",
    company: "Freelance & Independent Software Projects",
    position: "Full-Stack Developer",
    description: "Developing modern, responsive, and accessible web applications and robust REST APIs for clients and personal initiatives. Focused on clean code, performance, database architecture, and exploring AI applications.",
    startDate: "2023-01-01",
    endDate: null,
    isCurrent: true,
    employmentType: "Self-Employed",
    location: "Remote",
    technologies: JSON.stringify(["React", "JavaScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Tailwind CSS"]),
    responsibilities: JSON.stringify([
      "Architect and build responsive frontends using React and modern CSS frameworks",
      "Develop secure Node.js and Express REST APIs with data validation and authentication",
      "Design and maintain PostgreSQL and MongoDB schemas with optimized queries",
      "Collaborate with clients to define product specifications and deliver milestones on schedule",
    ]),
  },
];

export default function Experience() {
  const { experiences } = usePortfolio();
  const experienceList = experiences && experiences.length > 0 ? experiences : defaultExperiences;
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, experienceList]);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 360;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }, []);

  const handleOpen = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const activeExperience = activeIndex >= 0 ? experienceList[activeIndex] : null;

  return (
    <section
      id="experience"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-experience)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
              Track Record
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight">
            Work Experience
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group/scroll">
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-sm flex items-center justify-center text-[#1E293B] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-sm flex items-center justify-center text-[#1E293B] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-5 overflow-x-auto pb-4 scrollbar-hide ${
              experienceList.length === 1 ? "justify-center" : "px-1"
            }`}
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {experienceList.map((exp, i) => (
              <div key={exp.id || i} style={{ scrollSnapAlign: "start" }}>
                <ExperienceCard experience={exp} index={i} onOpen={handleOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeExperience && (
        <DetailModal experience={activeExperience} onClose={handleClose} />
      )}
    </section>
  );
}
