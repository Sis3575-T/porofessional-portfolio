import { Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import ThreeScene from "../ThreeScene";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const socialLinks = [
  { icon: Github,   href: "https://github.com",            label: "GitHub"   },
  { icon: Linkedin, href: "https://linkedin.com",          label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",           label: "Twitter"  },
  { icon: Mail,     href: "mailto:sisaydev@example.com",   label: "Email"    },
];

// Fixed star positions (avoids hydration mismatch with Math.random in render)
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top:  ((i * 137.508) % 100).toFixed(2),
  left: ((i * 97.31)   % 100).toFixed(2),
  size: (1 + (i % 3) * 0.6).toFixed(1),
  opacity: (0.12 + (i % 5) * 0.08).toFixed(2),
  dur: (3 + (i % 4)).toFixed(0),
  delay: ((i % 5) * 0.8).toFixed(1),
}));

export default function Hero() {
  const { hero, loading, settings } = usePortfolio();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (loading) {
    return (
      <section id="hero" className="hero-section flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </section>
    );
  }

  const fullName   = hero?.name  || "Sisay Temesgen";
  const parts      = fullName.trim().split(" ");
  const firstName  = parts[0]           || "Sisay";
  const lastName   = parts.slice(1).join(" ") || "Temesgen";

  const fullTitle  = hero?.title || "Full Stack Developer & AI Enthusiast";
  const ampIdx     = fullTitle.indexOf("&");
  const titleBase  = ampIdx > -1 ? fullTitle.slice(0, ampIdx).trim() : fullTitle;
  const titleAccent = ampIdx > -1 ? fullTitle.slice(ampIdx + 1).trim() : "AI Enthusiast";

  const description = hero?.description ||
    "I build modern, responsive and high-performance web applications with clean code and great user experience.";

  const heroImg = hero?.profileImage || "/hero-developer.png";
  const hero3dConfig = (() => {
    if (!settings?.hero3dConfig) return { mode: "office", autoRotate: true, autoRotateSpeed: 0.3, mouseInteraction: true };
    try {
      return {
        mode: "office",
        autoRotate: true,
        autoRotateSpeed: 0.3,
        mouseInteraction: true,
        ...JSON.parse(settings.hero3dConfig),
      };
    } catch {
      return { mode: "office", autoRotate: true, autoRotateSpeed: 0.3, mouseInteraction: true };
    }
  })();

  return (
    <section id="hero" className="hero-section" aria-label="Hero section">

      {/* ── background ─────────────────────────────────── */}
      <div className="hero-bg" aria-hidden="true">
        {/* ambient glows */}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-glow-3" />

        {/* stars */}
        {STARS.map(s => (
          <span
            key={s.id}
            className="hero-star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width:  `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDuration:  `${s.dur}s`,
              animationDelay:     `${s.delay}s`,
            }}
          />
        ))}

        {/* accent dots */}
        <span className="hero-accent-dot" style={{ top: "22%", left: "3%",  background: "#facc15" }} />
        <span className="hero-accent-dot" style={{ top: "14%", right: "8%", background: "#22d3ee", animationDelay: "1s" }} />
        <span className="hero-accent-dot" style={{ bottom: "18%", left: "28%", background: "#60a5fa", animationDelay: "2s" }} />
        <span className="hero-accent-dot" style={{ top: "55%", right: "4%", background: "#a78bfa", animationDelay: "1.5s" }} />
      </div>

      {/* ── layout ─────────────────────────────────────── */}
      <div className="hero-layout">

        {/* LEFT — text */}
        <div className="hero-left">
          <motion.div
            className="hero-content"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                👋&nbsp; {hero?.greeting || "Hello, I'm"}
              </span>
            </motion.div>

            {/* name */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
              <h1 className="hero-name">
                <span className="hero-name-white">{firstName}&nbsp;</span>
                <span className="hero-name-blue">{lastName}</span>
              </h1>
            </motion.div>

            {/* title */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
              <p className="hero-title">
                {titleBase}&nbsp;&amp;&nbsp;
                <span className="hero-title-accent">{titleAccent}</span>
              </p>
            </motion.div>

            {/* description */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
              <p className="hero-desc">{description}</p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="hero-btns">
              <button className="hero-btn-primary group" onClick={() => scrollTo("projects")}>
                {hero?.primaryCTA || "View My Work"}
                <ArrowRight size={16} className="hero-btn-icon group-hover:translate-x-1" />
              </button>
              <button className="hero-btn-secondary group" onClick={() => scrollTo("contact")}>
                {hero?.secondaryCTA || "Contact Me"}
                <Send size={14} className="hero-btn-icon group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>

            {/* social */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="hero-social-wrap">
              <p className="hero-social-label">Connect with me</p>
              <div className="hero-social-row">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="hero-social-btn"
                    whileHover={{ scale: 1.12, y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={label}
                  >
                    <Icon size={17} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — 3D room scene */}
        <div className="hero-right" aria-hidden="true">
          <motion.div
            className="hero-scene-shell"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <Suspense fallback={<div className="hero-scene-fallback">Loading 3D scene...</div>}>
              <ThreeScene profileImage={heroImg} config={hero3dConfig} />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
