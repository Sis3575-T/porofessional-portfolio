import { useMemo } from "react";
import * as THREE from "three";
import { createCodeTexture } from "./CodeTexture";

export default function Laptop() {
  const codeTexture = useMemo(() => createCodeTexture(256, 160), []);

  return (
    <group position={[0.55, 0.78, -0.2]} rotation={[0, -0.15, 0]}>
      {/* Base */}
      <mesh position={[0, 0.005, 0]} castShadow>
        <boxGeometry args={[0.3, 0.01, 0.2]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Keyboard area */}
      <mesh position={[0, 0.012, 0.02]}>
        <boxGeometry args={[0.26, 0.003, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.012, 0.07]}>
        <boxGeometry args={[0.08, 0.002, 0.05]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Screen lid */}
      <group position={[0, 0.01, -0.1]} rotation={[-0.35, 0, 0]}>
        {/* Back panel */}
        <mesh position={[0, 0, -0.003]}>
          <boxGeometry args={[0.3, 0.2, 0.006]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Apple-like logo */}
        <mesh position={[0, 0, -0.007]}>
          <circleGeometry args={[0.02, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        {/* Screen bezel */}
        <mesh position={[0, 0, 0.003]}>
          <boxGeometry args={[0.28, 0.18, 0.003]} />
          <meshStandardMaterial color="#111" roughness={0.5} />
        </mesh>
        {/* Screen surface */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshStandardMaterial
            map={codeTexture}
            roughness={0.08}
            emissive="#ffffff"
            emissiveIntensity={0.3}
            emissiveMap={codeTexture}
          />
        </mesh>
        {/* Camera dot */}
        <mesh position={[0, 0.085, 0.004]}>
          <circleGeometry args={[0.003, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
