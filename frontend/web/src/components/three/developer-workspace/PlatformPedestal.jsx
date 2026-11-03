import * as THREE from "three";

/**
 * PlatformPedestal
 * Sleek circular platform with beveled dark base, glowing cyan LED ring,
 * and satin-finish top surface matching the reference workspace design.
 * Proportioned compactly so the workspace fills 90-95% of the frame.
 */
export function PlatformPedestal() {
  return (
    <group position={[0, -0.06, 0]}>
      {/* Outer dark beveled base ring */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.72, 1.78, 0.07, 64]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>

      {/* Embedded Cyan/Blue Glowing LED Neon Accent Ring */}
      <mesh position={[0, 0.055, 0]}>
        <torusGeometry args={[1.70, 0.014, 16, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={1.8}
          roughness={0.1}
        />
      </mesh>

      {/* Main Satin White/Silver Platform Surface */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.68, 1.70, 0.035, 64]} />
        <meshStandardMaterial
          color="#E2E8F0"
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Inset Inner Accent Ring on Platform Top */}
      <mesh position={[0, 0.078, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.56, 1.575, 64]} />
        <meshStandardMaterial
          color="#CBD5E1"
          roughness={0.5}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
