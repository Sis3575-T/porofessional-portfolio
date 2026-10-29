import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center text-[#1E293B] dark:text-[#94A3B8] bg-white dark:bg-[#161F30] hover:bg-[#F0F4F8] dark:hover:bg-[#111827] hover:text-[#2563EB] dark:hover:text-[#3B82F6] border border-[#E2E8F0] dark:border-[#1E293B] transition focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-soft-xs"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={16} className="text-amber-400" aria-hidden="true" /> : <Moon size={16} className="text-[#1E293B]" aria-hidden="true" />}
    </button>
  );
}
