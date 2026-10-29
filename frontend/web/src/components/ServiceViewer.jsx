import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, MessageSquare, ArrowRight, Check } from "lucide-react";
import { useServiceViewer } from "../context/ServiceViewerContext";
import { useTheme } from "../context/ThemeContext";
import { resolveUrl } from "../utils/resolveUrl";

function Lightbox({ src, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[#19171D]/80 backdrop-blur-sm" onClick={onClose} />
      <motion.img
        src={src}
        className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-2xl border border-[#DED7E2] dark:border-[#403846]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
        aria-label="Close image viewer"
      >
        <X size={20} />
      </button>
    </motion.div>
  );
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ServiceViewer() {
  const { services, activeIndex, isOpen, closeService, animationDone } = useServiceViewer();
  const { dark } = useTheme();
  const [lightbox, setLightbox] = useState(null);

  const service = services[activeIndex];
  if (!service || !isOpen) return null;

  const features = service.features
    ? (typeof service.features === "string" ? JSON.parse(service.features) : service.features)
    : [];

  const technologies = service.technologies
    ? (typeof service.technologies === "string" ? JSON.parse(service.technologies) : service.technologies)
    : [];

  const gallery = service.galleryImages
    ? (typeof service.galleryImages === "string" ? JSON.parse(service.galleryImages) : service.galleryImages || [])
    : [];

  const handleClose = () => {
    closeService();
    setTimeout(animationDone, 600);
  };

  const handleContact = () => {
    handleClose();
    setTimeout(() => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
        const subjectInput = document.getElementById("ct-subject");
        if (subjectInput) {
          subjectInput.value = `Inquiry: ${service.title}`;
          subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }, 400);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF8F5] dark:bg-[#19171D] text-[#29262D] dark:text-[#F6F2F8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <motion.button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 w-11 h-11 rounded-2xl bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846] text-[#51416F] dark:text-[#F6F2F8] hover:border-[#78649D]/50 flex items-center justify-center transition shadow-soft-sm cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close service modal"
        >
          <X size={18} />
        </motion.button>

        {/* Hero section */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <motion.div variants={stagger} initial="initial" animate="animate">
            {/* Back link */}
            <motion.button
              onClick={handleClose}
              className="flex items-center gap-2 text-sm font-semibold text-[#78649D] dark:text-[#B9A4DF] hover:underline mb-8 transition cursor-pointer"
              variants={fadeUp}
            >
              <ArrowRight size={14} className="rotate-180" /> Back to services
            </motion.button>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-[#29262D] dark:text-[#F6F2F8] tracking-tight"
              variants={fadeUp}
            >
              {service.title}
            </motion.h1>

            {/* Short description */}
            <motion.p
              className="text-base sm:text-lg mb-8 max-w-2xl text-[#625D66] dark:text-[#C4BCCB] leading-relaxed"
              variants={fadeUp}
            >
              {service.shortDescription || service.description}
            </motion.p>

            {/* Buttons */}
            <motion.div className="flex flex-wrap gap-3 mb-12" variants={fadeUp}>
              {service.liveUrl && (
                <a
                  href={service.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#78649D] hover:bg-[#655184] text-white text-sm font-semibold rounded-2xl shadow-soft-xs transition"
                >
                  <ExternalLink size={16} /> {service.buttonText || "Live Demo"}
                </a>
              )}
              {service.githubUrl && (
                <a
                  href={service.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-2xl bg-white dark:bg-[#27232D] text-[#51416F] dark:text-[#F6F2F8] border border-[#DED7E2] dark:border-[#403846] hover:border-[#78649D]/50 transition shadow-soft-xs"
                >
                  <Github size={16} /> Source Code
                </a>
              )}
              <button
                type="button"
                onClick={handleContact}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-2xl bg-[#EAE3F3] dark:bg-[#B9A4DF]/15 text-[#51416F] dark:text-[#F6F2F8] border border-[#DED7E2] dark:border-[#403846] hover:border-[#78649D]/50 transition shadow-soft-xs cursor-pointer"
              >
                <MessageSquare size={16} /> Contact Me
              </button>
            </motion.div>

            {/* Hero image */}
            {service.heroImage && (
              <motion.div
                className="rounded-3xl overflow-hidden mb-12 border border-[#DED7E2] dark:border-[#403846] shadow-soft-sm"
                variants={fadeUp}
              >
                <img
                  src={resolveUrl(service.heroImage)}
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            {/* Full description */}
            <motion.div className="mb-12" variants={fadeUp}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#29262D] dark:text-[#F6F2F8]">
                About this service
              </h2>
              <div className="leading-relaxed whitespace-pre-line text-sm sm:text-base text-[#625D66] dark:text-[#C4BCCB]">
                {service.fullDescription || service.description}
              </div>
            </motion.div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#78649D] dark:text-[#B9A4DF]">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-[#27232D] text-[#29262D] dark:text-[#F6F2F8] border border-[#DED7E2] dark:border-[#403846]"
                    >
                      {typeof tech === "string" ? tech : tech.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#78649D] dark:text-[#B9A4DF]">
                  Key Deliverables
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846]"
                      variants={fadeUp}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#EAE3F3] dark:bg-[#B9A4DF]/20 text-[#78649D] dark:text-[#B9A4DF] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs sm:text-sm text-[#29262D] dark:text-[#F6F2F8] font-medium">
                        {typeof feature === "string" ? feature : feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Development Process */}
            {service.process && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#78649D] dark:text-[#B9A4DF]">
                  Engineering Process
                </h2>
                <div className="leading-relaxed whitespace-pre-line text-sm sm:text-base text-[#625D66] dark:text-[#C4BCCB]">
                  {service.process}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#78649D] dark:text-[#B9A4DF]">
                  Visual Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      className="rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition border border-[#DED7E2] dark:border-[#403846]"
                      onClick={() => setLightbox(img)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img src={resolveUrl(img)} alt="" className="w-full h-40 object-cover" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}