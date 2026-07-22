import { useMemo } from "react";
import { createCodeTexture } from "./CodeTexture";

export default function Laptop() {
  const codeTexture = useMemo(() => createCodeTexture(256, 160), []);

  return (
    <group position={[0, 0.77, -0.12]}>
      {/* Screen lid - tilted back */}
      <group rotation={[-0.35, 0, 0]} position={[0, 0.015, -0.06]}>
        {/* Back panel */}
        <mesh position={[0, 0, -0.003]}>
          <boxGeometry args={[0.28, 0.18, 0.006]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Screen surface - facing forward */}
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshStandardMaterial
            map={codeTexture}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.35}
            emissiveMap={codeTexture}
          />
        </mesh>
      </group>
      {/* Keyboard base */}
      <mesh position={[0, -0.005, 0.015]}>
        <boxGeometry args={[0.28, 0.008, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
