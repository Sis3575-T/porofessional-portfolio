export default function BackgroundEffects({ enabled = true }) {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Layer 1: Code background texture from reference */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.10] dark:opacity-[0.24] filter contrast-115 saturate-125 pointer-events-none transition-opacity duration-300"
        style={{ backgroundImage: "url(/hero-code-bg.png)" }}
      />

      {/* Layer 2: Seamless ambient overlay tint */}
      <div className="fixed inset-0 z-0 bg-slate-50/80 dark:bg-[#090d14]/75 pointer-events-none transition-colors duration-300" />

      {/* Layer 3: Technical grid pattern (4rem x 4rem) */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Layer 4: Ambient luminous blur orbs from reference */}
      {/* Top-left Crimson / Rose blur orb */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Bottom-right Warm Amber blur orb */}
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mid-left Emerald tech hint */}
      <div className="fixed top-2/3 left-1/6 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
