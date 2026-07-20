import { motion } from "framer-motion";
import { usePortfolio } from "../../../context/PortfolioContext";
import { AnimatedSection } from "../../AnimatedSection";
import { User, MapPin, Mail, Clock } from "lucide-react";

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Stat items matching the image exactly
const statItems = [
  {
    icon: "code",
    value: "20+",
    label: "Projects Completed",
    color: "blue",
  },
  {
    icon: "planet",
    value: "15+",
    label: "Happy Clients",
    color: "purple",
  },
  {
    icon: "coffee",
    value: "1000+",
    label: "Hours of Coding",
    color: "blue",
  },
  {
    icon: "award",
    value: "3+",
    label: "Years of Learning",
    color: "yellow",
  },
];

function StatIcon({ type, color }) {
  const colorMap = {
    blue: { bg: "rgba(59,130,246,0.15)", icon: "#3b82f6" },
    purple: { bg: "rgba(139,92,246,0.15)", icon: "#8b5cf6" },
    yellow: { bg: "rgba(234,179,8,0.15)", icon: "#eab308" },
  };
  const c = colorMap[color] || colorMap.blue;

  const icons = {
    code: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    planet: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M1.05 12.4c0 0 4.3-6.4 10.95-6.4s10.95 6.4 10.95 6.4-4.3 6.4-10.95 6.4S1.05 12.4 1.05 12.4z"/>
      </svg>
    ),
    coffee: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="2" x2="6" y2="4"/>
        <line x1="10" y1="2" x2="10" y2="4"/>
        <line x1="14" y1="2" x2="14" y2="4"/>
      </svg>
    ),
    award: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
  };

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
      style={{ background: c.bg, color: c.icon }}
    >
      {icons[type]}
    </div>
  );
}

export default function AboutSection() {
  const { about, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse h-64 bg-slate-800/40 rounded-3xl" />
        </div>
      </section>
    );
  }

  const name = about?.name || "Sisay Temesgen";
  const location = about?.location || "Bahir Dar, Ethiopia";
  const email = about?.email || "sisaydev@example.com";
  const availability = about?.availability || "Open for opportunities";
  const biography =
    about?.biography ||
    "I'm a 3rd year Computer Science student at Bahir Dar University. Passionate about building scalable web apps and exploring AI technologies. I love turning ideas into real-world solutions.";
  const profileImage = about?.profileImage || "/about-profile.png";

  return (
    <AnimatedSection id="about" className="relative py-12 pb-20 overflow-hidden" aria-label="About section">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="about-main-card"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* === Left Column: Info === */}
          <motion.div variants={fadeSlideUp} className="about-col-info">
            {/* Section heading */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
              <h2 className="text-xl font-bold text-white" style={{ fontSize: "1.3rem" }}>About Me</h2>
            </div>

            {/* Bio */}
            <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-sm">
              {biography}
            </p>

            {/* Personal Info List */}
            <div className="space-y-3.5">
              <div className="about-info-row">
                <User size={14} className="text-slate-400 shrink-0" />
                <span className="about-info-label">Name:</span>
                <span className="about-info-value">{name}</span>
              </div>
              <div className="about-info-row">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="about-info-label">Location:</span>
                <span className="about-info-value">{location}</span>
              </div>
              <div className="about-info-row">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="about-info-label">Email:</span>
                <a href={`mailto:${email}`} className="about-info-value hover:text-cyan-400 transition-colors">{email}</a>
              </div>
              <div className="about-info-row">
                <Clock size={14} className="text-slate-400 shrink-0" />
                <span className="about-info-label">Availability:</span>
                <span className="text-green-400 text-sm font-medium">{availability}</span>
              </div>
            </div>
          </motion.div>

          {/* === Center Column: Profile Photo === */}
          <motion.div variants={fadeSlideUp} className="about-col-photo">
            <div className="about-photo-wrapper">
              {/* Geometric neon frame */}
              <div className="about-photo-frame" aria-hidden="true">
                <div className="about-photo-frame-inner" />
              </div>
              {/* Photo */}
              <div className="about-photo-container">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Sisay Temesgen - Full Stack Developer"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-cyan-900/20">
                    <span className="text-5xl font-bold text-cyan-400/60">ST</span>
                  </div>
                )}
                {/* Photo overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* === Right Column: Stats Grid === */}
          <motion.div variants={fadeSlideUp} className="about-col-stats">
            <div className="about-stats-grid">
              {statItems.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="about-stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <StatIcon type={stat.icon} color={stat.color} />
                  <p className="text-3xl font-bold text-white font-mono leading-none mb-1.5">{stat.value}</p>
                  <p className="text-xs text-slate-400 leading-snug">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
