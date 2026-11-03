import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Move3d, RotateCcw } from "lucide-react";
import { createCodeTexture } from "../../three/office/CodeTexture";
import { useDeviceDetect } from "../../../hooks/useDeviceDetect";
import { useTheme } from "../../../context/ThemeContext";

/* --- 3D Developer Avatar sitting at the desk --- */
function DeveloperAvatar() {
  const avatarRef = useRef();
  const headRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const chestRef = useRef();
  const timeRef = useRef(0);

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: "#c89d7c", roughness: 0.65, metalness: 0.02 }),
      hair: new THREE.MeshStandardMaterial({ color: "#18181b", roughness: 0.85, metalness: 0.05 }),
      shirt: new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.7, metalness: 0.05 }),
      pants: new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.75, metalness: 0.03 }),
      shoes: new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.4, metalness: 0.1 }),
      collar: new THREE.MeshStandardMaterial({ color: "#38bdf8", roughness: 0.6 }),
      eyes: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.2 }),
      pupils: new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.1 }),
    }),
    []
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Subtle natural breathing in chest
    if (chestRef.current) {
      chestRef.current.position.y = 0.74 + Math.sin(t * 1.6) * 0.003;
      chestRef.current.scale.set(
        1 + Math.sin(t * 1.6) * 0.005,
        1,
        1 + Math.sin(t * 1.6) * 0.005
      );
    }

    // Natural head micro-movement looking between monitor and laptop
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.04;
      headRef.current.rotation.x = -0.06 + Math.sin(t * 1.2) * 0.015;
    }

    // Hands micro-movement typing on keyboard and mouse
    if (leftHandRef.current) {
      leftHandRef.current.position.y = 0.745 + Math.sin(t * 7) * 0.003;
      leftHandRef.current.position.x = -0.06 + Math.sin(t * 5) * 0.004;
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.y = 0.745 + Math.sin(t * 6.5 + 1) * 0.003;
      rightHandRef.current.position.x = 0.28 + Math.sin(t * 4) * 0.003;
    }
  });

  return (
    <group ref={avatarRef} position={[0, 0, 0.46]} rotation={[0, Math.PI, 0]}>
      {/* Pelvis - seated directly on chair cushion */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.26, 0.09, 0.24]} />
        <meshStandardMaterial {...materials.pants} />
      </mesh>

      {/* Torso & Chest with breathing motion */}
      <group ref={chestRef} position={[0, 0.74, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.17, 0.38, 16]} />
          <meshStandardMaterial {...materials.shirt} />
        </mesh>
        {/* Modern shirt collar / accent line */}
        <mesh position={[0, 0.18, 0.08]} castShadow>
          <boxGeometry args={[0.13, 0.025, 0.05]} />
          <meshStandardMaterial {...materials.collar} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.09, 12]} />
        <meshStandardMaterial {...materials.skin} />
      </mesh>

      {/* Head with detailed facial features & styled hair */}
      <group ref={headRef} position={[0, 1.07, 0]}>
        {/* Head base */}
        <mesh castShadow>
          <sphereGeometry args={[0.095, 20, 20]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* Eyes (white sclera) */}
        <mesh position={[-0.034, 0.015, 0.084]}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial {...materials.eyes} />
        </mesh>
        <mesh position={[0.034, 0.015, 0.084]}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial {...materials.eyes} />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.034, 0.015, 0.096]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial {...materials.pupils} />
        </mesh>
        <mesh position={[0.034, 0.015, 0.096]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial {...materials.pupils} />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.034, 0.035, 0.085]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.028, 0.005, 0.005]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>
        <mesh position={[0.034, 0.035, 0.085]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.028, 0.005, 0.005]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.005, 0.096]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* Mouth - subtle focused smile */}
        <mesh position={[0, -0.032, 0.086]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.028, 0.004, 0.004]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>

        {/* Hair - modern textured top crop */}
        <mesh position={[0, 0.05, -0.015]} castShadow>
          <sphereGeometry args={[0.096, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>
        <mesh position={[-0.075, 0.02, -0.015]} castShadow>
          <sphereGeometry args={[0.06, 10, 10, 0, Math.PI, 0, Math.PI * 0.6]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>
        <mesh position={[0.075, 0.02, -0.015]} castShadow>
          <sphereGeometry args={[0.06, 10, 10, 0, Math.PI, 0, Math.PI * 0.6]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.098, 0.002, 0]} castShadow>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0.098, 0.002, 0]} castShadow>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
      </group>

      {/* Arms & Hands positioned naturally on keyboard and mouse */}
      {/* Left arm -> keyboard */}
      <group position={[-0.2, 0.85, 0.02]} rotation={[0.45, 0.15, 0.15]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.16, 6, 10]} />
          <meshStandardMaterial {...materials.shirt} />
        </mesh>
        <group position={[0, -0.22, 0.04]} rotation={[-1.25, 0, 0]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.14, 6, 10]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>
        </group>
      </group>
      {/* Left hand resting on keyboard */}
      <mesh ref={leftHandRef} position={[-0.06, 0.745, 0.28]} castShadow>
        <boxGeometry args={[0.055, 0.02, 0.06]} />
        <meshStandardMaterial {...materials.skin} />
      </mesh>

      {/* Right arm -> mouse */}
      <group position={[0.2, 0.85, 0.02]} rotation={[0.42, -0.18, -0.15]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.16, 6, 10]} />
          <meshStandardMaterial {...materials.shirt} />
        </mesh>
        <group position={[0, -0.22, 0.04]} rotation={[-1.2, 0, 0]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.14, 6, 10]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>
        </group>
      </group>
      {/* Right hand resting on mouse */}
      <mesh ref={rightHandRef} position={[0.28, 0.745, 0.28]} castShadow>
        <boxGeometry args={[0.055, 0.02, 0.06]} />
        <meshStandardMaterial {...materials.skin} />
      </mesh>

      {/* Legs naturally bent under desk */}
      {/* Left Leg */}
      <group position={[-0.08, 0.5, 0.04]} rotation={[-1.4, 0, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 6, 10]} />
          <meshStandardMaterial {...materials.pants} />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[1.4, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 6, 10]} />
            <meshStandardMaterial {...materials.pants} />
          </mesh>
          <mesh position={[0, -0.22, 0.02]} castShadow>
            <boxGeometry args={[0.065, 0.038, 0.11]} />
            <meshStandardMaterial {...materials.shoes} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.08, 0.5, 0.04]} rotation={[-1.4, 0, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 6, 10]} />
          <meshStandardMaterial {...materials.pants} />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[1.4, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 6, 10]} />
            <meshStandardMaterial {...materials.pants} />
          </mesh>
          <mesh position={[0, -0.22, 0.02]} castShadow>
            <boxGeometry args={[0.065, 0.038, 0.11]} />
            <meshStandardMaterial {...materials.shoes} />
          </mesh>
        </group>
      </group>
    </group>
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
      {/* Left Frame */}
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

      {/* Right Frame */}
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

      {/* Ceramic Coffee Mug with Steam Hint */}
      <group position={[-0.34, 0, 0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.026, 0.075, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Coffee surface */}
        <mesh position={[0, 0.033, 0]}>
          <circleGeometry args={[0.026, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.016, 0.004, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Ceramic Potted Succulent Plant */}
      <group position={[-0.55, 0, 0.1]}>
        {/* Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.032, 0.024, 0.055, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.025, 0]}>
          <circleGeometry args={[0.028, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        {/* Succulent Leaves */}
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
        {/* Angled Neck */}
        <group position={[0, 0.02, 0]} rotation={[0.2, 0.3, 0.15]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.24, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Lamp Shade & Bulb */}
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
      {/* Soft Ambient Fill */}
      <ambientLight intensity={0.6} color="#f8fafc" />

      {/* Main Daylight Key Light */}
      <directionalLight
        position={[2.5, 4, 2.5]}
        intensity={0.85}
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

      {/* Back Rim Light (creates crisp silhouette definition against transparent background) */}
      <directionalLight position={[-2, 3, -2.5]} intensity={0.45} color="#38bdf8" />

      {/* Fill Light from Left */}
      <pointLight position={[-2, 2, 1]} intensity={0.3} color="#ffffff" distance={6} />
    </>
  );
}

/* --- Entire Genuine 3D Workspace Scene --- */
function CodingEnvironment() {
  return (
    <group position={[0, -0.42, 0]}>
      <SceneLighting />
      <DeveloperDesk />
      <MainMonitor />
      <MacBookLaptop />
      <DeskItems />
      <ErgonomicChair />
      <DeveloperAvatar />

      {/* Soft grounding contact shadow underneath desk & chair on transparent background */}
      <ContactShadows
        position={[0, 0.001, 0.05]}
        opacity={0.4}
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
export default function About3DScene() {
  const { isLowEnd } = useDeviceDetect();
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[420px] lg:h-[470px] flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D coding environment. Drag with mouse or touch to rotate 360 degrees, scroll to zoom."
      role="region"
      onPointerDown={() => setHasInteracted(true)}
    >
      <Canvas
        camera={{
          position: [1.9, 1.45, 1.9],
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
          <CodingEnvironment />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={1.3}
          maxDistance={3.8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={!hasInteracted}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.8}
          target={[0, 0.28, 0]}
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
  );
}
