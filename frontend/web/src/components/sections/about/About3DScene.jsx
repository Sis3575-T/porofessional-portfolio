import { useRef, useState, useEffect, useMemo, Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { createCodeTexture } from "../../three/office/CodeTexture";
import { useDeviceDetect } from "../../../hooks/useDeviceDetect";
import { useTheme } from "../../../context/ThemeContext";
import PersonalizedSisayDeveloper from "./PersonalizedSisayDeveloper";

/* --- Error Boundary for 3D Scene Components --- */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("3D Scene Warning:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/* --- WebGL Support Detection & Graceful Fallback --- */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function WebGLFallback() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-[#0e1420]/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center shadow-lg transition-all">
      <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md mb-4 bg-slate-900">
        <img
          src="/models/sisay-developer-preview.jpg"
          alt="Sisay Temesgen - Personalized 3D Developer"
          className="w-full h-full object-cover object-top select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
          <span className="text-[11px] font-mono font-semibold text-blue-400">
            Sisay Temesgen · 3D Developer
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        Personalized 3D Developer Environment
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
        Seated at modern workstation actively developing React & full-stack web solutions.
      </p>
    </div>
  );
}

/* --- Ergonomic Mesh Office Chair --- */
function ErgonomicChair() {
  return (
    <group position={[0, 0, 0.46]} rotation={[0, Math.PI, 0]}>
      {/* 5-star Castor Wheels Base */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * 0.24;
        const z = Math.cos(rad) * 0.24;
        return (
          <group key={i}>
            <mesh position={[x / 2, 0.04, z / 2]} rotation={[0, rad, 0]}>
              <boxGeometry args={[0.03, 0.02, 0.22]} />
              <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[x, 0.025, z]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Central Hydraulic Cylinder & Gas Lift */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.38, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Seat Cushion */}
      <group position={[0, 0.47, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.05, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.03, 0.01]} castShadow>
          <boxGeometry args={[0.38, 0.025, 0.36]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>

      {/* Curved Ergonomic Mesh Backrest */}
      <group position={[0, 0.8, -0.19]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.54, 0.03]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Breathable Mesh Material */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.34, 0.5, 0.01]} />
          <meshStandardMaterial color="#246bfd" roughness={0.9} transparent opacity={0.65} />
        </mesh>
        {/* Lumbar support cushion */}
        <mesh position={[0, -0.1, 0.035]} castShadow>
          <boxGeometry args={[0.28, 0.1, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      </group>

      {/* Headrest */}
      <group position={[0, 1.14, -0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.11, 0.035]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.09, 0.01]}>
          <boxGeometry args={[0.03, 0.08, 0.02]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Armrests */}
      <group position={[-0.24, 0.63, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.035, 0.22, 0.035]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, 0.02]} castShadow>
          <boxGeometry args={[0.05, 0.025, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </group>
      <group position={[0.24, 0.63, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.035, 0.22, 0.035]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, 0.02]} castShadow>
          <boxGeometry args={[0.05, 0.025, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* --- Modern Developer Desk with Metal Legs & Mat --- */
function DeveloperDesk() {
  return (
    <group position={[0, 0, 0]}>
      {/* Desktop Wood / Matte Slate Surface */}
      <mesh position={[0, 0.72, -0.05]} receiveShadow castShadow>
        <boxGeometry args={[1.7, 0.035, 0.85]} />
        <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.15} />
      </mesh>
      {/* Subtle edge bevel accent */}
      <mesh position={[0, 0.72, 0.38]}>
        <boxGeometry args={[1.7, 0.015, 0.01]} />
        <meshStandardMaterial color="#246bfd" roughness={0.3} emissive="#246bfd" emissiveIntensity={0.15} />
      </mesh>

      {/* Large Premium Desk Mat / Mousepad */}
      <mesh position={[0, 0.74, 0.04]} receiveShadow>
        <boxGeometry args={[0.9, 0.003, 0.42]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Metal Frame Legs (Left & Right) */}
      <mesh position={[-0.78, 0.35, -0.32]} castShadow>
        <boxGeometry args={[0.035, 0.7, 0.035]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.78, 0.35, 0.25]} castShadow>
        <boxGeometry args={[0.035, 0.7, 0.035]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.78, 0.1, -0.035]} castShadow>
        <boxGeometry args={[0.025, 0.025, 0.58]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[0.78, 0.35, -0.32]} castShadow>
        <boxGeometry args={[0.035, 0.7, 0.035]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.78, 0.35, 0.25]} castShadow>
        <boxGeometry args={[0.035, 0.7, 0.035]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.78, 0.1, -0.035]} castShadow>
        <boxGeometry args={[0.025, 0.025, 0.58]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Back Stability Crossbar */}
      <mesh position={[0, 0.28, -0.32]}>
        <boxGeometry args={[1.56, 0.025, 0.025]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

/* --- Main Monitor with High-Res Code Texture --- */
function MainMonitor() {
  const codeTexture = useMemo(() => createCodeTexture(512, 320), []);

  return (
    <group position={[0, 0.98, -0.3]}>
      {/* Monitor Screen Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.74, 0.44, 0.02]} />
        <meshStandardMaterial color="#090d14" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Glowing Code Screen */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.71, 0.41]} />
        <meshStandardMaterial
          map={codeTexture}
          roughness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          emissiveMap={codeTexture}
        />
      </mesh>

      {/* Stand Neck */}
      <mesh position={[0, -0.27, -0.02]} castShadow>
        <boxGeometry args={[0.045, 0.16, 0.025]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stand Base on Desk */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[0.22, 0.012, 0.16]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Screen Glow Light onto keyboard/workspace */}
      <pointLight position={[0, 0, 0.18]} intensity={0.35} color="#93c5fd" distance={1.2} decay={2} />
    </group>
  );
}

/* --- MacBook / Laptop on the right showing code --- */
function MacBookLaptop() {
  const laptopTexture = useMemo(() => createCodeTexture(256, 160), []);

  return (
    <group position={[0.5, 0.74, -0.1]} rotation={[0, -0.32, 0]}>
      {/* Aluminum Base */}
      <mesh position={[0, 0.005, 0]} castShadow>
        <boxGeometry args={[0.3, 0.01, 0.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.8} />
      </mesh>
      {/* Keyboard Area */}
      <mesh position={[0, 0.011, 0.015]}>
        <boxGeometry args={[0.26, 0.003, 0.11]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.011, 0.07]}>
        <boxGeometry args={[0.08, 0.002, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Screen Lid at 115 degrees */}
      <group position={[0, 0.01, -0.1]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0, -0.004]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.006]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.003]}>
          <planeGeometry args={[0.28, 0.18]} />
          <meshStandardMaterial
            map={laptopTexture}
            emissive="#ffffff"
            emissiveIntensity={0.35}
            emissiveMap={laptopTexture}
          />
        </mesh>
      </group>
    </group>
  );
}

/* --- Mechanical Keyboard, Mouse, Mug, Plant, Lamp --- */
function DeskItems() {
  return (
    <group position={[0, 0.74, 0]}>
      {/* Mechanical Keyboard */}
      <group position={[0, 0, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.012, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Keycaps */}
        {Array.from({ length: 24 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              -0.14 + (i % 8) * 0.04,
              0.009,
              -0.038 + Math.floor(i / 8) * 0.038,
            ]}
          >
            <boxGeometry args={[0.032, 0.006, 0.03]} />
            <meshStandardMaterial
              color={i === 11 || i === 12 ? "#38bdf8" : i % 5 === 0 ? "#475569" : "#1e293b"}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Ergonomic Wireless Mouse */}
      <group position={[0.28, 0, 0.08]}>
        <mesh rotation={[0.1, 0, 0]} castShadow>
          <capsuleGeometry args={[0.02, 0.032, 8, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Scroll wheel */}
        <mesh position={[0, 0.018, -0.01]}>
          <cylinderGeometry args={[0.004, 0.004, 0.014, 8]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} />
        </mesh>
      </group>

      {/* Ceramic Coffee Mug */}
      <group position={[-0.34, 0, 0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.026, 0.075, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.033, 0]}>
          <circleGeometry args={[0.026, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.2} />
        </mesh>
        <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.016, 0.004, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Ceramic Potted Succulent Plant */}
      <group position={[-0.55, 0, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.032, 0.024, 0.055, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <circleGeometry args={[0.028, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
          const r = (ang * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.sin(r) * 0.02, 0.045, Math.cos(r) * 0.02]}
              rotation={[0.4 * Math.cos(r), r, 0.4 * Math.sin(r)]}
            >
              <sphereGeometry args={[0.014, 8, 6]} />
              <meshStandardMaterial color="#10b981" roughness={0.6} />
            </mesh>
          );
        })}
      </group>

      {/* Modern Desk Lamp */}
      <group position={[-0.58, 0, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.038, 0.042, 0.014, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        <group position={[0, 0.02, 0]} rotation={[0.2, 0.3, 0.15]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.24, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          <group position={[0, 0.22, 0]} rotation={[0.4, 0, -0.3]}>
            <mesh position={[0, 0.03, 0]}>
              <coneGeometry args={[0.038, 0.035, 12, 1, true]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.025, 0]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
            <pointLight position={[0, 0.02, 0]} intensity={0.45} color="#ffd595" distance={1.2} decay={2} />
          </group>
        </group>
      </group>
    </group>
  );
}

/* --- Lighting Rig --- */
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.65} color="#f8fafc" />
      <directionalLight
        position={[2.5, 4, -2]}
        intensity={0.9}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={10}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-2, 3, 2.5]} intensity={0.45} color="#38bdf8" />
      <pointLight position={[-2, 2, -1]} intensity={0.35} color="#ffffff" distance={6} />
    </>
  );
}

/* --- Entire Genuine 3D Workspace Scene --- */
function CodingEnvironment({ faceTextureUrl = "/models/sisay-face.jpg" }) {
  return (
    <group position={[0, -0.42, 0]}>
      <SceneLighting />
      <DeveloperDesk />
      <MainMonitor />
      <MacBookLaptop />
      <DeskItems />
      <ErgonomicChair />
      <Suspense fallback={null}>
        <SceneErrorBoundary>
          <PersonalizedSisayDeveloper faceTextureUrl={faceTextureUrl} />
        </SceneErrorBoundary>
      </Suspense>

      {/* Soft grounding contact shadow underneath desk & chair on transparent background */}
      <ContactShadows
        position={[0, 0.001, 0.05]}
        opacity={0.42}
        scale={4.2}
        blur={2.4}
        far={1.6}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}

/* --- Main Exported Component --- */
export default function About3DScene({ glbModel }) {
  const { isLowEnd } = useDeviceDetect();
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  // IntersectionObserver to pause rendering when scrolled out of view (0% CPU/GPU)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[470px] flex items-center justify-center">
        <WebGLFallback />
      </div>
    );
  }

  return (
    <SceneErrorBoundary fallback={<WebGLFallback />}>
      <div
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[420px] lg:h-[470px] flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D coding environment with Sisay Temesgen. Drag with mouse or touch to rotate 360 degrees, scroll to zoom."
        role="region"
        onPointerDown={() => setHasInteracted(true)}
      >
        <Canvas
          camera={{
            position: [1.65, 1.3, -1.45],
            fov: 38,
            near: 0.1,
            far: 25,
          }}
          dpr={isLowEnd ? [1, 1] : [1, 1.5]}
          gl={{
            alpha: true,
            antialias: !isLowEnd,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
          frameloop={isVisible ? "always" : "never"}
          shadows={!isLowEnd}
        >
          <Suspense fallback={null}>
            <CodingEnvironment faceTextureUrl="/models/sisay-face.jpg" />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={true}
            minDistance={1.2}
            maxDistance={3.8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05}
            autoRotate={!hasInteracted}
            autoRotateSpeed={0.35}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.8}
            target={[0, 0.45, 0.1]}
          />
        </Canvas>

        {/* Subtle Floating Interactive Instruction Pill */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 dark:bg-white/10 text-white/90 text-[10px] sm:text-xs font-medium backdrop-blur-md border border-white/10 shadow-sm ${
            hasInteracted ? "opacity-0" : "opacity-90"
          }`}
        >
          <RotateCcw size={11} className="shrink-0 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Drag to rotate 360° · Scroll to zoom</span>
        </div>
      </div>
    </SceneErrorBoundary>
  );
}
