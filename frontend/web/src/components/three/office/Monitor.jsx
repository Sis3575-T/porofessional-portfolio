import { useMemo } from "react";
import * as THREE from "three";
import { createCodeTexture } from "./CodeTexture";

export default function Monitor() {
  const codeTexture = useMemo(() => createCodeTexture(512, 320), []);

  return (
    <group position={[0, 1.08, -0.4]}>
      {/* Monitor body - thin bezel */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.78, 0.48, 0.025]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0, 0.013]}>
        <boxGeometry args={[0.76, 0.46, 0.002]} />
        <meshStandardMaterial color="#111" roughness={0.4} />
      </mesh>

      {/* Screen - front */}
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.72, 0.42]} />
        <meshStandardMaterial
          map={codeTexture}
          roughness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          emissiveMap={codeTexture}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, 0, -0.013]}>
        <planeGeometry args={[0.74, 0.44]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Brand logo on back */}
      <mesh position={[0, 0.08, -0.014]}>
        <planeGeometry args={[0.06, 0.015]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Ventilation on back */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.15 + i * 0.04, -0.1, -0.014]}>
          <planeGeometry args={[0.02, 0.04]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      ))}

      {/* Stand neck */}
      <mesh position={[0, -0.32, 0.02]} castShadow>
        <boxGeometry args={[0.05, 0.18, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -0.42, 0.04]} castShadow>
        <boxGeometry args={[0.28, 0.012, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Screen glow */}
      <pointLight position={[0, 0, 0.15]} intensity={0.08} color="#aaccff" distance={1.5} decay={2} />
    </group>
  );
}
