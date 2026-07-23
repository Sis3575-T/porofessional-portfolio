import { motion } from "framer-motion";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useProfile } from "../../../context/ProfileContext";
import { AnimatedSection } from "../../AnimatedSection";
import { User, MapPin, Mail, Clock, Code2, Globe, Coffee, Award } from "lucide-react";

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const infoItems = [
  { key: "name", icon: User, label: "Name", color: "icon-github", textColor: "text-accent-blue" },
  { key: "location", icon: MapPin, label: "Location", color: "icon-location", textColor: "text-accent-blue" },
  { key: "email", icon: Mail, label: "Email", color: "icon-email", textColor: "text-accent-blue" },
  { key: "availability", icon: Clock, label: "Availability", color: "icon-phone", textColor: "text-accent-blue" },
];

const defaultStatItems = [
  { icon: Code2, value: "20+", label: "Projects Completed", iconClass: "icon-projects", accent: "text-accent-blue", border: "border-accent-blue" },
  { icon: Globe, value: "15+", label: "Happy Clients", iconClass: "icon-linkedin", accent: "text-accent-blue", border: "border-accent-blue" },
  { icon: Coffee, value: "1000+", label: "Hours of Coding", iconClass: "icon-email", accent: "text-accent-gray", border: "border-accent-gray" },
  { icon: Award, value: "3+", label: "Years of Learning", iconClass: "icon-projects", accent: "text-accent-blue", border: "border-accent-blue" },
];

export default function AboutSection() {
  const { about, loading } = usePortfolio();
  const { name: profileName, email: profileEmail, initials } = useProfile();

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse h-64 bg-gray-100 rounded-3xl" />
        </div>
      </section>
    );
  }

  const name = about?.name || profileName || "Developer";
  const location = about?.location || "Remote";
  const email = about?.email || profileEmail || "";
  const availability = about?.availability || "Open for opportunities";
  const biography =
    about?.biography ||
    "I'm a 3rd year Computer Science student at Bahir Dar University. Passionate about building scalable web apps and exploring AI technologies. I love turning ideas into real-world solutions.";
  const profileImage = about?.profileImage || "/about-profile.png";

  const statItems = (() => {
    try {
      if (about?.statistics) {
        const s = typeof about.statistics === "string" ? JSON.parse(about.statistics) : about.statistics;
        return [
          { icon: Code2, value: `${s.projects || s.projectsCount || 20}+`, label: "Projects Completed", iconClass: "icon-projects", accent: "text-accent-blue", border: "border-accent-blue" },
          { icon: Globe, value: `${s.clients || s.clientsCount || 15}+`, label: "Happy Clients", iconClass: "icon-linkedin", accent: "text-accent-blue", border: "border-accent-blue" },
          { icon: Coffee, value: `${s.technologies || s.technologiesCount || 20}+`, label: "Technologies", iconClass: "icon-email", accent: "text-accent-gray", border: "border-accent-gray" },
          { icon: Award, value: `${s.yearsExp || s.yearsOfExperience || 3}+`, label: "Years of Learning", iconClass: "icon-projects", accent: "text-accent-blue", border: "border-accent-blue" },
        ];
      }
    } catch {}
    return defaultStatItems;
  })();

  const getValue = (key) => {
    if (key === "name") return name;
    if (key === "location") return location;
    if (key === "email") return email;
    if (key === "availability") return availability;
    return "";
  };

  return (
    <AnimatedSection id="about" theme="about" className="py-4 pb-8" aria-label="About section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-accent-blue tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About
        </motion.p>
        <motion.h2
          className="text-center text-gray-900 text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About <span className="text-accent-blue">Me</span>
        </motion.h2>

        <motion.div
          className="bg-white border border-gray-200 rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)" }}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* LEFT: Info */}
            <div className="flex-1 p-8 xl:p-10 lg:border-r border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                <h3 className="text-xl font-bold text-gray-900">About Me</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-lg">
                {biography}
              </p>
              <div className="space-y-3">
                {infoItems.map((item, i) => {
                  const val = getValue(item.key);
                  const isEmail = item.key === "email";
                  const content = (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon size={16} />
                      </div>
                      <div className="min-w-0 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider shrink-0">{item.label}:</span>
                        <span className={`text-sm font-semibold ${item.textColor} truncate`}>{val}</span>
                      </div>
                    </motion.div>
                  );
                  if (isEmail) {
                    return <a key={item.key} href={`mailto:${val}`} className="block">{content}</a>;
                  }
                  return content;
                })}
              </div>
            </div>

            {/* CENTER: Photo */}
            <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex items-stretch p-8 lg:p-6 bg-gray-50">
              <div className="w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${name} - Full Stack Developer`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100">
                    <span className="text-5xl font-bold text-gray-300">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Stats */}
            <div className="flex-1 p-8 xl:p-10 lg:border-l border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                <h3 className="text-xl font-bold text-gray-900">Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {statItems.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    style={{ borderLeftWidth: 3, borderLeftColor: "inherit" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.iconClass}`}>
                      <stat.icon size={18} />
                    </div>
                    <p className={`text-3xl font-bold ${stat.accent} font-mono leading-none mb-1`}>{stat.value}</p>
                    <p className="text-xs text-gray-400 leading-snug">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
