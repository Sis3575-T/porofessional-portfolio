import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const interactiveSelectors = [
  "a", "button", "input", "textarea", "select",
  "[role=button]", "[tabindex]:not([tabindex='-1'])",
  ".card", ".btn", "img", "label",
];

export default function CustomCursor({ enabled = true }) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const followerX = useSpring(cursorX, { stiffness: 150, damping: 15, mass: 0.5 });
  const followerY = useSpring(cursorY, { stiffness: 150, damping: 15, mass: 0.5 });
  const [hovering, setHovering] = useState(false);
  const visible = useRef(false);

  const moveCursor = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    visible.current = true;
  }, [cursorX, cursorY]);

  const checkHover = useCallback((e) => {
    const target = e.target;
    const isInteractive = interactiveSelectors.some((sel) => {
      if (target?.matches?.(sel)) return true;
      if (target?.closest?.(sel)) return true;
      return false;
    });
    setHovering(isInteractive);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.body.style.cursor = "none";
    document.body.classList.add("custom-cursor-active");

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", checkHover);
    window.addEventListener("mouseout", checkHover);
    document.addEventListener("mouseleave", () => { visible.current = false; });

    return () => {
      document.body.style.cursor = "";
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", checkHover);
      window.removeEventListener("mouseout", checkHover);
    };
  }, [enabled, moveCursor, checkHover]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          border: hovering
            ? "1px solid rgba(6, 182, 212, 0.2)"
            : "1px solid rgba(6, 182, 212, 0.5)",
          backgroundColor: hovering
            ? "rgba(6, 182, 212, 0.06)"
            : "transparent",
          transition: "width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s",
        }}
      />
    </>
  );
}
