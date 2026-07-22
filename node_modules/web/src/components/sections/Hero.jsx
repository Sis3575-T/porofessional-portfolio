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

export default function Hero() {
  const { hero, loading, settings } = usePortfolio();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (loading) {
    return (
      <section id="hero" className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </section>
    );
  }

  const fullName   = hero?.name  || "Sisay Temesgen";
  const parts      = fullName.trim().split(" ");
  const firstName  = parts[0]           || "Sisay";
  const lastName   = parts.slice(1).join(" ") || "Temesgen";

  const fullTitle  = hero?.title || "Full Stack Developer & AI Enthusiast";

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
    <section id="hero" className="relative bg-white overflow-hidden py-0" style={{ minHeight: "72vh" }}>
      <div className="section-bg section-hero-bg">
        <div className="section-bg-pattern section-hero-pattern" />
      </div>

      <div className="relative z-10 w-full" style={{ minHeight: "72vh" }}>
        <div className="flex items-center h-full" style={{ gap: 40 }}>
          {/* LEFT COLUMN - 43% */}
          <div className="flex-1 pl-8 xl:pl-12 2xl:pl-16 flex items-center" style={{ maxWidth: "43%" }}>
            <motion.div
              className="w-full"
              style={{ maxWidth: 620 }}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {/* Name */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
                <h1
                  className="text-[#111111] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", maxWidth: 560 }}
                >
                  <span>{firstName}</span>
                  <br />
                  <span className="text-accent-blue">{lastName}</span>
                </h1>
              </motion.div>

              {/* Title */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="mt-4">
                <p
                  className="font-semibold leading-snug"
                  style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
                >
                  {fullTitle.split("&").map((part, i, arr) => (
                    <span key={i}>
                      <span className={i === 0 ? "text-accent-blue" : "text-accent-blue"}>
                        {part.trim()}
                      </span>
                      {i < arr.length - 1 && <span className="text-gray-300 mx-2">&</span>}
                    </span>
                  ))}
                </p>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="mt-5">
                <p
                  className="text-gray-500 leading-relaxed"
                  style={{ maxWidth: 520, fontSize: 17 }}
                >
                  {description}
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="mt-8 flex flex-wrap items-center" style={{ gap: 18 }}>
                <button
                  className="btn-ceramic font-semibold flex items-center gap-2.5"
                  style={{ height: 58, padding: "0 32px", borderRadius: 18, fontSize: 16 }}
                  onClick={() => scrollTo("projects")}
                >
                  {hero?.primaryCTA || "View My Work"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="btn-aluminum font-semibold flex items-center gap-2.5"
                  style={{ height: 58, padding: "0 32px", borderRadius: 18, fontSize: 16 }}
                  onClick={() => scrollTo("contact")}
                >
                  {hero?.secondaryCTA || "Contact Me"}
                  <Send size={16} />
                </button>
              </motion.div>

              {/* Social Icons */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.45 }} className="mt-8">
                <div className="flex items-center" style={{ gap: 12 }}>
                  {socialLinks.map(({ icon: Icon, href, label }) => {
                    const iconClass = label === "GitHub" ? "icon-github"
                      : label === "LinkedIn" ? "icon-linkedin"
                      : label === "Twitter" ? "text-gray-700"
                      : "icon-email";
                    return (
                      <motion.a
                        key={label}
                        href={href}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center ${iconClass} hover:opacity-70 transition-opacity`}
                        style={{
                          width: 50, height: 50, borderRadius: 14,
                        }}
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={label}
                      >
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - 57% */}
          <div className="flex-1 h-full flex items-center justify-center pr-8 xl:pr-12 2xl:pr-16" style={{ maxWidth: "57%" }}>
            <motion.div
              className="relative w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-200"
              style={{ height: "min(65vh, 680px)", boxShadow: "0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)" }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                    Loading 3D scene...
                  </div>
                }
              >
                <ThreeScene profileImage={heroImg} config={hero3dConfig} />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
