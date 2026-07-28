import { motion } from "framer-motion";
import { User, MapPin, Mail, Clock } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useProfile } from "../../context/ProfileContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statItems = [
  { value: "20+", label: "Projects Completed", accent: "text-accent-blue", border: "border-accent-blue" },
  { value: "15+", label: "Happy Clients", accent: "text-accent-blue", border: "border-accent-blue" },
  { value: "1000+", label: "Hours of Coding", accent: "text-accent-gray", border: "border-accent-gray" },
  { value: "3+", label: "Years of Learning", accent: "text-accent-blue", border: "border-accent-blue" },
];

export default function AboutPreview() {
  const { about, loading } = usePortfolio();
  const { name: profileName, email: profileEmail, initials } = useProfile();

  if (loading) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="animate-pulse h-48 bg-gray-100 rounded-3xl" />
        </div>
      </section>
    );
  }

  const name = about?.name || profileName || "Developer";
  const location = about?.location || "Remote";
  const email = about?.email || profileEmail || "";
  const availability = about?.availability || "Open for opportunities";
  const profileImage = about?.profileImage || "/about-profile.png";

  return (
    <section className="relative bg-white pb-8" aria-label="About preview">
      <div className="max-w-[1600px] mx-auto px-8">
        <motion.div
          className="bg-white border border-gray-200 shadow-lg rounded-[24px] overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* LEFT: About Info */}
            <div className="flex-1 p-8 lg:p-10 lg:border-r border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About Me</h3>
              <div className="space-y-4">
                <InfoRow icon={User}    label="Name"         value={name} />
                <InfoRow icon={MapPin}  label="Location"     value={location} />
                <InfoRow icon={Mail}    label="Email"        value={email} href={`mailto:${email}`} />
                <InfoRow icon={Clock}   label="Availability" value={availability} highlight />
              </div>
            </div>

            {/* CENTER: Portrait */}
            <div className="w-full lg:w-[260px] xl:w-[300px] shrink-0 p-8 lg:p-6 flex items-center justify-center">
              <div className="w-full rounded-[20px] overflow-hidden border border-gray-100 shadow-md bg-gray-50">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full aspect-[3/4] object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100">
                    <span className="text-6xl font-bold text-gray-300">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Stats 2x2 */}
            <div className="flex-1 p-8 lg:p-10 lg:border-l border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {statItems.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className={`bg-white border-l-[3px] border-gray-100 rounded-[18px] p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${stat.border}`}
                    style={{ borderLeftWidth: 3 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                  >
                    <p className={`text-3xl font-bold ${stat.accent} font-mono leading-none mb-1.5`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 leading-snug">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value, href, highlight }) {
  const iconBg = label === "Name" ? "icon-github"
    : label === "Location" ? "icon-location"
    : label === "Email" ? "icon-email"
    : "icon-experience";
  const iconColor = label === "Name" ? "icon-github"
    : label === "Location" ? "icon-location"
    : label === "Email" ? "icon-email"
    : "icon-experience";
  const content = (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium truncate ${highlight ? 'text-accent-blue' : 'text-gray-600'}`}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block hover:opacity-80 transition-opacity">{content}</a>;
  }
  return content;
}
