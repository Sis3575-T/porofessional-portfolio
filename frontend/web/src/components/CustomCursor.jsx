import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CustomCursor({ enabled = true }) {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [dotCoords, setDotCoords] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { dark } = useTheme();

  useEffect(() => {
    if (!enabled) return;
    // Disable on touch devices or if user prefers reduced motion
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId;
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setDotCoords({ x, y });
      if (!isVisible) setIsVisible(true);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setCoords({ x, y });
      });

      const target = e.target;
      const interactive =
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest(".cursor-pointer") ||
          target.closest(".group") ||
          target.closest('[role="button"]') ||
          target.closest(".interactive-target"));
      setIsHovered(!!interactive);

      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) return null;

  const outerRadius = isHovered ? 640 : 460;
  const innerRadius = isHovered ? 240 : 150;
  const outerAlpha = dark ? (isHovered ? 0.25 : 0.15) : isHovered ? 0.14 : 0.08;
  const innerAlpha = dark ? (isHovered ? 0.40 : 0.22) : isHovered ? 0.22 : 0.11;

  return (
    <>
      {/* Outer ambient spotlight aura */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(${outerRadius}px circle at ${coords.x}px ${coords.y}px, rgba(239, 68, 68, ${outerAlpha}), rgba(220, 38, 38, ${outerAlpha * 0.4}), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Inner hot crimson aura */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-all duration-150 ease-out"
        style={{
          background: `radial-gradient(${innerRadius}px circle at ${coords.x}px ${coords.y}px, rgba(255, 30, 75, ${innerAlpha}), rgba(239, 68, 68, ${innerAlpha * 0.35}), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Smooth trailing cursor dot */}
      <div
        className={`pointer-events-none fixed top-0 left-0 z-50 rounded-full transition-transform duration-75 ease-out ${
          isHovered
            ? "w-9 h-9 border-2 border-red-500 bg-red-500/20 shadow-lg shadow-red-500/40 scale-100"
            : "w-3.5 h-3.5 bg-red-500/80 shadow-md shadow-red-500/30 scale-75"
        }`}
        style={{
          transform: `translate3d(${dotCoords.x}px, ${dotCoords.y}px, 0) translate(-50%, -50%)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
