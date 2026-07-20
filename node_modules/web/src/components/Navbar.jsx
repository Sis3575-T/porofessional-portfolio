import { useState, useEffect } from "react";
import { Menu, X, Download, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems.map((item) => item.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "navbar-scrolled border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); handleClick("#hero"); }}
              className="flex items-center gap-2.5 group"
              aria-label="SISAY DEV - Go to homepage"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 group-hover:shadow-blue-500/50 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9"/>
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
                  <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-white tracking-wider">
                SISAY <span className="text-cyan-400">DEV</span>
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    className={`nav-text-link ${isActive ? "nav-text-link-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Download CV Button */}
              <a
                href="/resume.pdf"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-300 group"
                aria-label="Download CV"
              >
                Download CV
                <Download size={13} className="group-hover:translate-y-0.5 transition-transform duration-300" />
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-full border border-white/15 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <Sun
                    size={15}
                    className={`absolute transition-all duration-500 ${dark ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
                  />
                  <Moon
                    size={15}
                    className={`absolute transition-all duration-500 ${dark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
                  />
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 h-full w-72 sidebar-3d z-50 flex flex-col rounded-r-[28px] shadow-2xl animate-slideInLeft">
            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9"/>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wider">SISAY <span className="text-cyan-400">DEV</span></p>
                  <p className="text-[9px] text-slate-500 tracking-wider uppercase">Full Stack Developer</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto sidebar-scrollbar p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow animate-soft-glow" />}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="px-3 pb-5 space-y-2 border-t border-white/5 pt-3">
              <button
                onClick={toggle}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 flex items-center gap-3"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <Sun size={14} className={`absolute transition-all duration-500 ${dark ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} />
                  <Moon size={14} className={`absolute transition-all duration-500 ${dark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`} />
                </div>
                {dark ? "Light Mode" : "Dark Mode"}
              </button>
              <a
                href="/resume.pdf"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200"
              >
                <Download size={14} />
                Download CV
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
