import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Home,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Sparkles,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";
import { usePortfolio } from "../context/PortfolioContext";
import Logo from "./Logo";

export const NAV_SECTIONS = [
  { id: "hero", label: "Home", path: "/", icon: Home },
  { id: "about", label: "About", path: "/#about", icon: User },
  { id: "projects", label: "Projects", path: "/projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", path: "/skills", icon: Code },
  { id: "experience", label: "Experience", path: "/experience", icon: Briefcase },
  { id: "education", label: "Education", path: "/education", icon: GraduationCap },
  { id: "services", label: "Services", path: "/services", icon: Sparkles },
  { id: "contact", label: "Contact", path: "/contact", icon: Mail },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { siteTitle } = useProfile();
  const { settings } = usePortfolio();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const moreRef = useRef(null);

  const visibility = (() => {
    try {
      if (settings?.sectionVisibility) {
        return typeof settings.sectionVisibility === "string"
          ? JSON.parse(settings.sectionVisibility)
          : settings.sectionVisibility;
      }
    } catch {}
    return null;
  })();

  const activeSections = NAV_SECTIONS.filter((s) => {
    if (visibility && visibility[s.id] === false) return false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (moreOpen) setMoreOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moreOpen, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Determine active section based on route and scroll
  useEffect(() => {
    const path = location.pathname;
    if (path === "/projects" || path.startsWith("/projects/")) {
      setActiveSection("projects");
      return;
    }
    if (path === "/skills") {
      setActiveSection("skills");
      return;
    }
    if (path === "/experience") {
      setActiveSection("experience");
      return;
    }
    if (path === "/education") {
      setActiveSection("education");
      return;
    }
    if (path === "/services") {
      setActiveSection("services");
      return;
    }
    if (path === "/contact") {
      setActiveSection("contact");
      return;
    }

    if (path === "/") {
      if (location.hash === "#about") {
        setActiveSection("about");
        return;
      }

      const aboutEl = document.getElementById("about");
      if (!aboutEl) {
        setActiveSection("hero");
        return;
      }

      const handleScrollHome = () => {
        const rect = aboutEl.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection("about");
        } else {
          setActiveSection("hero");
        }
      };

      window.addEventListener("scroll", handleScrollHome, { passive: true });
      handleScrollHome();
      return () => window.removeEventListener("scroll", handleScrollHome);
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, item) => {
    setMobileOpen(false);
    setMoreOpen(false);

    if (item.id === "hero") {
      if (e) e.preventDefault();
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        navigate("/");
      }
      return;
    }

    if (item.id === "about") {
      if (e) e.preventDefault();
      if (location.pathname === "/") {
        const el = document.getElementById("about");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", "#about");
        }
      } else {
        navigate("/#about");
      }
      return;
    }

    // For all other sections: navigate to their dedicated route
    if (item.path.startsWith("/")) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isMoreActive =
    activeSection === "experience" ||
    activeSection === "education" ||
    activeSection === "services";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? "bg-[#F7FAFE]/95 dark:bg-[#0B0F17]/95 backdrop-blur-md shadow-soft-xs border-b border-[#D8E5F8] dark:border-[#1E293B]"
            : "bg-[#F7FAFE]/90 dark:bg-[#0B0F17]/90 backdrop-blur-xs border-b border-[#D8E5F8]/70 dark:border-[#1E293B]/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* LEFT: ST Monogram & Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                onClick={(e) => handleNavClick(e, { id: "hero", path: "/" })}
                className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD] rounded-xl"
                aria-label="Sisay Temesgen - Portfolio Home"
              >
                <Logo size={36} />
                <span className="font-bold text-sm sm:text-base tracking-tight text-[#14213D] dark:text-[#F8FAFC] group-hover:text-[#246BFD] dark:group-hover:text-[#3B82F6] transition-colors">
                  {siteTitle || "Sisay Temesgen"}
                </span>
              </Link>
            </div>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EDF4FD] dark:bg-[#111827] border border-[#D8E5F8] dark:border-[#1E293B]"
              aria-label="Main Navigation"
            >
              {/* Primary Navbar Links */}
              {activeSections
                .filter((s) => !["experience", "education", "services"].includes(s.id))
                .map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => handleNavClick(e, item)}
                      className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-180 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD] ${
                        isActive
                          ? "bg-white text-[#246BFD] dark:bg-[#161F30] dark:text-[#3B82F6] shadow-soft-xs border border-[#D8E5F8] dark:border-[#1E293B]"
                          : "text-[#52607A] dark:text-[#94A3B8] hover:text-[#14213D] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#161F30]/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

              {/* Directly visible on wide 2xl screens: Experience, Education, Services */}
              {activeSections
                .filter((s) => ["experience", "education", "services"].includes(s.id))
                .map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => handleNavClick(e, item)}
                      className={`hidden 2xl:inline-flex px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-180 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                        isActive
                          ? "bg-white text-[#2563EB] dark:bg-[#161F30] dark:text-[#3B82F6] shadow-soft-xs border border-[#E2E8F0] dark:border-[#1E293B]"
                          : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#161F30]/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

              {/* Accessible "More" dropdown for secondary sections on standard desktop */}
              <div className="relative 2xl:hidden" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer ${
                    isMoreActive
                      ? "bg-white text-[#2563EB] dark:bg-[#161F30] dark:text-[#3B82F6] shadow-soft-xs border border-[#E2E8F0] dark:border-[#1E293B]"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#161F30]/60"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={moreOpen}
                  aria-label="More sections"
                >
                  <span>More</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-180 ${moreOpen ? "rotate-180" : ""}`}
                  />
                  {isMoreActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] ml-0.5" />
                  )}
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 py-1.5 rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-md z-50 overflow-hidden"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {activeSections
                        .filter((s) => ["experience", "education", "services"].includes(s.id))
                        .map((item) => {
                          const isActive = activeSection === item.id;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={(e) => handleNavClick(e, item)}
                              role="menuitem"
                              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                                isActive
                                  ? "bg-[#EFF6FF] dark:bg-[#3B82F6]/15 text-[#2563EB] dark:text-[#3B82F6] font-semibold"
                                  : "text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F0F4F8] dark:hover:bg-[#111827]"
                              }`}
                            >
                              <Icon size={15} />
                              <span className="flex-1">{item.label}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                              )}
                            </button>
                          );
                        })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* RIGHT: Theme Toggle & "Contact Me" CTA Button (matching reference) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button with Soft 3D feel */}
              <button
                type="button"
                onClick={toggle}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#14213D] dark:text-[#94A3B8] bg-white dark:bg-[#161F30] hover:bg-[#EDF4FD] dark:hover:bg-[#111827] hover:text-[#246BFD] dark:hover:text-[#F8FAFC] border border-[#D8E5F8] dark:border-[#1E293B] transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD] cursor-pointer shadow-soft-xs"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? (
                  <Sun size={17} className="text-amber-400" aria-hidden="true" />
                ) : (
                  <Moon size={17} className="text-[#14213D]" aria-hidden="true" />
                )}
              </button>

              {/* Contact Me CTA Button matching reference with 3D elevation */}
              <button
                type="button"
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white text-xs sm:text-sm font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246BFD]"
              >
                <span>Contact Me</span>
                <ArrowRight size={14} />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#161F30] hover:bg-[#F0F4F8] dark:hover:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE / TABLET NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-[#0B0F17]/60 backdrop-blur-xs z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Site Navigation"
              className="fixed top-0 right-0 h-full w-[310px] max-w-[85vw] z-50 bg-[#F8FAFC] dark:bg-[#0B0F17] border-l border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-lg flex flex-col lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center gap-2.5">
                  <Logo size={32} />
                  <span className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] truncate">
                    {siteTitle || "Sisay Temesgen"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto" aria-label="Mobile Navigation">
                {activeSections.map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => handleNavClick(e, item)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#EFF6FF] dark:bg-[#3B82F6]/15 text-[#2563EB] dark:text-[#3B82F6] border border-[#E2E8F0] dark:border-[#1E293B]"
                          : "text-[#475569] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#161F30] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Contact Me</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
