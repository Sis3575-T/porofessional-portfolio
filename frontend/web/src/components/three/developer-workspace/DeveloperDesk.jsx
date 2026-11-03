import * as THREE from "three";

/**
 * DeveloperDesk
 * Modern workstation desk with white satin desktop surface,
 * sleek metal legs on the left, and a 3-drawer cabinet on the right.
 */
export function DeveloperDesk() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Tabletop Surface */}
      <mesh position={[0, 0.73, -0.05]} receiveShadow castShadow>
        <boxGeometry args={[1.72, 0.038, 0.78]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.25}
          metalness={0.08}
        />
      </mesh>

      {/* Front edge accent trim */}
      <mesh position={[0, 0.73, 0.342]}>
        <boxGeometry args={[1.72, 0.016, 0.005]} />
        <meshStandardMaterial
          color="#CBD5E1"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Large Desk Mat / Mousepad */}
      <mesh position={[-0.05, 0.751, 0.06]} receiveShadow>
        <boxGeometry args={[0.92, 0.003, 0.44]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Left Side Metal Leg Assembly */}
      <group position={[-0.76, 0, -0.05]}>
        {/* Front vertical post */}
        <mesh position={[0, 0.35, 0.3]} castShadow>
          <boxGeometry args={[0.04, 0.72, 0.04]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Back vertical post */}
        <mesh position={[0, 0.35, -0.3]} castShadow>
          <boxGeometry args={[0.04, 0.72, 0.04]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Bottom foot bar */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.045, 0.03, 0.68]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Top support bar */}
        <mesh position={[0, 0.70, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.64]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* 3. Right Side 3-Drawer Cabinet (Matching Reference Image) */}
      <group position={[0.56, 0.35, -0.05]}>
        {/* Main Cabinet Outer Shell (Light grey / white body) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.70, 0.68]} />
          <meshStandardMaterial
            color="#E2E8F0"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* 3 Drawer Fronts */}
        {[-0.20, 0.02, 0.24].map((yPos, idx) => (
          <group key={idx} position={[0, yPos, 0.342]}>
            {/* Drawer Face Plate */}
            <mesh castShadow>
              <boxGeometry args={[0.39, 0.19, 0.015]} />
              <meshStandardMaterial
                color="#FFFFFF"
                roughness={0.25}
                metalness={0.05}
              />
            </mesh>

            {/* Dark Drawer Pull Handle */}
            <mesh position={[0, 0, 0.018]} castShadow>
              <boxGeometry args={[0.14, 0.022, 0.012]} />
              <meshStandardMaterial
                color="#0F172A"
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          </group>
        ))}

        {/* Recessed Kickplate Base */}
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.40, 0.02, 0.64]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
      </group>

      {/* 4. Rear Cable Management Tray & Modesty Crossbar */}
      <mesh position={[-0.1, 0.42, -0.36]} castShadow>
        <boxGeometry args={[1.25, 0.03, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}
