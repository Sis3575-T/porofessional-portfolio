import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useDeviceDetect } from "../hooks/useDeviceDetect";
import AbstractScene from "./three/AbstractScene";
import Hero3DLoading from "./three/Hero3DLoading";

const PhotoCard = lazy(() => import("./three/PhotoCard"));
const OfficeScene = lazy(() => import("./three/office/OfficeScene"));

const MODES = {
  abstract: "abstract",
  photoCard: "photoCard",
  office: "office",
};

const DEFAULT_CONFIG = {
  mode: "photoCard",
  rotationSpeed: 0.3,
  floatSpeed: 0.5,
  floatIntensity: 0.3,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  mouseInteraction: true,
  particleDensity: 80,
  shadowQuality: "medium",
  backgroundColor: "transparent",
};

export default function ThreeScene({ profileImage, config: userConfig = {} }) {
  const { isLowEnd, prefersReducedMotion } = useDeviceDetect();
  const mouse = useRef({ x: 0, y: 0 });
  const canvasRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const mode = config.mode === MODES.office ? MODES.office
    : (profileImage && !error ? MODES.photoCard : MODES.abstract);

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

  if (prefersReducedMotion) {
    return profileImage ? (
      <div className="w-full h-full flex items-center justify-center p-8">
        <img src={profileImage} alt="Profile" className="w-48 h-56 object-cover rounded-2xl border border-slate-700 shadow-lg" />
      </div>
    ) : null;
  }

  if (mode === MODES.office) {
    return (
      <Canvas
        camera={{ position: [2.5, 1.5, 3.0], fov: 42 }}
        dpr={isLowEnd ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isLowEnd, alpha: false }}
        style={{ background: "#1a1a1a" }}
        shadows={!isLowEnd}
        onCreated={() => setLoaded(true)}
      >
        <Suspense fallback={null}>
          <OfficeScene profileImage={profileImage} config={config} mouse={mouse} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
          target={[0, 0.85, -0.15]}
        />
      </Canvas>
    );
  }

  return (
    <div className="relative w-full h-full" ref={canvasRef}>
      <AnimatePresence>
        {!loaded && !error && <Hero3DLoading progress={0} />}
      </AnimatePresence>

      {error && profileImage ? (
        <div className="w-full h-full flex items-center justify-center p-8">
          <img src={profileImage} alt="Profile" className="w-48 h-56 object-cover rounded-2xl border border-slate-700 shadow-lg" />
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={isLowEnd ? [1, 1] : [1, 1.5]}
          gl={{ antialias: !isLowEnd, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={() => setLoaded(true)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={isLowEnd ? 0.5 : 1} />
          {!isLowEnd && <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ffffff" />}
          {!isLowEnd && <hemisphereLight args={["#ffffff", "#666666", 0.2]} />}

          {mode === MODES.photoCard ? (
            <Suspense fallback={null}>
              <PhotoCard imageUrl={profileImage} config={config} mouse={mouse} isLowEnd={isLowEnd} />
            </Suspense>
          ) : (
            <AbstractScene mouse={mouse} isLowEnd={isLowEnd} />
          )}

          {!isLowEnd && <Environment preset="city" />}
        </Canvas>
      )}
    </div>
  );
}
