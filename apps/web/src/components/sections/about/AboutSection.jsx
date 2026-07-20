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

const statIconMap = {
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

const statItems = [
  { icon: "code", value: "20+", label: "Projects Completed" },
  { icon: "planet", value: "15+", label: "Happy Clients" },
  { icon: "coffee", value: "1000+", label: "Hours of Coding" },
  { icon: "award", value: "3+", label: "Years of Learning" },
];

export default function AboutSection() {
  const { about, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse h-64 bg-gray-100 rounded-3xl" />
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
    <AnimatedSection id="about" theme="about" className="py-12 pb-20" aria-label="About section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="about-main-card"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeSlideUp} className="about-col-info">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-gray-200" />
              <h2 className="text-xl font-bold text-white" style={{ fontSize: "1.3rem" }}>About Me</h2>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-sm">
              {biography}
            </p>

            <div className="space-y-3.5">
              <div className="about-info-row">
                <User size={14} className="text-slate-500 shrink-0" />
                <span className="about-info-label">Name:</span>
                <span className="about-info-value">{name}</span>
              </div>
              <div className="about-info-row">
                <MapPin size={14} className="text-slate-500 shrink-0" />
                <span className="about-info-label">Location:</span>
                <span className="about-info-value">{location}</span>
              </div>
              <div className="about-info-row">
                <Mail size={14} className="text-slate-500 shrink-0" />
                <span className="about-info-label">Email:</span>
                <a href={`mailto:${email}`} className="about-info-value hover:text-white transition-colors">{email}</a>
              </div>
              <div className="about-info-row">
                <Clock size={14} className="text-slate-500 shrink-0" />
                <span className="about-info-label">Availability:</span>
                <span className="text-slate-300 text-sm font-medium">{availability}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="about-col-photo">
            <div className="about-photo-wrapper">
              <div className="about-photo-container">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Sisay Temesgen - Full Stack Developer"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <span className="text-5xl font-bold text-slate-600">ST</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

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
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-500">
                    {statIconMap[stat.icon]}
                  </div>
                  <p className="text-3xl font-bold text-white font-mono leading-none mb-1.5">{stat.value}</p>
                  <p className="text-xs text-slate-500 leading-snug">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
