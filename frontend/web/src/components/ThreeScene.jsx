import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useDeviceDetect } from "../hooks/useDeviceDetect";

const OfficeScene = lazy(() => import("./three/office/OfficeScene"));

const MODES = {
  abstract: "abstract",
  photoCard: "photoCard",
  office: "office",
};

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

export default function ThreeScene({ profileImage, config: userConfig = {} }) {
  const { isLowEnd, prefersReducedMotion } = useDeviceDetect();
  const mouse = useRef({ x: 0, y: 0 });
  const canvasRef = useRef();
  const [loaded, setLoaded] = useState(false);

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const mode = MODES.office;

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

  return (
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
      }}
      style={{ background: "#e8e0d4" }}
      shadows={!isLowEnd}
      onCreated={() => setLoaded(true)}
    >
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
    </Canvas>
  );
}
