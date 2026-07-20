import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AnimatedSection({ children, className, id, theme, ...rest }) {
  const baseClass = "px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative";
  const mergedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <motion.section
      id={id}
      className={mergedClassName}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      {...rest}
    >
      {theme && (
        <div className={`section-bg section-${theme}-bg`}>
          <div className={`section-bg-pattern section-${theme}-pattern`} />
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
}


export function AnimatedItem({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTitle({ children, className }) {
  return (
    <motion.h2
      className={className}
      variants={itemVariants}
      viewport={{ once: true }}
    >
      {children}
    </motion.h2>
  );
}

export function AnimatedCard({ children, className, index = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.div>
  );
}
