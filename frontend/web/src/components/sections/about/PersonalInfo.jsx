import { motion } from "framer-motion";
import {
  User, Mail, MapPin, Globe, Briefcase,
  GraduationCap, BadgeCheck, Smartphone, Percent,
} from "lucide-react";

const iconMap = {
  name: User,
  location: MapPin,
  email: Mail,
  phone: Smartphone,
  nationality: Globe,
  languages: Globe,
  experience: Briefcase,
  availability: BadgeCheck,
  degree: GraduationCap,
  freelance: Percent,
};

const colors = {
  name: { bg: "icon-github", text: "text-accent-blue" },
  location: { bg: "icon-location", text: "text-accent-purple" },
  email: { bg: "icon-email", text: "text-accent-blue" },
  phone: { bg: "icon-phone", text: "text-accent-green" },
  nationality: { bg: "icon-experience", text: "text-accent-indigo" },
  languages: { bg: "icon-services", text: "text-accent-teal" },
  experience: { bg: "icon-skills", text: "text-accent-amber" },
  availability: { bg: "icon-projects", text: "text-accent-green" },
  degree: { bg: "icon-email", text: "text-accent-indigo" },
  freelance: { bg: "icon-phone", text: "text-accent-green" },
};

const fields = [
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "nationality", label: "Nationality" },
  { key: "languages", label: "Languages" },
  { key: "experience", label: "Experience" },
  { key: "availability", label: "Availability" },
  { key: "degree", label: "Degree" },
  { key: "freelance", label: "Freelance" },
];

const formatValue = (key, value, about) => {
  if (key === "experience" && about?.yearsOfExperience) {
    return `${about.yearsOfExperience}+ Years`;
  }
  if (key === "email") {
    return value || "sisay@example.com";
  }
  if (!value) return "-";
  return value;
};

export default function PersonalInfo({ about }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map(({ key, label }, i) => {
        const Icon = iconMap[key];
        const value = about?.[key];
        const display = formatValue(key, value, about);
        if (!display || display === "-" || display === "") return null;
        const c = colors[key] || colors.name;
        const emailHref = key === "email" ? `mailto:${display}` : null;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider shrink-0">{label}:</span>
              {emailHref ? (
                <a href={emailHref} className={`text-sm font-semibold ${c.text} truncate hover:underline`}>
                  {display}
                </a>
              ) : (
                <span className={`text-sm font-semibold ${c.text} truncate`}>{display}</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
