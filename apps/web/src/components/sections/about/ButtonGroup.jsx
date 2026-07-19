import { motion } from "framer-motion";
import { Download, Send } from "lucide-react";

export default function ButtonGroup({ downloadCVUrl, onContact }) {
  return (
    <motion.div
      className="flex flex-wrap gap-4 pt-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <motion.a
        href={downloadCVUrl || "#"}
        className="group relative px-7 py-3.5 bg-cyan-600 text-slate-950 rounded-xl font-semibold text-sm flex items-center gap-2.5 overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-400"
        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(6, 182, 212, 0.3)" }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Download size={18} className="relative z-10 group-hover:animate-bounce" />
        <span className="relative z-10">Download Resume</span>
      </motion.a>

      <motion.button
        onClick={onContact}
        className="group relative px-7 py-3.5 border-2 border-slate-600 text-slate-300 rounded-xl font-semibold text-sm flex items-center gap-2.5 overflow-hidden hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(6, 182, 212, 0.1)" }}
        whileTap={{ scale: 0.97 }}
      >
        <Send size={18} className="group-hover:text-cyan-400 transition-colors" />
        <span className="group-hover:text-cyan-400 transition-colors">Let's Talk</span>
      </motion.button>
    </motion.div>
  );
}
