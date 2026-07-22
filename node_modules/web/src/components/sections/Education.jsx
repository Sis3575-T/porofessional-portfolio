import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  ExternalLink,
  Check,
} from "lucide-react";

const defaultEducation = [
  {
    id: "edu-1",
    degree: "BSc. Computer Science",
    institution: "University of Applied Sciences",
    startDate: "2021-01-01",
    endDate: "2025-01-01",
    isCurrent: false,
    field: "Software Engineering, Algorithms, and Emerging Technologies",
    gpa: "3.7/4.0",
    description:
      "Focused on software engineering fundamentals, distributed systems, and AI-driven product development.",
    location: "Addis Ababa, Ethiopia",
    achievements: ["Graduated with Distinction", "Dean's List 2023", "Best Final Year Project"],
    technologies: ["Python", "Java", "SQL", "Machine Learning"],
    courses: ["Data Structures", "Operating Systems", "Computer Networks"],
    certificateUrl: null,
    logo: null,
  },
  {
    id: "edu-2",
    degree: "Professional Development",
    institution: "Self-directed Learning",
    startDate: "2022-01-01",
    endDate: "2026-01-01",
    isCurrent: true,
    field: "Frontend, Backend, and Modern Web Architecture",
    description:
      "Built practical projects around React, Node.js, databases, deployment, and product design.",
    achievements: ["10+ certifications", "Open source contributor"],
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    courses: ["System Design", "Cloud Architecture", "DevOps"],
    gpa: null,
    location: "Online",
    certificateUrl: null,
    logo: null,
  },
];

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
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/* ─── Timeline Node ─── */
function TimelineNode({ isActive, isLast }) {
  return (
    <div className="edu-timeline-node-wrapper">
      <div
        className={`edu-timeline-node ${isActive ? "edu-timeline-node--active" : ""}`}
      />
      {!isLast && <div className="edu-timeline-line" />}
    </div>
  );
}

/* ─── Education Card ─── */
function EducationCard({ edu, index, total }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const startDate = formatDate(edu.startDate);
  const endDate = edu.isCurrent ? "Present" : formatDate(edu.endDate);
  const achievements = parseJSON(edu.achievements);
  const technologies = parseJSON(edu.technologies);
  const courses = parseJSON(edu.courses);

  return (
    <div ref={ref} className="edu-card-wrapper">
      {/* Timeline */}
      <div className="edu-timeline-col">
        <TimelineNode isActive={isInView} isLast={index === total - 1} />
      </div>

      {/* Card */}
      <motion.div
        className="edu-card"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 40, scale: 0.97 }
        }
        transition={{
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        }}
      >
        {/* ── TOP: Logo + Title ── */}
        <div className="edu-card-top">
          <div className="edu-logo-container">
            {edu.logo ? (
              <img
                src={edu.logo}
                alt={edu.institution}
                className="edu-logo-img"
              />
            ) : (
              <GraduationCap size={28} className="edu-logo-icon" />
            )}
          </div>
          <div className="edu-card-title-group">
            <h3 className="edu-institution-name">{edu.institution}</h3>
            <p className="edu-degree">{edu.degree}</p>
            {edu.field && <p className="edu-field">{edu.field}</p>}
          </div>
        </div>

        {/* ── CENTER: Meta + Description ── */}
        <div className="edu-card-center">
          <div className="edu-meta-row">
            {startDate && (
              <span className="edu-meta-badge">
                <Calendar size={12} />
                {startDate} – {endDate}
              </span>
            )}
            {edu.location && (
              <span className="edu-meta-badge">
                <MapPin size={12} />
                {edu.location}
              </span>
            )}
            {edu.gpa && (
              <span className="edu-meta-badge edu-meta-badge--accent">
                GPA: {edu.gpa}
              </span>
            )}
          </div>

          {edu.description && (
            <p className="edu-description">{edu.description}</p>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="edu-section">
              <h4 className="edu-section-label">
                <Award size={12} />
                Achievements
              </h4>
              <ul className="edu-achievements-list">
                {achievements.map((a, i) => (
                  <li key={i} className="edu-achievement-item">
                    <span className="edu-check-icon">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Relevant Courses */}
          {courses.length > 0 && (
            <div className="edu-section">
              <h4 className="edu-section-label">
                <BookOpen size={12} />
                Relevant Coursework
              </h4>
              <div className="edu-courses-list">
                {courses.map((c, i) => (
                  <span key={i} className="edu-course-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM: Technology Tags + Certificate Button ── */}
        <div className="edu-card-bottom">
          {technologies.length > 0 && (
            <div className="edu-tech-tags">
              {technologies.map((t, i) => (
                <span key={i} className="edu-tech-chip">
                  {t}
                </span>
              ))}
            </div>
          )}

          {edu.certificateUrl && (
            <a
              href={edu.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-cert-button"
            >
              <ExternalLink size={14} />
              View Certificate
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Education Section ─── */
export default function Education() {
  const { education, loading } = usePortfolio();
  const educationItems = useMemo(
    () => (education && education.length > 0 ? education : defaultEducation),
    [education]
  );

  const sectionRef = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (loading) {
    return (
      <section id="education" className="edu-section-wrapper">
        <div className="edu-section-inner">
          <div className="edu-loading">
            <div className="edu-loading-header">
              <div className="edu-loading-badge" />
              <div className="edu-loading-title" />
              <div className="edu-loading-desc" />
            </div>
            <div className="edu-loading-cards">
              <div className="edu-loading-card" />
              <div className="edu-loading-card" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
      className="edu-section-wrapper"
      style={{ background: "var(--section-education)" }}
    >
      <div className="edu-section-inner" ref={sectionRef}>
        {/* ── Section Header ── */}
        <motion.div
          className="edu-header"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="edu-header-title">
            Education
          </h2>
        </motion.div>

        {/* ── Education Grid ── */}
        <div className="edu-grid">
          {educationItems.map((edu, i) => (
            <EducationCard
              key={edu.id}
              edu={edu}
              index={i}
              total={educationItems.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
