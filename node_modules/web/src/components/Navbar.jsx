import { useState, useEffect } from "react";
import { Menu, X, FileDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map((item) => item.href.slice(1));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick("#hero"); }}
          className="text-2xl font-bold text-cyan-400" aria-label="Go to top of page">
          Portfolio
        </a>

        <ul className="hidden md:flex items-center gap-1" role="list">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleClick(item.href); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.href.slice(1)
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={activeSection === item.href.slice(1) ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
              className="ml-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              aria-label="Download resume"
            >
              <FileDown size={16} aria-hidden="true" />
              Resume
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 animate-fadeIn"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <ul className="px-4 py-4 space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleClick(item.href); }}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeSection === item.href.slice(1)
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={activeSection === item.href.slice(1) ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/resume.pdf"
                className="block px-4 py-3 mt-2 bg-cyan-600 text-slate-950 rounded-lg text-sm font-semibold text-center"
                aria-label="Download resume">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
