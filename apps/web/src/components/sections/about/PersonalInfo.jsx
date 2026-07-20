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

        const emailHref = key === "email" ? `mailto:${display}` : null;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
              <Icon size={16} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
              {emailHref ? (
                <a href={emailHref} className="text-sm text-gray-700 hover:text-gray-900 transition truncate block">
                  {display}
                </a>
              ) : (
                <p className="text-sm text-gray-700 truncate">{display}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
