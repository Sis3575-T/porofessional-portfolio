import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { resolveUrl } from "../../../utils/resolveUrl";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Timeline({ experiences }) {
  if (!experiences || experiences.length === 0) return null;

  const sorted = [...experiences]
    .filter((e) => e.enabled !== false)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#DED7E2] dark:bg-[#403846]" />

      <div className="space-y-6">
        {sorted.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="relative pl-12 group"
          >
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-[#EAE3F3] dark:bg-[#B9A4DF]/15 border border-[#DED7E2] dark:border-[#403846] flex items-center justify-center z-10 shadow-soft-xs text-[#78649D] dark:text-[#B9A4DF]">
              {exp.logo ? (
                <img src={resolveUrl(exp.logo)} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <Briefcase size={16} />
              )}
            </div>

            <div className="bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846] rounded-2xl p-4 shadow-soft-xs hover:border-[#78649D]/50 transition-all">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="text-xs text-[#78649D] dark:text-[#B9A4DF] font-semibold">
                  {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#29262D] dark:text-[#F6F2F8]">{exp.position}</h4>
              <p className="text-sm font-semibold text-[#51416F] dark:text-[#B9A4DF] mb-2">{exp.company}</p>
              {exp.description && (
                <p className="text-xs sm:text-sm text-[#625D66] dark:text-[#C4BCCB] leading-relaxed line-clamp-2">{exp.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}