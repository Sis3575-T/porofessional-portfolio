import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGlobeTexture } from "./textureGenerators";

/**
 * 1. 3D AI Processor / Chip
 */
function AIProcessorChip({ position }) {
  const chipRef = useRef();

  useFrame((state) => {
    if (!chipRef.current) return;
    const t = state.clock.getElapsedTime();
    chipRef.current.position.y = position[1] + Math.sin(t * 1.4 + 2) * 0.015;
    chipRef.current.rotation.y = Math.sin(t * 0.5) * 0.12 - 0.2;
    chipRef.current.rotation.x = Math.cos(t * 0.6) * 0.08 + 0.1;
  });

  return (
    <group ref={chipRef} position={position}>
      {/* Dark Ceramic Substrate Body */}
      <mesh castShadow>
        <boxGeometry args={[0.20, 0.20, 0.028]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Golden Contact Pins around all 4 edges */}
      {[-0.07, -0.035, 0, 0.035, 0.07].map((offset, i) => (
        <group key={i}>
          <mesh position={[offset, 0.114, 0]}>
            <boxGeometry args={[0.016, 0.03, 0.01]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[offset, -0.114, 0]}>
            <boxGeometry args={[0.016, 0.03, 0.01]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[-0.114, offset, 0]}>
            <boxGeometry args={[0.03, 0.016, 0.01]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.114, offset, 0]}>
            <boxGeometry args={[0.03, 0.016, 0.01]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Center Silicon Die with Glowing Cyan Circuit */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.12, 0.12, 0.008]} />
        <meshStandardMaterial
          color="#0284C7"
          emissive="#38BDF8"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* AI Label Accent Plate */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[0.08, 0.05]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} />
      </mesh>

      <pointLight position={[0, 0, 0.05]} intensity={0.35} color="#38BDF8" distance={0.6} decay={2} />
    </group>
  );
}

/**
 * 2. 3D Lightbulb
 */
function IdeaLightbulb({ position }) {
  const bulbRef = useRef();

  useFrame((state) => {
    if (!bulbRef.current) return;
    const t = state.clock.getElapsedTime();
    bulbRef.current.position.y = position[1] + Math.sin(t * 1.3 + 1) * 0.015;
  });

  return (
    <group ref={bulbRef} position={position} rotation={[0, 0.2, 0.08]}>
      <group position={[0, -0.08, 0]}>
        <mesh>
          <cylinderGeometry args={[0.024, 0.022, 0.035, 16]} />
          <meshStandardMaterial color="#CA8A04" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.022, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
      </group>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.07, 24, 20]} />
        <meshPhysicalMaterial
          color="#FEF08A"
          emissive="#FEF08A"
          emissiveIntensity={0.6}
          roughness={0.1}
          transmission={0.8}
          transparent
          opacity={0.7}
          ior={1.4}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.022, 0.005, 8, 16]} />
        <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={3.0} />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={0.45} color="#FEF08A" distance={0.8} decay={2} />
    </group>
  );
}

/**
 * 3. 3D Rotating World Globe
 */
function TechnologyGlobe({ position }) {
  const globeRef = useRef();
  const sphereRef = useRef();
  const globeTexture = useMemo(() => createGlobeTexture(1024, 512), []);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.006;
    }
    if (globeRef.current) {
      const t = state.clock.getElapsedTime();
      globeRef.current.position.y = position[1] + Math.sin(t * 1.1 + 3) * 0.014;
    }
  });

  return (
    <group ref={globeRef} position={position}>
      <group rotation={[0.3, 0, 0.2]}>
        <mesh>
          <torusGeometry args={[0.12, 0.006, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.8} />
        </mesh>

        <mesh ref={sphereRef}>
          <sphereGeometry args={[0.10, 32, 24]} />
          <meshStandardMaterial
            map={globeTexture}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 4. Floating 3D Code Badge `</>` (Double-sided)
 */
function FloatingCodeBadge({ position }) {
  const badgeRef = useRef();

  useFrame((state) => {
    if (!badgeRef.current) return;
    const t = state.clock.getElapsedTime();
    badgeRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.016;
    badgeRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;
  });

  const renderSymbols = (zOffset, rotY = 0) => (
    <group position={[0, 0, zOffset]} rotation={[0, rotY, 0]}>
      <mesh position={[-0.055, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.011, 0.005]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-0.055, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.011, 0.005]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.011, 0.075, 0.005]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.055, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.011, 0.005]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.011, 0.005]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );

  return (
    <group ref={badgeRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.15, 0.026]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.6} />
      </mesh>
      {renderSymbols(0.015, 0)}
      {renderSymbols(-0.015, Math.PI)}
    </group>
  );
}

/**
 * 5. Subtle Floating Particles
 */
function FloatingParticles() {
  const pointsRef = useRef();

  const particleData = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 3.4;
      positions[i * 3 + 1] = Math.random() * 1.9 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.length / 3}
          array={particleData}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#38BDF8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function FloatingOrnaments() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Floating AI Processor (Upper Right, above Skills) */}
      <AIProcessorChip position={[0.78, 1.48, -0.18]} />

      {/* 2. Floating Idea Lightbulb (Upper Left, above Education) */}
      <IdeaLightbulb position={[-0.78, 1.46, -0.16]} />

      {/* 3. Floating Technology Globe (Mid Left, beside Education) */}
      <TechnologyGlobe position={[-0.94, 0.52, 0.08]} />

      {/* 4. Floating Code Badge </> (Top Left) */}
      <FloatingCodeBadge position={[-0.46, 1.50, -0.20]} />

      {/* 5. Subtle Ambient Floating Particles */}
      <FloatingParticles />
    </group>
  );
}
