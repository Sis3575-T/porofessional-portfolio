import { useMemo } from "react";
import * as THREE from "three";
import { createCodeTexture } from "./CodeTexture";

export default function Monitor() {
  const codeTexture = useMemo(() => createCodeTexture(512, 320), []);

  return (
    <group position={[0, 1.02, -0.38]}>
      {/* Outer frame */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.02]} />
        <meshStandardMaterial color="#181818" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Screen - plane facing camera */}
      <mesh position={[0, 0.15, 0.011]}>
        <planeGeometry args={[0.66, 0.44]} />
        <meshStandardMaterial
          map={codeTexture}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          emissiveMap={codeTexture}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.15]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
