import { motion } from "framer-motion";

export default function AboutCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  as: Tag = motion.div,
}) {
  return (
    <Tag
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
