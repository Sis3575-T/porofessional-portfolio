import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Code2,
  Github,
  Linkedin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import TelegramIcon from "../TelegramIcon";
import { resolveUrl } from "../../utils/resolveUrl";
import { usePortfolio } from "../../context/PortfolioContext";
import { useProfile } from "../../context/ProfileContext";
import { useTheme } from "../../context/ThemeContext";

// Tech stack chips matching reference
const TECH_STACK = [
  {
    name: "JavaScript",
    color: "#F7DF1E",
    bg: "rgba(247, 223, 30, 0.12)",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.5c-.88 0-1.45-.48-1.75-1.14l1.1-.64c.18.36.42.59.78.59.45 0 .75-.24.75-.72V9.8h1.35v4.83c0 1.25-.87 1.87-2.23 1.87zm4.5 0c-1.32 0-2.14-.77-2.14-1.95 0-1.34 1.05-1.72 2.05-1.95.73-.17.95-.31.95-.65 0-.32-.28-.54-.72-.54-.48 0-.8.24-.98.63l-1.07-.63c.35-.7 1.07-1.15 2.05-1.15 1.25 0 2.07.72 2.07 1.83v2.44c0 .54.1.72.33.72.1 0 .21-.02.31-.07v1.1c-.2.08-.48.17-.82.17-.72 0-1.02-.38-1.02-.95-.36.65-.95.95-1.81.95z" />
      </svg>
    ),
  },
  {
    name: "React",
    color: "#61DAFB",
    bg: "rgba(97, 218, 251, 0.12)",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.8" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#339933",
    bg: "rgba(51, 153, 51, 0.12)",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7.7v10.6L12 24l10-5.7V7.7L12 2zm0 2.3l7.8 4.5v8.4L12 21.7 4.2 17.2V8.8L12 4.3z" />
      </svg>
    ),
  },
  {
    name: "Express",
    color: "#475569",
    bg: "rgba(71, 85, 105, 0.12)",
    icon: <span className="font-mono text-[10px] font-bold">ex</span>,
  },
  {
    name: "MongoDB",
    color: "#47A248",
    bg: "rgba(71, 162, 72, 0.12)",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5C11.5 3.5 6 9.5 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-5.5-5.5-11.5-6-13.5zm0 18c-2.2 0-4-1.8-4-4 0-3.3 3.3-7.5 4-8.8.7 1.3 4 5.5 4 8.8 0 2.2-1.8 4-4 4z" />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    color: "#336791",
    bg: "rgba(51, 103, 145, 0.12)",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 3.53 2.04 6.58 5 8.05v-2.29c-1.78-.96-3-2.83-3-4.76 0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.93-1.22 3.8-3 4.76v2.29c2.96-1.47 5-4.52 5-8.05 0-4.97-4.03-9-9-9z" />
      </svg>
    ),
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};

export default function Hero() {
  const { hero, about, settings } = usePortfolio();
  const { name: profileName } = useProfile();
  const { dark } = useTheme();

  const rawName = hero?.name || profileName || "Sisay Temesgen";
  const fullName = rawName.replace(/^(hi,?\s*i'm\s*|hello,?\s*i'm\s*)/i, "").trim() || "Sisay Temesgen";
  const rawCvUrl = about?.downloadCVUrl;
  const cvUrl = rawCvUrl ? resolveUrl(rawCvUrl) : null;

  // Real contact channels with settings/about fallback
  const socialLinks = (() => {
    try {
      const raw = settings?.socialLinks;
      if (!raw) return {};
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return {};
    }
  })();

  const phone = settings?.contactPhone || about?.phone || "0935756054";
  const email = about?.email || settings?.contactEmail || "sisay3575@gmail.com";
  const linkedinUrl = socialLinks.linkedin || "https://www.linkedin.com/in/sisay-temesgen-412290447/";
  const telegramUrl = socialLinks.telegram || "https://t.me/sisaytem";
  const githubUrl = socialLinks.github || "https://github.com/Sis3575-T";

  // Resolve user's authentic portrait photo: pure white background in both light and dark modes
  const defaultPhoto = "/sisay-portrait.jpg";
  const photoSrc =
    hero?.profileImage && !hero.profileImage.includes("hero-developer.png")
      ? resolveUrl(hero.profileImage)
      : defaultPhoto;

  const handleDownloadCV = async () => {
    if (cvUrl) {
      try {
        const downloadTarget = cvUrl.includes("?")
          ? `${cvUrl}&download=true`
          : `${cvUrl}?download=true`;
        const res = await fetch(downloadTarget);
        if (!res.ok) throw new Error("Network response not ok");
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "Sisay_Temesgen_CV.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } catch {
        const fallbackUrl = cvUrl.includes("?") ? `${cvUrl}&download=true` : `${cvUrl}?download=true`;
        window.location.href = fallbackUrl;
      }
    } else {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#about");
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[calc(100svh-56px)] sm:min-h-[calc(100svh-64px)] flex flex-col justify-center overflow-hidden transition-colors"
      style={{ background: "var(--section-hero)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full flex-1 flex flex-col justify-center">
        {/* Two-column layout: LEFT = Real Photo Portrait (~40%), RIGHT = Introduction & Controls (~60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* LEFT COLUMN: Real Photo Portrait with Professional Borderless 3D Depth */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] group">
              <div className="relative w-full aspect-[4/5] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white shadow-md sm:shadow-lg shadow-black/5 dark:shadow-black/25">
                <img
                  src={photoSrc}
                  alt={fullName}
                  width={1086}
                  height={1448}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02] bg-white select-none"
                  onError={(e) => {
                    if (e.currentTarget.src !== defaultPhoto) {
                      e.currentTarget.src = defaultPhoto;
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Profile info, headlines, actions, social links, tech stack */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Pill Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.25 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F0FF] dark:bg-[#246BFD]/15 border border-[#D8E5F8] dark:border-[#246BFD]/30 mb-2 sm:mb-2.5 shadow-soft-xs">
                <Code2 size={13} className="text-[#246BFD] dark:text-[#3B82F6]" />
                <span className="text-xs font-semibold text-[#14213D] dark:text-[#F8FAFC] tracking-wide">
                  {hero?.title || "Full-Stack Developer & AI Learner"}
                </span>
              </div>
            </motion.div>

            {/* Main Name displayed ONCE */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.25 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#14213D] dark:text-[#F8FAFC] leading-[1.12]">
                <span className="text-[#246BFD] dark:text-[#3B82F6]">{fullName}</span>
              </h1>
            </motion.div>

            {/* Second Headline Line */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.25 }} className="mt-1.5">
              <h2 className="text-lg sm:text-2xl lg:text-[25px] font-bold text-[#14213D] dark:text-[#F8FAFC] tracking-tight leading-snug">
                Building Modern Web Solutions <br className="hidden sm:inline" />
                for a Better Tomorrow
              </h2>
            </motion.div>

            {/* Concise Bio Paragraph */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.25 }} className="mt-2.5">
              <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] leading-relaxed max-w-xl font-normal">
                {hero?.description || "I'm a 4th-year Computer Science student at Bahir Dar University. I specialize in modern web technologies, robust backend services, and I'm passionate about solving real-world challenges with AI."}
              </p>
            </motion.div>

            {/* Action Buttons: "View My Work" (links to /projects) and "About Me" (scrolls to #about) */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.25 }}
              className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3"
            >
              {/* Primary "View My Work" button -> Dedicated Projects Page */}
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white font-semibold text-xs sm:text-sm transition-all shadow-btn-3d hover:shadow-soft-3d-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD]"
              >
                <span>{hero?.primaryCTA || "View My Work"}</span>
                <ArrowRight size={14} />
              </Link>

              {/* Secondary "About Me" button -> Smoothly scrolls to About */}
              <a
                href="#about"
                onClick={scrollToAbout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#161F30] text-[#14213D] dark:text-[#F8FAFC] border border-[#D8E5F8] dark:border-[#1E293B] hover:bg-[#EDF4FD] dark:hover:bg-[#111827] hover:border-[#246BFD] font-semibold text-xs sm:text-sm transition-all shadow-soft-xs hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD]"
              >
                <span>{hero?.secondaryCTA || "About Me"}</span>
                <User size={13} className="text-[#246BFD] dark:text-[#3B82F6]" />
              </a>

              {/* CV Download / Contact secondary */}
              {cvUrl ? (
                <button
                  type="button"
                  onClick={handleDownloadCV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-transparent text-[#52607A] dark:text-[#94A3B8] hover:text-[#246BFD] dark:hover:text-[#3B82F6] font-medium text-xs sm:text-sm transition cursor-pointer"
                  title="Download CV"
                >
                  <Download size={13} />
                  <span>Resume</span>
                </button>
              ) : null}
            </motion.div>

            {/* Social Media Links Row: GitHub, LinkedIn, Telegram, Email, Phone */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.25 }}
              className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#52607A] dark:text-[#94A3B8] mr-1">
                Connect:
              </span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] transition shadow-soft-xs hover:-translate-y-0.5"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] transition shadow-soft-xs hover:-translate-y-0.5"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] transition shadow-soft-xs hover:-translate-y-0.5"
                aria-label="Telegram Channel"
                title="Telegram @sisaytem"
              >
                <TelegramIcon size={14} />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] transition shadow-soft-xs hover:-translate-y-0.5"
                aria-label="Send Email"
                title="Email: sisay3575@gmail.com"
              >
                <Mail size={14} />
              </a>
              <a
                href={`tel:${phone}`}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] transition shadow-soft-xs hover:-translate-y-0.5"
                aria-label="Call Phone"
                title="Phone: 0935756054"
              >
                <Phone size={14} />
              </a>
            </motion.div>

            {/* Tech Stack Chips */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.25 }}
              className="mt-4 sm:mt-5 pt-3 border-t border-[#D8E5F8]/70 dark:border-[#1E293B]/70"
            >
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {TECH_STACK.map((tech) => (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-xs text-xs font-semibold text-[#14213D] dark:text-[#F8FAFC] hover:border-[#246BFD]/60 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ color: tech.color }}
                    >
                      {tech.icon}
                    </span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
