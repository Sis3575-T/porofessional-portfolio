import { useRef, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

const techIcons = [
  { name: "React", color: "#61dafb" },
  { name: "Node", color: "#68a063" },
  { name: "MongoDB", color: "#4db33d" },
  { name: "Docker", color: "#0db7ed" },
  { name: "Express", color: "#000" },
  { name: "Git", color: "#f05032" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "JavaScript", color: "#f7df1e" },
  { name: "Three.js", color: "#049ef4" },
];

function OrbitingIcons({ count = 8 }) {
  const items = useMemo(() => {
    const shuffled = [...techIcons].sort(() => Math.random() - 0.5).slice(0, count);
    return shuffled.map((t, i) => ({
      ...t,
      angle: (i / count) * Math.PI * 2,
      radius: 140 + Math.random() * 40,
      speed: 18 + Math.random() * 12,
      size: 10 + Math.random() * 4,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full font-mono font-bold shadow-lg"
          style={{
            width: item.size * 2,
            height: item.size * 2,
            color: item.color,
            fontSize: item.size - 4,
            textShadow: `0 0 10px ${item.color}40`,
          }}
          animate={{
            x: [0, Math.cos(item.angle) * item.radius, 0],
            y: [0, Math.sin(item.angle) * item.radius, 0],
          }}
          transition={{
            duration: item.speed,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        >
          {item.name[0]}
        </motion.div>
      ))}
    </div>
  );
}

function AvatarPlaceholder({ initials }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-purple-900/40">
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30">
        <span className="text-4xl font-bold text-cyan-400/80">
          {initials || "?"}
        </span>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "ST";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "ST";
}

export default function Profile3D({ profileImage, glbModel, isLowEnd: _isLowEnd = false }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (_isLowEnd) return;
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setTilt({ x: dy * -12, y: dx * 12 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [_isLowEnd]);

  return (
    <div className="relative" ref={cardRef}>
      <OrbitingIcons count={_isLowEnd ? 0 : 8} />
      <motion.div
        className="relative w-full max-w-sm mx-auto"
        animate={_isLowEnd ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div
            className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-2xl shadow-cyan-500/10 relative group"
            style={{ transformStyle: "preserve-3d", perspective: "800px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none rounded-t-3xl" />

            {profileImage && !imgError ? (
              <>
                {!imgLoaded && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => { setImgError(true); setImgLoaded(true); }}
                />
              </>
            ) : glbModel ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <p className="text-slate-400 text-sm">3D Model Loader</p>
              </div>
            ) : (
              <AvatarPlaceholder initials={getInitials("Sisay Temesgen")} />
            )}

            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none rounded-b-3xl" />
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">Available for work</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-xl -z-10" />
      </motion.div>
    </div>
  );
}
