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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846] rounded-3xl shadow-soft-xs ${className}`}
    >
      {children}
    </Tag>
  );
}