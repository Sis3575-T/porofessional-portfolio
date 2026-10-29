import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Github,
  Linkedin,
  MessageSquare,
} from "lucide-react";
import TelegramIcon from "./TelegramIcon";
import { usePortfolio } from "../context/PortfolioContext";
import { useProfile } from "../context/ProfileContext";

export default function HomeContactStrip() {
  const { about, settings } = usePortfolio();
  const { email: profileEmail } = useProfile();

  const email = about?.email || profileEmail || "sisay3575@gmail.com";
  const phone = settings?.contactPhone || about?.phone || "0935756054";
  const location = about?.location || settings?.address || "Bahir Dar, Ethiopia";

  const socialLinks = (() => {
    try {
      const raw = settings?.socialLinks;
      if (!raw) return {};
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return {};
    }
  })();

  const githubUrl = socialLinks.github || "https://github.com/Sis3575-T";
  const linkedinUrl =
    socialLinks.linkedin ||
    "https://www.linkedin.com/in/sisay-temesgen-412290447/";
  const telegramUrl =
    socialLinks.telegram ||
    "https://t.me/sisaytem";

  return (
    <section className="py-6 sm:py-8 relative bg-[#F7FAFE] dark:bg-[#0B0F17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-[24px] bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-3d p-5 sm:p-6 lg:p-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Headlines & Invitation (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
                  Get In Touch
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight mb-2">
                Let&apos;s Build Something <br className="hidden sm:inline" />
                <span className="text-[#246BFD] dark:text-[#3B82F6]">Exceptional Together</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] leading-relaxed max-w-xl mb-5">
                Whether you have an internship opportunity, a project proposal, or want to discuss full-stack engineering and AI solutions, I&apos;d love to connect.
              </p>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white text-xs sm:text-sm font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover"
                >
                  <MessageSquare size={15} />
                  <span>Send a Message</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#161F30] text-[#14213D] dark:text-[#F8FAFC] border border-[#D8E5F8] dark:border-[#1E293B] hover:bg-[#EDF4FD] dark:hover:bg-[#111827] text-xs sm:text-sm font-semibold transition-all shadow-soft-xs hover:-translate-y-0.5"
                >
                  <span>Explore Work</span>
                </Link>
              </div>
            </div>

            {/* Right: Contact Information & Social Badges (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {/* Email Card */}
              <a
                href={`mailto:${email}`}
                className="p-3 rounded-xl bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] flex items-center gap-3 hover:border-[#246BFD]/60 hover:-translate-y-0.5 transition-all shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25">
                  <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#52607A] dark:text-[#94A3B8]">
                    Email Address
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#14213D] dark:text-[#F8FAFC] truncate group-hover:text-[#246BFD] transition-colors">
                    {email}
                  </p>
                </div>
              </a>

              {/* Phone Card */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="p-3 rounded-xl bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] flex items-center gap-3 hover:border-[#246BFD]/60 hover:-translate-y-0.5 transition-all shadow-2xs group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#52607A] dark:text-[#94A3B8]">
                      Phone Number
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#14213D] dark:text-[#F8FAFC] truncate group-hover:text-[#246BFD] transition-colors">
                      {phone}
                    </p>
                  </div>
                </a>
              )}

              {/* Location Card */}
              <div className="p-3 rounded-xl bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#E7F0FF] to-[#EDF4FD] dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/10 text-[#246BFD] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-[#D8E5F8]/70 dark:border-[#246BFD]/25">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#52607A] dark:text-[#94A3B8]">
                    Location
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#14213D] dark:text-[#F8FAFC] truncate">
                    {location}
                  </p>
                </div>
              </div>

              {/* Social Channels Row */}
              <div className="pt-1.5 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#52607A] dark:text-[#94A3B8] mr-1">
                  Connect:
                </span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition shadow-soft-xs"
                  aria-label="GitHub Profile"
                >
                  <Github size={14} />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition shadow-soft-xs"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition shadow-soft-xs"
                  aria-label="Telegram Channel"
                >
                  <TelegramIcon size={14} />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition shadow-soft-xs"
                  aria-label="Send Email"
                >
                  <Mail size={14} />
                </a>
                <a
                  href={`tel:${phone}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7FAFE] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B] text-[#14213D] dark:text-[#F8FAFC] hover:text-[#246BFD] dark:hover:text-[#3B82F6] hover:border-[#246BFD] hover:-translate-y-0.5 transition shadow-soft-xs"
                  aria-label="Call Phone"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
