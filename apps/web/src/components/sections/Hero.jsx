import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown, Github, Linkedin, Twitter } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function Hero() {
  const { hero, loading } = usePortfolio();
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
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-cyan-400 text-lg font-medium tracking-wide animate-fadeIn">
                {hero?.greeting || "Hello, I'm"}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {hero?.name || "Sisay Temesgen"}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {hero?.title || "Full Stack Developer"}
              </h2>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                {hero?.description || "Building beautiful, responsive web applications with modern technologies."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 rounded-lg font-semibold hover:from-cyan-400 hover:to-cyan-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {hero?.primaryCTA || "View My Work"}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-cyan-500 hover:text-cyan-400 transition-all"
              >
                {hero?.secondaryCTA || "Get In Touch"}
              </button>
            </div>

            <div className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Twitter, href: "https://twitter.com" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white">{stat.value}+</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 border border-slate-700/50 flex items-center justify-center animate-float">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍💻</div>
                  <p className="text-slate-400 text-sm">Interactive 3D Scene</p>
                  <p className="text-slate-500 text-xs">Coming Soon</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-glow" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-glow animation-delay-1000" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-cyan-400 transition animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
