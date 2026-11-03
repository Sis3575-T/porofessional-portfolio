import { useRef, useState, useEffect, Suspense, Component, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Compass } from "lucide-react";
import { useDeviceDetect } from "../../../hooks/useDeviceDetect";
import { useTheme } from "../../../context/ThemeContext";
import DeveloperWorkspaceScene from "../../three/developer-workspace/DeveloperWorkspaceScene";

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
    console.warn("3D Workspace Scene Warning:", error);
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
    <div className="w-full h-full min-h-[360px] rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0e1420]/70 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center shadow-lg transition-all">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-200/60 dark:border-blue-700/40">
        <Compass size={32} />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
        Interactive 3D Developer Workspace
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-3">
        Sisay Temesgen · Full Stack Developer & AI Learner
      </p>
      <div className="flex flex-wrap gap-1.5 justify-center max-w-xs text-[11px] text-slate-600 dark:text-slate-300 font-mono">
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">React</span>
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">Node.js</span>
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">PostgreSQL</span>
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">Python</span>
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">AI</span>
      </div>
    </div>
  );
}

/**
 * ResponsiveCameraManager
 * Automatically calculates the exact camera distance required to fill ~92%
 * of the visual container without clipping ANY object or text during 360° rotation.
 * Completely locks zoom so distance remains fixed.
 */
function ResponsiveCameraManager({ controlsRef, onDistanceCalculated }) {
  const { size, camera } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);

    // Bounding cylinder around all workspace elements (desk, chair, badges, ornaments)
    // Radius ~1.28 units, Height ~1.65 units, Target Center at Y = 0.42
    const targetRadius = 1.30;
    const targetHeight = 1.66;
    const fillFactor = 0.92; // Occupy 92% of the container frame

    const fovRad = (camera.fov * Math.PI) / 180;

    // Distance required to fit vertically
    const distForHeight = (targetHeight / (2 * Math.tan(fovRad / 2))) / fillFactor;

    // Distance required to fit horizontally across any aspect ratio
    const hFovRad = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
    const distForWidth = ((targetRadius * 2) / (2 * Math.tan(hFovRad / 2))) / fillFactor;

    // Use larger distance to prevent clipping on both dimensions
    const requiredDist = Math.max(distForHeight, distForWidth);

    // Initial elevation angle (~24 degrees above horizontal)
    const elevationAngle = 0.42;
    const targetY = 0.42;
    const camY = targetY + requiredDist * Math.sin(elevationAngle);
    const camZ = requiredDist * Math.cos(elevationAngle);

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, targetY, 0);
      // Lock distance so zoom is completely disabled
      controlsRef.current.minDistance = requiredDist;
      controlsRef.current.maxDistance = requiredDist;
      controlsRef.current.update();
    }

    if (onDistanceCalculated) {
      onDistanceCalculated({ requiredDist, camY, camZ, targetY });
    }
  }, [size.width, size.height, camera, controlsRef, onDistanceCalculated]);

  return null;
}

/* --- Main Exported 3D Scene Component --- */
export default function About3DScene() {
  const { isLowEnd } = useDeviceDetect();
  const { dark } = useTheme();
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraConfigRef = useRef({ requiredDist: 3.2, camY: 1.4, camZ: 3.0, targetY: 0.42 });

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

  // Reset Camera Handler
  const handleResetCamera = useCallback(() => {
    if (controlsRef.current && controlsRef.current.object) {
      const { requiredDist, camY, camZ, targetY } = cameraConfigRef.current;
      controlsRef.current.reset();
      controlsRef.current.target.set(0, targetY, 0);
      controlsRef.current.object.position.set(0, camY, camZ);
      controlsRef.current.object.lookAt(0, targetY, 0);
      controlsRef.current.minDistance = requiredDist;
      controlsRef.current.maxDistance = requiredDist;
      controlsRef.current.update();
    }
  }, []);

  const handleDistanceCalculated = useCallback((config) => {
    cameraConfigRef.current = config;
  }, []);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[590px] flex items-center justify-center">
        <WebGLFallback />
      </div>
    );
  }

  return (
    <SceneErrorBoundary fallback={<WebGLFallback />}>
      <div
        ref={containerRef}
        className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[590px] flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing overflow-hidden"
        aria-label="Fully interactive 360-degree 3D developer workspace for Sisay Temesgen. Drag to rotate 360 degrees."
        role="region"
        onPointerDown={() => setHasInteracted(true)}
      >
        <Canvas
          camera={{
            position: [0, 1.4, 3.2],
            fov: 38,
            near: 0.1,
            far: 30,
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
          {/* Dynamically fits scene to 90-95% of container on all screen sizes & locks zoom */}
          <ResponsiveCameraManager
            controlsRef={controlsRef}
            onDistanceCalculated={handleDistanceCalculated}
          />

          <Suspense fallback={null}>
            <DeveloperWorkspaceScene />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableZoom={false} // ZOOM COMPLETELY DISABLED
            minPolarAngle={Math.PI / 8} // Safe vertical upper limit (~22.5 deg)
            maxPolarAngle={Math.PI / 2.08} // Safe vertical lower limit (~86 deg, never flips under floor)
            autoRotate={false} // Rotation controlled by visitor
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.8}
            target={[0, 0.42, 0]}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.NONE, // PINCH ZOOM COMPLETELY DISABLED
            }}
          />
        </Canvas>

        {/* Top-Right Reset Camera Control Button */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-200 text-[11px] font-semibold backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-soft-xs hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Reset to original 3D camera angle"
          aria-label="Reset camera view"
        >
          <RotateCcw size={12} className="shrink-0 text-blue-500" />
          <span>Reset View</span>
        </button>

        {/* Subtle Floating Interactive Instruction Pill */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/75 dark:bg-white/15 text-white/95 text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-white/15 shadow-sm ${
            hasInteracted ? "opacity-0" : "opacity-95"
          }`}
        >
          <RotateCcw
            size={12}
            className="shrink-0 text-blue-400 animate-spin"
            style={{ animationDuration: "7s" }}
          />
          <span>Drag to rotate 360°</span>
        </div>
      </div>
    </SceneErrorBoundary>
  );
}
