import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home, User, Code, Briefcase, Settings, PenTool, BookOpen, Mail,
  Download, Sun, Moon, Github, Linkedin, Twitter,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { usePortfolio } from "../context/PortfolioContext";

const navItems = [
  { label: "Home",     href: "#hero",       icon: Home },
  { label: "About",    href: "#about",      icon: User },
  { label: "Skills",   href: "#skills",     icon: Code },
  { label: "Projects", href: "#projects",   icon: Briefcase },
  { label: "Services", href: "#services",   icon: Settings },
  { label: "Experience", href: "#experience", icon: PenTool },
  { label: "Education", href: "#education",   icon: BookOpen },
  { label: "Contact",  href: "#contact",    icon: Mail },
];

const socialItems = [
  { icon: Github,   href: "https://github.com",    label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com",  label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",   label: "Twitter" },
  { icon: Mail,     href: "mailto:hello@example.com", label: "Email" },
];

export default function Sidebar() {
  const { dark, toggle } = useTheme();
  const { settings } = usePortfolio();
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const ids = navItems.map((item) => item.href.slice(1));
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const sidebarW = expanded ? 260 : 95;

  return (
    <motion.aside
      className="fixed left-[18px] top-[18px] z-40 select-none"
      style={{ height: "96vh" }}
      animate={{ width: sidebarW }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Layer 2: Floating Sidebar Panel */}
      <div className="w-full h-full rounded-[26px] bg-[#F8F8F8] border border-[#E5E7EB] shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-col overflow-hidden">
        <div className="flex flex-col h-full p-4 gap-4">
          {/* TOP: Logo Card */}
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleClick("#hero"); }}
            className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer shrink-0"
            style={{ height: 80, padding: "0 20px" }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-[42px] h-[42px] rounded-xl bg-accent-blue flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9"/>
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
              </svg>
            </div>
            <motion.span
              className="text-[17px] font-bold text-[#111111] tracking-tight whitespace-nowrap"
              animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -8 }}
              transition={{ duration: 0.2 }}
            >
              SISAY DEV
            </motion.span>
          </motion.a>

          {/* CENTER: Navigation Cards */}
          <nav className="flex-1 flex flex-col gap-3 overflow-y-auto sidebar-scrollbar py-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`flex items-center gap-4 bg-white rounded-[18px] border transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "border-l-[3px] border-l-accent-blue border-[#E5E7EB] shadow-accent-blue"
                      : "border-[#E5E7EB] shadow-sm hover:shadow-md"
                  }`}
                  style={{ height: 70, padding: "0 20px" }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`w-[28px] h-[28px] flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive ? "text-accent-blue" : "text-gray-400"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <motion.span
                    className={`text-[16px] font-semibold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                      isActive ? "text-accent-blue" : "text-[#555555]"
                    }`}
                    animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                  {isActive && expanded && (
                    <motion.div
                      className="ml-auto w-[6px] h-[6px] rounded-full bg-accent-blue"
                      layoutId="activeDot"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* LOWER: Theme + Download */}
          <div className="flex flex-col gap-3 shrink-0">
            <motion.button
              onClick={toggle}
              className="flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              style={{ height: 70, padding: "0 20px" }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-[28px] h-[28px] flex items-center justify-center shrink-0 text-gray-400">
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <motion.span
                className="text-[16px] font-semibold text-[#555555] whitespace-nowrap"
                animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? "Light Mode" : "Dark Mode"}
              </motion.span>
            </motion.button>

            <motion.a
              href="/resume.pdf"
              className="flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-300"
              style={{ height: 70, padding: "0 20px" }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-[28px] h-[28px] flex items-center justify-center shrink-0 text-gray-400">
                <Download size={20} />
              </div>
              <motion.span
                className="text-[16px] font-semibold text-[#555555] whitespace-nowrap"
                animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                Download CV
              </motion.span>
            </motion.a>
          </div>

          {/* BOTTOM: Social Icons */}
          <div className="flex justify-center gap-3 shrink-0 pt-1">
            {socialItems.map(({ icon: Icon, href, label }) => {
              const iconClass = label === "GitHub" ? "icon-github"
                : label === "LinkedIn" ? "icon-linkedin"
                : label === "Twitter" ? "icon-email"
                : "icon-email";
              return (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center ${iconClass}`}
                  whileHover={{ y: -3, rotate: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
