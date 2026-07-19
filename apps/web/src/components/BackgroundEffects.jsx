import { useMemo } from "react";

const NOISE = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E`;

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `star-pulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function BackgroundEffects({ enabled = true }) {
  if (!enabled) return null;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: `url("${NOISE}")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-400/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-400/3 rounded-full blur-[100px]" />
      </div>

      <Stars />
    </>
  );
}
