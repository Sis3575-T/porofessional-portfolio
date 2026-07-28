import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";
import { useAnalytics } from "../hooks/useAnalytics";
import Logo from "./Logo";

const navItems = [
  { label: "Home",     href: "#hero" },
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { siteTitle } = useProfile();
  const { trackEvent } = useAnalytics();
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleClick = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 flex justify-start pointer-events-none">
        <div className="pointer-events-auto flex items-center pl-2 pr-0 mt-3 ml-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/60 w-full"
          style={{ height: 108, boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
          {/* Logo */}
          <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick("#hero"); }} className="flex items-center justify-center shrink-0 cursor-pointer mr-8">
            <Logo />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2 mx-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/resume.pdf"
              onClick={() => trackEvent("resume_download")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 shadow-sm"
              aria-label="Download CV"
            >
              <Download size={14} />
              <span className="hidden lg:inline">Download CV</span>
            </a>

            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 transition-all duration-200 shadow-sm"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 transition-all"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-72 z-50 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 shadow-2xl flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Logo />
                  <span className="text-lg font-bold text-gray-900">{siteTitle || "Portfolio"}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleClick(item.href)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={toggle}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                >
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
                <a
                  href="/resume.pdf"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-all"
                >
                  <Download size={16} />
                  Download CV
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
