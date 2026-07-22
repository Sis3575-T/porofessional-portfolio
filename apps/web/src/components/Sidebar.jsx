import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home, User, Code, Briefcase, Settings, PenTool, BookOpen, Mail,
  Sun, Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navColors = {
  blue: { icon: "text-accent-blue", bg: "bg-accent-blue" },
  gray: { icon: "text-accent-gray", bg: "bg-accent-gray" },
};

const navItems = [
  { label: "Home",     href: "#hero",       icon: Home,     color: "blue" },
  { label: "About",    href: "#about",      icon: User,     color: "gray" },
  { label: "Skills",   href: "#skills",     icon: Code,     color: "blue" },
  { label: "Projects", href: "#projects",   icon: Briefcase, color: "gray" },
  { label: "Services", href: "#services",   icon: Settings,  color: "blue" },
  { label: "Experience", href: "#experience", icon: PenTool, color: "gray" },
  { label: "Education", href: "#education",   icon: BookOpen, color: "blue" },
  { label: "Contact",  href: "#contact",    icon: Mail,     color: "gray" },
];

export default function Sidebar() {
  const { dark, toggle } = useTheme();
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

  return (
    <aside
      className="fixed left-[18px] top-[18px] z-50 select-none hidden md:flex flex-col items-center w-[70px] rounded-[22px] bg-white/80 backdrop-blur-xl border border-gray-200/60 overflow-hidden"
      style={{ height: "96vh", boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)" }}
    >
      <div className="flex flex-col h-full w-full py-4 gap-3 items-center">
        {/* TOP: Logo */}
        <motion.a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleClick("#hero"); }}
          className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-accent-blue shrink-0 shadow-sm cursor-pointer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9"/>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
          </svg>
        </motion.a>

        {/* CENTER: Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-2 items-center overflow-y-auto sidebar-scrollbar py-1 w-full">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            const Icon = item.icon;
            const c = navColors[item.color];
            return (
              <motion.button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className={`relative flex items-center justify-center w-[46px] h-[46px] rounded-[14px] border transition-all duration-300 cursor-pointer shrink-0 ${
                  isActive
                    ? `bg-gray-900 border-transparent text-white shadow-md`
                    : `bg-transparent border-transparent text-gray-400 hover:text-gray-700`
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                <Icon size={20} />
              </motion.button>
            );
          })}
        </nav>

        {/* LOWER: Theme Toggle */}
        <div className="flex flex-col gap-2 items-center shrink-0 w-full">
          <motion.button
            onClick={toggle}
            className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-transparent text-gray-400 hover:text-gray-700 transition-all duration-300 cursor-pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            title={dark ? "Light Mode" : "Dark Mode"}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
