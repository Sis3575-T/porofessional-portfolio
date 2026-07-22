import { useEffect, useState, useCallback, useRef } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { X, ExternalLink, Building2, MapPin, Calendar, Briefcase, Award, ChevronLeft, ChevronRight } from "lucide-react";

const defaultExperiences = [
  {
    id: "exp-1",
    company: "Tech Company Inc",
    position: "Senior Full Stack Developer",
    startDate: "2023-01-01",
    endDate: "2026-01-01",
    isCurrent: true,
    description: "Leading development of scalable web applications with modern technologies.",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    responsibilities: ["Led team of 5 developers", "Architected microservices", "Reduced load time by 40%"],
    achievements: ["Delivered 10+ projects", "99% uptime maintained"],
    location: "Remote",
    employmentType: "Full-time",
  },
  {
    id: "exp-2",
    company: "Digital Agency Co",
    position: "Frontend Developer",
    startDate: "2022-01-01",
    endDate: "2024-01-01",
    isCurrent: false,
    description: "Built responsive web interfaces for enterprise clients.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    responsibilities: ["Developed client dashboards", "Built component libraries"],
    achievements: ["Improved performance by 60%", "Won agency award"],
    location: "New York, NY",
    employmentType: "Full-time",
  },
  {
    id: "exp-3",
    company: "StartUp Labs",
    position: "Junior Developer",
    startDate: "2021-01-01",
    endDate: "2022-06-01",
    isCurrent: false,
    description: "Developed full-stack features for a SaaS platform.",
    technologies: ["React", "Express", "MongoDB", "JWT"],
    responsibilities: ["Built REST APIs", "Implemented auth system"],
    achievements: ["Shipped MVP in 3 months"],
    location: "San Francisco, CA",
    employmentType: "Full-time",
  },
];

function parseJSON(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
}

function DetailModal({ experience, onClose }) {
  const technologies = parseJSON(experience.technologies);
  const responsibilities = parseJSON(experience.responsibilities);
  const achievements = parseJSON(experience.achievements);
  const gallery = parseJSON(experience.galleryImages);

  const startDate = experience.startDate ? new Date(experience.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const endDate = experience.isCurrent ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "85vh" }}>
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              {experience.logo ? (
                <img src={experience.logo} alt={experience.company} className="w-12 h-12 rounded-xl object-cover" style={{ border: "1px solid var(--border)" }} />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                  <Building2 size={22} style={{ color: "var(--accent)" }} />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{experience.company}</h2>
                <p className="text-sm" style={{ color: "var(--accent)" }}>{experience.position}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
            {startDate && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <Calendar size={12} /> {startDate} – {endDate}
              </span>
            )}
            {experience.employmentType && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <Briefcase size={12} /> {experience.employmentType}
              </span>
            )}
            {experience.location && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <MapPin size={12} /> {experience.location}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>{experience.description}</p>

          {responsibilities.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Responsibilities</h4>
              <ul className="space-y-1.5">
                {responsibilities.map((r, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-1" style={{ color: "var(--accent)" }}>&#x2022;</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Award size={12} /> Achievements
              </h4>
              <ul className="space-y-1.5">
                {achievements.map((a, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="text-amber-400 mt-1">&#x2605;</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {technologies.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium rounded-lg" style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Gallery</h4>
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-lg" style={{ border: "1px solid var(--border)" }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap mt-5">
            {experience.companyUrl && (
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                <ExternalLink size={14} /> Visit Company
              </a>
            )}
            <button onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-80 transition"
              style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ experience, index, onOpen }) {
  const technologies = parseJSON(experience.technologies).slice(0, 4);
  const startDate = experience.startDate ? new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  const endDate = experience.isCurrent ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

  return (
    <div
      className="group flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-default"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 24px var(--shadow)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.12), 0 4px 12px var(--shadow)";
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 25%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px var(--shadow)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          {experience.logo ? (
            <img src={experience.logo} alt={experience.company} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
              <Building2 size={20} style={{ color: "var(--accent)" }} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight truncate" style={{ color: "var(--text-primary)" }}>{experience.position || "Role"}</h3>
            <p className="text-sm font-medium truncate" style={{ color: "var(--accent)" }}>{experience.company || "Company"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {startDate} – {endDate}
            </span>
          )}
          {experience.location && (
            <>
              <span style={{ color: "var(--border)" }}>|</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {experience.location}
              </span>
            </>
          )}
        </div>

        {experience.description && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {experience.description}
          </p>
        )}

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {technologies.map((t, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] font-medium rounded-md" style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                {t}
              </span>
            ))}
            {parseJSON(experience.technologies).length > 4 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                +{parseJSON(experience.technologies).length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={() => onOpen(index)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
          >
            Open Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { experiences } = usePortfolio();
  const experienceList = experiences && experiences.length > 0 ? experiences : defaultExperiences;
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section id="experience" className="py-16 relative" style={{ background: "var(--section-experience)" }}>
      <div className="px-4 sm:px-8 mb-10">
        <p className="text-center text-sm font-medium tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>Where I&apos;ve Worked</p>
        <h2 className="text-center text-4xl font-bold" style={{ color: "var(--text-primary)" }}>Work <span style={{ color: "var(--accent)" }}>Experience</span></h2>
        <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: "var(--accent)" }} />
      </div>

      <div className="relative group/scroll">
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {experienceList.map((exp, i) => (
            <div key={exp.id || i} style={{ scrollSnapAlign: "start" }}>
              <ExperienceCard experience={exp} index={i} onOpen={handleOpen} />
            </div>
          ))}
        </div>
      </div>

      {activeExperience && (
        <DetailModal experience={activeExperience} onClose={handleClose} />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
