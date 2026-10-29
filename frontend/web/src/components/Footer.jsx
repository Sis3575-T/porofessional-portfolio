import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone, ArrowRight, ArrowUp } from "lucide-react";
import TelegramIcon from "./TelegramIcon";
import { usePortfolio } from "../context/PortfolioContext";
import { useProfile } from "../context/ProfileContext";

export default function Footer() {
  const { settings, about } = usePortfolio();
  const { name, email: profileEmail, siteTitle } = useProfile();

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
  const email = about?.email || profileEmail || "sisay3575@gmail.com";
  const githubUrl = socialLinks.github || "https://github.com/Sis3575-T";
  const linkedinUrl =
    socialLinks.linkedin ||
    "https://www.linkedin.com/in/sisay-temesgen-412290447/";
  const telegramUrl = socialLinks.telegram || "https://t.me/sisaytem";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const displayName = name || siteTitle || "Sisay Temesgen";

  return (
    <footer
      id="footer"
      className="relative border-t border-[#D8E5F8] dark:border-[#1E293B] bg-[#F7FAFE] dark:bg-[#0B0F17] py-4 sm:py-6 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright matching reference */}
          <div className="text-xs text-[#52607A] dark:text-[#94A3B8] text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {displayName}. All rights reserved.</p>
          </div>

          {/* Center: "Let's build something great together" + "Get In Touch ->" matching reference */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-[#52607A] dark:text-[#94A3B8] font-medium hidden sm:inline">
              Let&apos;s build something great together
            </span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover"
            >
              <span>Get In Touch</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Right: Social icons + Back to Top */}
          <div className="flex items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs"
              aria-label="Telegram Channel"
              title="Telegram"
            >
              <TelegramIcon size={14} />
            </a>
            <a
              href={`mailto:${email}`}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs"
              aria-label="Send Email"
              title="Email"
            >
              <Mail size={14} />
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs"
                aria-label="Call Phone"
                title="Phone"
              >
                <Phone size={14} />
              </a>
            )}
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition-all shadow-soft-xs cursor-pointer ml-1"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
