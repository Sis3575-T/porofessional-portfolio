import { motion } from "framer-motion";

const defaultSkills = [
  { name: "React", color: "#61dafb", proficiency: 95 },
  { name: "Express", color: "#68a063", proficiency: 90 },
  { name: "MongoDB", color: "#4db33d", proficiency: 85 },
  { name: "Node.js", color: "#68a063", proficiency: 88 },
  { name: "Docker", color: "#0db7ed", proficiency: 80 },
  { name: "Three.js", color: "#049ef4", proficiency: 75 },
  { name: "Next.js", color: "#fff", proficiency: 85 },
  { name: "TypeScript", color: "#3178c6", proficiency: 90 },
];

export default function SkillsPreview({ skills }) {
  const items = skills && skills.length > 0
    ? skills.filter((s) => s.enabled !== false).slice(0, 8)
    : defaultSkills;

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((skill, i) => (
        <motion.div
          key={skill.id || skill.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          whileHover={{
            y: -4,
            scale: 1.05,
            boxShadow: `0 8px 25px ${skill.color || "#22d3ee"}20`,
            transition: { duration: 0.15 },
          }}
          className="group relative px-3.5 py-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-xl text-sm font-medium text-slate-300 hover:text-white cursor-default overflow-hidden"
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity"
            style={{ backgroundColor: skill.color || "#22d3ee" }}
          />
          <span className="relative z-10">{skill.name}</span>
        </motion.div>
      ))}
    </div>
  );
}
