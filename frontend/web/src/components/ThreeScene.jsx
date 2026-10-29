import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useDeviceDetect } from "../hooks/useDeviceDetect";
import { useTheme } from "../context/ThemeContext";

const OfficeScene = lazy(() => import("./three/office/OfficeScene"));

const DEFAULT_CONFIG = {
  mode: "office",
  rotationSpeed: 0.3,
  floatSpeed: 0.5,
  floatIntensity: 0.3,
  autoRotate: false,
  autoRotateSpeed: 0.3,
  mouseInteraction: true,
  particleDensity: 80,
  shadowQuality: "medium",
  backgroundColor: "transparent",
};

function PauseableCanvas({ children, isPaused }) {
  useFrame((state) => {
    if (isPaused) {
      state.clock.stop();
    } else {
      state.clock.start();
    }
  });
  return children;
}

export default function ThreeScene({ profileImage, config: userConfig = {} }) {
  const { isLowEnd, prefersReducedMotion } = useDeviceDetect();
  const { dark } = useTheme();
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const bgColor = dark ? "#211E26" : "#F1EDE8";

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onMove = (e) => {
      if (!config.mouseInteraction) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, config.mouseInteraction]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "100px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (prefersReducedMotion) {
    return profileImage ? (
      <div
        className="w-full h-full flex items-center justify-center p-8 transition-colors duration-200"
        style={{ background: bgColor }}
      >
        <img
          src={profileImage}
          alt="Sisay Temesgen"
          className="w-48 h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          width={192}
          height={224}
        />
      </div>
    ) : null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden transition-colors duration-200"
      style={{ background: bgColor }}
    >
      {!loaded && profileImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={profileImage}
            alt="Preview"
            className="w-40 h-48 object-cover rounded-2xl opacity-40 shadow-sm"
            width={160}
            height={192}
          />
        </div>
      )}
      <Canvas
        camera={{
          position: [1.8, 1.35, 1.8],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        dpr={isLowEnd ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isLowEnd,
          alpha: false,
          toneMapping: 3,
          toneMappingExposure: 1.1,
          powerPreference: "high-performance",
        }}
        style={{
          background: bgColor,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease-in-out, background 0.2s ease",
        }}
        shadows={!isLowEnd}
        onCreated={() => setLoaded(true)}
        frameloop={isVisible ? "always" : "never"}
      >
        <PauseableCanvas isPaused={!isVisible}>
          <Suspense fallback={null}>
            <OfficeScene profileImage={profileImage} config={config} mouse={mouse} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.2}
            maxDistance={3.5}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate={false}
            target={[0, 1.0, 0.1]}
            enableDamping
            dampingFactor={0.05}
          />
        </PauseableCanvas>
      </Canvas>
    </div>
  );
}
