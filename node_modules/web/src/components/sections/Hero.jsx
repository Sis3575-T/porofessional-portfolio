import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Github, Linkedin, Twitter } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import ThreeScene from "../ThreeScene";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Hero() {
  const { hero, settings, loading } = usePortfolio();
  const hero3dConfig = settings?.hero3dConfig
    ? (() => { try { return JSON.parse(settings.hero3dConfig); } catch { return null; } })()
    : null;
  const isOfficeMode = hero3dConfig?.mode === "office";

  const [stats, setStats] = useState([
    { label: "Years Experience", value: 0, target: 5 },
    { label: "Projects Done", value: 0, target: 15 },
    { label: "Technologies", value: 0, target: 20 },
    { label: "Happy Clients", value: 0, target: 12 },
  ]);

  useEffect(() => {
    const intervals = stats.map((stat, i) => {
      return setInterval(() => {
        setStats((prev) => {
          const next = [...prev];
          if (next[i].value < next[i].target) {
            next[i] = { ...next[i], value: next[i].value + 1 };
          }
          return next;
        });
      }, 80 + i * 40);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20" aria-label="Hero section">
      {isOfficeMode ? (
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full bg-[#0a0a14]" />}>
            <ThreeScene profileImage={hero?.profileImage} config={hero3dConfig} />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14]/95 via-[#0a0a14]/60 to-transparent" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-cyan-950/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle" style={{ left: `${5 + i * 8}%`, bottom: `${10 + (i * 7) % 80}%`, animationDelay: `${i * 1.5}s` }} />
            ))}
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className={`space-y-8 ${isOfficeMode ? "rounded-xl p-8 backdrop-blur-sm" : ""}`}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="text-cyan-400 text-lg font-medium tracking-wide">
                {hero?.greeting || "Hello, I'm"}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {hero?.name || "Sisay Temesgen"}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-cyan-400">
                {hero?.title || "Full Stack Developer"}
              </h2>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                {hero?.description || "Building beautiful, responsive web applications with modern technologies."}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <motion.button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {hero?.primaryCTA || "View My Work"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-cyan-500 hover:text-cyan-400 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center gap-2 group"
              >
                {hero?.secondaryCTA || "Get In Touch"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all relative group"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon size={20} />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                  </span>
                </motion.a>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white">{stat.value}+</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {!isOfficeMode && (
            <motion.div
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-slate-800/50 rounded-2xl border border-slate-700/50" />
                <div className="absolute inset-2 rounded-xl overflow-hidden">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-slate-500 text-sm">Loading 3D...</div>
                    </div>
                  }>
                    <ThreeScene profileImage={hero?.profileImage} config={hero3dConfig} />
                  </Suspense>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-glow" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-glow animation-delay-1000" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.button
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-cyan-400 transition"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}
