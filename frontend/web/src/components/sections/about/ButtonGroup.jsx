import { motion } from "framer-motion";
import { Download, Eye, Send } from "lucide-react";
import { resolveUrl } from "../../../utils/resolveUrl";

export default function ButtonGroup({ downloadCVUrl, onContact }) {
  const cvUrl = downloadCVUrl ? resolveUrl(downloadCVUrl) : null;

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3 mb-8 pt-1"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {cvUrl && (
        <>
          <motion.a
            href={cvUrl}
            download
            className="px-5 py-2.5 rounded-full bg-[#7865A6] hover:bg-[#65518E] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-soft-xs hover:shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7865A6] cursor-pointer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Download Resume"
          >
            <Download size={15} />
            <span>Download CV</span>
          </motion.a>

          <motion.a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white dark:bg-[#272530] hover:bg-[#FAF9F7] dark:hover:bg-[#211F28] text-[#504172] dark:text-[#F6F4FA] border border-[#DED9E5] dark:border-[#3E394A] hover:border-[#7865A6] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7865A6] cursor-pointer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View Resume in new tab"
          >
            <Eye size={15} />
            <span>View CV</span>
          </motion.a>
        </>
      )}

      <motion.button
        type="button"
        onClick={onContact}
        className="px-5 py-2.5 rounded-full bg-white dark:bg-[#272530] hover:bg-[#FAF9F7] dark:hover:bg-[#211F28] text-[#504172] dark:text-[#F6F4FA] border border-[#DED9E5] dark:border-[#3E394A] hover:border-[#7865A6] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7865A6] cursor-pointer"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send size={14} className="text-[#7865A6] dark:text-[#BBA7E5]" />
        <span>Contact Me</span>
      </motion.button>
    </motion.div>
  );
}