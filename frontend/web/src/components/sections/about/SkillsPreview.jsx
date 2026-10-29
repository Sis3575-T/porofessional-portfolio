import { motion } from "framer-motion";

export default function SkillsPreview({ skills }) {
  const items = (skills || []).filter((s) => s.enabled !== false).slice(0, 8);

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((skill, i) => (
        <motion.div
          key={skill.id || skill.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          whileHover={{
            y: -2,
            transition: { duration: 0.15 },
          }}
          className="px-3.5 py-1.5 bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846] rounded-xl text-xs sm:text-sm font-semibold text-[#29262D] dark:text-[#F6F2F8] hover:border-[#78649D]/50 cursor-default transition-all shadow-soft-xs"
        >
          {skill.name}
        </motion.div>
      ))}
    </div>
  );
}