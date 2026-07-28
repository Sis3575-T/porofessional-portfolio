import { useMemo, useRef, useEffect, useState } from "react";

const iconSet = [
  { name: "React", char: "⚛", color: "#61dafb" },
  { name: "Node", char: "●", color: "#68a063" },
  { name: "Mongo", char: "◈", color: "#4db33d" },
  { name: "Docker", char: "◆", color: "#0db7ed" },
  { name: "TS", char: "TS", color: "#3178c6" },
  { name: "JS", char: "JS", color: "#f7df1e" },
  { name: "Git", char: "◇", color: "#f05032" },
  { name: "Three", char: "◉", color: "#049ef4" },
  { name: "Next", char: "▣", color: "#fff" },
];

export default function FloatingIcons({ count = 6 }) {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const items = useMemo(() => {
    return [...iconSet].sort(() => Math.random() - 0.5).slice(0, count).map((item, i) => ({
      ...item,
      top: 10 + Math.random() * 80,
      left: 10 + Math.random() * 80,
      duration: 20 + Math.random() * 20,
      delay: i * 2,
      size: 14 + Math.random() * 10,
    }));
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <div
          key={item.name}
          className="absolute"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            animation: `float-slow ${item.duration}s ease-in-out ${item.delay}s infinite`,
            transform: `translate(${mouse.x * (10 + i * 5)}px, ${mouse.y * (10 + i * 5)}px)`,
            color: item.color,
            fontSize: item.size,
            opacity: 0.3,
            textShadow: `0 0 20px ${item.color}30`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
}
