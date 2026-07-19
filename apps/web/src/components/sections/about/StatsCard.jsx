import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function AnimatedNumber({ target, suffix = "+", duration = 2000 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const statsConfig = [
  { key: "projects", label: "Projects Completed", target: 50 },
  { key: "clients", label: "Happy Clients", target: 30 },
  { key: "yearsExp", label: "Years Experience", target: 5 },
  { key: "technologies", label: "Technologies", target: 20 },
];

export default function StatsCard({ statistics }) {
  let parsed = {};
  try {
    parsed = typeof statistics === "string" ? JSON.parse(statistics) : (statistics || {});
  } catch { parsed = {}; }

  const items = statsConfig.map((s) => ({
    ...s,
    target: parsed[s.key] || s.target,
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-3xl font-bold text-white mb-1 relative z-10 font-mono">
            <AnimatedNumber target={item.target} />
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wider relative z-10">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
