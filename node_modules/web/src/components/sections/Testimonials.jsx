import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function Testimonials() {
  const { testimonials, loading } = usePortfolio();
  const [current, setCurrent] = useState(0);

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

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          What <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Clients</span> Say
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Testimonials from people I've worked with
        </p>

        <div className="relative">
          <Quote className="absolute -top-4 left-0 text-cyan-500/10" size={80} />

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
              ))}
            </div>

            <blockquote className="text-lg text-slate-300 mb-8 leading-relaxed italic">
              &ldquo;{t.review}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {t.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-slate-400">{t.position} at {t.company}</p>
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current ? "bg-cyan-400 w-6" : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
