import { motion } from "framer-motion";

const defaultSkills = [
  { name: "React", proficiency: 95 },
  { name: "Express", proficiency: 90 },
  { name: "MongoDB", proficiency: 85 },
  { name: "Node.js", proficiency: 88 },
  { name: "Docker", proficiency: 80 },
  { name: "Three.js", proficiency: 75 },
  { name: "Next.js", proficiency: 85 },
  { name: "TypeScript", proficiency: 90 },
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
            transition: { duration: 0.15 },
          }}
          className="group px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 cursor-default transition-all shadow-sm"
        >
          {skill.name}
        </motion.div>
      ))}
    </div>
  );
}
