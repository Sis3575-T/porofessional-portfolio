import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, MessageSquare, ArrowRight, Check } from "lucide-react";
import { useServiceViewer } from "../context/ServiceViewerContext";
import { useTheme } from "../context/ThemeContext";

function Lightbox({ src, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.img
        src={src}
        className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition"
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

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: "var(--bg-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Close button */}
        <motion.button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-sm"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} />
        </motion.button>

        {/* Hero section */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12">
          <motion.div variants={stagger} initial="initial" animate="animate">
            {/* Back link */}
            <motion.button
              onClick={handleClose}
              className="flex items-center gap-2 text-sm hover:opacity-80 mb-8 transition"
              style={{ color: "var(--accent)" }}
              variants={fadeUp}
            >
              <ArrowRight size={14} className="rotate-180" /> Back to services
            </motion.button>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: "var(--text-primary)" }}
              variants={fadeUp}
            >
              {service.title}
            </motion.h1>

            {/* Short description */}
            <motion.p
              className="text-lg mb-8 max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition"
                >
                  <ExternalLink size={16} /> {service.buttonText || "Live Demo"}
                </a>
              )}
              {service.githubUrl && (
                <a
                  href={service.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl hover:opacity-80 transition"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl hover:opacity-80 transition"
                style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                <MessageSquare size={16} /> Contact Me
              </button>
            </motion.div>

            {/* Hero image */}
            {service.heroImage && (
              <motion.div
                className="rounded-2xl overflow-hidden mb-12"
                style={{ border: "1px solid var(--border)", boxShadow: "0 4px 20px var(--shadow)" }}
                variants={fadeUp}
              >
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            {/* Full description */}
            <motion.div className="mb-12" variants={fadeUp}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>About this project</h2>
              <div className="leading-relaxed whitespace-pre-line text-base" style={{ color: "var(--text-secondary)" }}>
                {service.fullDescription || service.description}
              </div>
            </motion.div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-sm font-medium rounded-xl"
                      style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
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
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Features</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                      variants={fadeUp}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{typeof feature === "string" ? feature : feature.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Development Process */}
            {service.process && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Development Process</h2>
                <div className="leading-relaxed whitespace-pre-line text-base" style={{ color: "var(--text-secondary)" }}>
                  {service.process}
                </div>
              </motion.div>
            )}

            {/* Tools */}
            {service.tools && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Tools Used</h2>
                <div className="flex flex-wrap gap-2">
                  {(typeof service.tools === "string" ? JSON.parse(service.tools) : service.tools || []).map((tool, i) => (
                    <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                      {typeof tool === "string" ? tool : tool.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <motion.div className="mb-12" variants={fadeUp}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                      style={{ border: "1px solid var(--border)" }}
                      onClick={() => setLightbox(img)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img src={img} alt="" className="w-full h-40 object-cover" />
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
