import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Linkedin,
  Github,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Eye,
  Download,
} from "lucide-react";
import TelegramIcon from "../../TelegramIcon";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useProfile } from "../../../context/ProfileContext";
import { useTheme } from "../../../context/ThemeContext";
import { resolveUrl } from "../../../utils/resolveUrl";

export default function AboutSection() {
  const { about, settings } = usePortfolio();
  const { name: profileName } = useProfile();
  const { dark } = useTheme();

  // Social & contact links
  const phone = settings?.contactPhone || about?.phone || "0935756054";
  const email = about?.email || settings?.contactEmail || "sisay3575@gmail.com";

  const socialLinks = (() => {
    try {
      const raw = settings?.socialLinks;
      if (!raw) return {};
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return {};
    }
  })();

  const linkedinUrl =
    socialLinks.linkedin ||
    "https://www.linkedin.com/in/sisay-temesgen-412290447/";
  const telegramUrl =
    socialLinks.telegram ||
    "https://t.me/sisaytem";
  const githubUrl =
    socialLinks.github ||
    "https://github.com/Sis3575-T";

  // CV URL (prefers dynamic admin upload, fallback to local verified CV asset)
  const rawCvUrl = about?.downloadCVUrl;
  const cvUrl = rawCvUrl ? resolveUrl(rawCvUrl) : "/Sisay_Temesgen_CV.pdf";

  const handleDownloadCV = async (e) => {
    if (e) e.preventDefault();
    try {
      const downloadTarget = cvUrl.includes("?")
        ? `${cvUrl}&download=true`
        : `${cvUrl}?download=true`;
      const res = await fetch(downloadTarget);
      if (!res.ok) throw new Error("Network response not ok");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Sisay_Temesgen_CV.pdf";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch {
      const fallbackUrl = cvUrl.includes("?") ? `${cvUrl}&download=true` : `${cvUrl}?download=true`;
      window.location.href = fallbackUrl;
    }
  };

  // Two concise, reference-matched paragraphs
  const bioLines = about?.biography ? about.biography.split("\n").filter((l) => l.trim().length > 0) : [];
  const paragraph1 =
    about?.biographyParagraph1 ||
    (bioLines.length > 0
      ? bioLines[0]
      : "I'm a 4th-year Computer Science student at Bahir Dar University. I specialize in modern web technologies and I'm passionate about solving real-world challenges with technology.");

  const paragraph2 =
    about?.biographyParagraph2 ||
    (bioLines.length > 1
      ? bioLines.slice(1).join(" ")
      : (about?.biography ? "" : "I enjoy building full-stack applications, exploring AI, and continuously learning new tools and technologies to create useful and impactful solutions."));

  // Image source: 3D developer illustration with clean studio white background, or custom admin uploaded illustration
  const illustrationSrc =
    about?.profileImage && !about.profileImage.includes("sisay-portrait")
      ? resolveUrl(about.profileImage)
      : "/developer-3d-illustration.png";

  return (
    <section
      id="about"
      className="py-8 sm:py-12 lg:py-14 relative transition-colors scroll-mt-14"
      style={{ background: "var(--section-about)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Badge, Heading, Bio, Button & Restructured Quick Facts (~48% width: 6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Small elegant 3D About Badge matching reference */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F0FF] dark:bg-[#246BFD]/15 text-[#246BFD] dark:text-[#3B82F6] text-xs font-semibold mb-3 border border-[#D8E5F8] dark:border-[#246BFD]/30 w-fit shadow-soft-xs">
              <User size={13} className="text-[#246BFD] dark:text-[#3B82F6]" />
              <span>About</span>
            </div>

            {/* Heading matching reference: "About Me" */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight mb-3 text-[#14213D] dark:text-[#F8FAFC] leading-tight">
              About <span className="text-[#246BFD] dark:text-[#3B82F6]">Me</span>
            </h2>

            {/* Concise Biography (Paragraph 1) */}
            <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] leading-relaxed mb-3 max-w-xl font-normal">
              {paragraph1}
            </p>

            {/* Concise Biography (Paragraph 2) */}
            <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] leading-relaxed mb-5 max-w-xl font-normal">
              {paragraph2}
            </p>

            {/* "Explore My Background" Tactile 3D Action Button */}
            <div className="mb-6">
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white text-xs sm:text-sm font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD]"
              >
                <span>Explore My Background</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            {/* Restructured Quick Facts Card with 3D Depth */}
            <div className="rounded-2xl bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] p-4 sm:p-5 shadow-soft-3d max-w-lg transition-all">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D8E5F8]/60 dark:border-[#1E293B]">
                <h3 className="text-xs font-bold text-[#14213D] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Quick Facts
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/15 text-[#059669] dark:text-[#34D399] text-[10px] font-bold border border-[#A7F3D0]/60 dark:border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Available
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Phone */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F0F5FC]/80 dark:hover:bg-[#111827]/80 transition-colors group">
                  <div className="flex items-center gap-2.5 text-[#52607A] dark:text-[#94A3B8] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#246BFD]/20 dark:to-[#246BFD]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25 shadow-2xs">
                      <Phone size={13} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#14213D] dark:text-[#F8FAFC]">
                      Phone
                    </span>
                  </div>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] px-2 py-0.5 rounded-lg hover:bg-white dark:hover:bg-[#161F30] hover:shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#246BFD]"
                    title="Call Sisay Temesgen"
                  >
                    <ChevronRight size={13} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    <span>{phone}</span>
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F0F5FC]/80 dark:hover:bg-[#111827]/80 transition-colors group">
                  <div className="flex items-center gap-2.5 text-[#52607A] dark:text-[#94A3B8] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#246BFD]/20 dark:to-[#246BFD]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25 shadow-2xs">
                      <Mail size={13} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#14213D] dark:text-[#F8FAFC]">
                      Email
                    </span>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] px-2 py-0.5 rounded-lg hover:bg-white dark:hover:bg-[#161F30] hover:shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#246BFD] truncate"
                    title="Send email to Sisay Temesgen"
                  >
                    <ChevronRight size={13} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    <span className="truncate">{email}</span>
                  </a>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F0F5FC]/80 dark:hover:bg-[#111827]/80 transition-colors group">
                  <div className="flex items-center gap-2.5 text-[#52607A] dark:text-[#94A3B8] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#246BFD]/20 dark:to-[#246BFD]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25 shadow-2xs">
                      <Linkedin size={13} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#14213D] dark:text-[#F8FAFC]">
                      LinkedIn
                    </span>
                  </div>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] px-2 py-0.5 rounded-lg hover:bg-white dark:hover:bg-[#161F30] hover:shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#246BFD]"
                    title="Open LinkedIn Profile"
                  >
                    <ChevronRight size={13} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    <span>View LinkedIn Profile</span>
                    <ExternalLink size={10} className="shrink-0 ml-0.5 opacity-75" />
                  </a>
                </div>

                {/* Telegram */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F0F5FC]/80 dark:hover:bg-[#111827]/80 transition-colors group">
                  <div className="flex items-center gap-2.5 text-[#52607A] dark:text-[#94A3B8] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#246BFD]/20 dark:to-[#246BFD]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25 shadow-2xs">
                      <TelegramIcon size={13} className="text-[#246BFD] dark:text-[#3B82F6]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#14213D] dark:text-[#F8FAFC]">
                      Telegram
                    </span>
                  </div>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] px-2 py-0.5 rounded-lg hover:bg-white dark:hover:bg-[#161F30] hover:shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#246BFD]"
                    title="Open Telegram @sisaytem"
                  >
                    <ChevronRight size={13} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    <span>@sisaytem</span>
                  </a>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F0F5FC]/80 dark:hover:bg-[#111827]/80 transition-colors group">
                  <div className="flex items-center gap-2.5 text-[#52607A] dark:text-[#94A3B8] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#246BFD]/20 dark:to-[#246BFD]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25 shadow-2xs">
                      <Github size={13} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#14213D] dark:text-[#F8FAFC]">
                      GitHub
                    </span>
                  </div>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#246BFD] dark:text-[#3B82F6] hover:text-[#1858DF] px-2 py-0.5 rounded-lg hover:bg-white dark:hover:bg-[#161F30] hover:shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#246BFD]"
                    title="Open GitHub Profile"
                  >
                    <ChevronRight size={13} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    <span>View GitHub Profile</span>
                    <ExternalLink size={10} className="shrink-0 ml-0.5 opacity-75" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Developer Artwork & Underneath CV Buttons (~52% width: 6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
            {/* Soft 3D Ambient Radial Glow */}
            <div
              className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#246BFD]/12 via-[#60A5FA]/10 to-transparent blur-3xl pointer-events-none -z-10"
              aria-hidden="true"
            />

            <motion.div
              className="relative w-full max-w-[500px] flex items-center justify-center rounded-[24px] sm:rounded-[28px] bg-white shadow-soft-3d overflow-hidden"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <img
                src={illustrationSrc}
                alt="3D illustration of a developer working at a laptop"
                width={480}
                height={390}
                loading="eager"
                decoding="async"
                className="w-full h-auto object-contain select-none transition-transform duration-300 hover:scale-[1.01] bg-white"
                onError={(e) => {
                  if (e.currentTarget.src !== "/developer-3d-illustration.png") {
                    e.currentTarget.src = "/developer-3d-illustration.png";
                  }
                }}
              />
            </motion.div>

            {/* View CV & Download CV Action Buttons Directly Below the 3D Illustration */}
            <motion.div
              className="mt-3 sm:mt-3.5 flex flex-wrap items-center justify-center gap-3 w-full max-w-[480px] z-10 px-2"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
            >
              {/* Primary "View CV" button */}
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white font-semibold text-xs sm:text-sm transition-all shadow-btn-3d hover:shadow-soft-3d-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD] min-w-[140px]"
                aria-label="View CV in new tab"
                title="View CV in new tab"
              >
                <Eye size={15} className="shrink-0" />
                <span>View CV</span>
              </a>

              {/* Secondary "Download CV" button */}
              <button
                type="button"
                onClick={handleDownloadCV}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#161F30] text-[#14213D] dark:text-[#F8FAFC] border border-[#D8E5F8] dark:border-[#1E293B] hover:bg-[#EDF4FD] dark:hover:bg-[#111827] hover:border-[#246BFD] font-semibold text-xs sm:text-sm transition-all shadow-soft-xs hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD] min-w-[140px]"
                aria-label="Download Sisay Temesgen CV PDF"
                title="Download CV"
              >
                <Download size={15} className="shrink-0 text-[#246BFD] dark:text-[#3B82F6]" />
                <span>Download CV</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
