import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { AnimatedSection } from "../AnimatedSection";

export default function Testimonials() {
  const { testimonials, loading } = usePortfolio();
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)), [testimonials.length]);
  const next = useCallback(() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)), [testimonials.length]);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (loading) {
    return (
      <section id="testimonials" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="h-48 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <AnimatedSection id="testimonials" theme="testimonials" className="py-32 overflow-hidden" aria-label="Testimonials section">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-slate-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Testimonials
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Clients Say
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-slate-400 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Testimonials from people I've worked with
        </motion.p>

        <div className="relative">
          <motion.div
            className="absolute -top-4 left-0 text-white/5"
            initial={{ opacity: 0, rotate: -20 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Quote size={80} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star size={18} className={i < t.rating ? "text-white fill-white" : "text-slate-600"} />
                  </motion.div>
                ))}
              </div>

              <motion.blockquote
                className="text-lg text-slate-300 mb-8 leading-relaxed italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                &ldquo;{t.review}&rdquo;
              </motion.blockquote>

              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.position} at {t.company}</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <motion.div
              className="flex justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={prev}
                className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current ? "bg-gray-900 w-6" : "bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === current ? "true" : undefined}
                  />
                ))}
              </div>
              <motion.button
                onClick={next}
                className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
