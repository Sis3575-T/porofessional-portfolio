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
        className="btn-ceramic px-7 py-3.5 font-semibold text-sm flex items-center gap-2.5"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        <Download size={18} />
        <span>Download Resume</span>
      </motion.a>

      <motion.button
        onClick={onContact}
        className="btn-aluminum px-7 py-3.5 font-semibold text-sm flex items-center gap-2.5"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        <Send size={18} />
        <span>Let's Talk</span>
      </motion.button>
    </motion.div>
  );
}
