import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function Testimonials() {
  const { testimonials: rawTestimonials } = usePortfolio();
  const testimonials = Array.isArray(rawTestimonials) ? rawTestimonials : [];
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)), [testimonials.length]);
  const next = useCallback(() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)), [testimonials.length]);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-testimonials)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#7865A6] dark:bg-[#BBA7E5]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7865A6] dark:text-[#BBA7E5]">
              Feedback &amp; Endorsements
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#26252B] dark:text-[#F6F4FA] tracking-tight">
            Testimonials
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id || current}
              className="rounded-3xl p-6 sm:p-10 text-center bg-white dark:bg-[#272530] border border-[#DED9E5] dark:border-[#3E394A] shadow-soft-sm relative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Quote size={28} className="mx-auto mb-4 text-[#7865A6] dark:text-[#BBA7E5] opacity-80" />

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-2xl mx-auto text-[#26252B] dark:text-[#F6F4FA] italic font-normal">
                &ldquo;{t.review}&rdquo;
              </p>

              <div>
                <p className="font-bold text-sm sm:text-base text-[#26252B] dark:text-[#F6F4FA]">{t.name}</p>
                <p className="text-xs text-[#5F5B66] dark:text-[#C5BED0] mt-0.5 font-medium">
                  {t.position}
                  {t.company ? ` at ${t.company}` : ""}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                type="button"
                onClick={prev}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#272530] border border-[#DED9E5] dark:border-[#3E394A] text-[#504172] dark:text-[#F6F4FA] hover:text-[#7865A6] dark:hover:text-[#BBA7E5] hover:border-[#7865A6]/40 transition cursor-pointer shadow-soft-xs"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs text-[#5F5B66] dark:text-[#C5BED0] font-mono">
                {current + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={next}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#272530] border border-[#DED9E5] dark:border-[#3E394A] text-[#504172] dark:text-[#F6F4FA] hover:text-[#7865A6] dark:hover:text-[#BBA7E5] hover:border-[#7865A6]/40 transition cursor-pointer shadow-soft-xs"
                aria-label="Next testimonial"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}