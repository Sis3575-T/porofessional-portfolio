import * as THREE from "three";

/**
 * ErgonomicChair
 * Detailed modern ergonomic mesh developer chair.
 * Features 5-star castor base, hydraulic gas lift, contoured seat cushion,
 * breathable mesh backrest, lumbar support, headrest, and adjustable armrests.
 */
export function ErgonomicChair() {
  return (
    <group position={[-0.1, 0, 0.44]} rotation={[0, Math.PI - 0.2, 0]}>
      {/* 1. 5-Star Wheeled Base */}
      {[0, 72, 144, 216, 288].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * 0.26;
        const z = Math.cos(rad) * 0.26;
        return (
          <group key={idx}>
            {/* Base leg beam */}
            <mesh position={[x / 2, 0.05, z / 2]} rotation={[0, rad, 0]} castShadow>
              <boxGeometry args={[0.035, 0.024, 0.24]} />
              <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Castor wheel housing */}
            <mesh position={[x, 0.03, z]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.025, 12]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Wheel axle */}
            <mesh position={[x, 0.02, z]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Central Hydraulic Gas Lift Cylinder */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.032, 0.36, 16]} />
        <meshStandardMaterial color="#64748B" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Seat Mechanism / Tilt Box Under Seat */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.22]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 3. Ergonomic Contoured Seat Cushion */}
      <group position={[0, 0.48, 0]}>
        {/* Main bottom seat cushion */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.065, 0.42]} />
          <meshStandardMaterial color="#1E293B" roughness={0.85} />
        </mesh>
        {/* Waterfall front contour */}
        <mesh position={[0, -0.015, 0.21]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <boxGeometry args={[0.43, 0.04, 0.04]} />
          <meshStandardMaterial color="#1E293B" roughness={0.85} />
        </mesh>
        {/* Breathable fabric top layer */}
        <mesh position={[0, 0.034, 0]}>
          <boxGeometry args={[0.40, 0.015, 0.38]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>

      {/* 4. High-Back Ergonomic Mesh Backrest */}
      <group position={[0, 0.82, -0.2]}>
        {/* Structural Spine / Outer Frame (Sleek dark charcoal/black) */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.58, 0.032]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.4} />
        </mesh>

        {/* Breathable Mesh Membrane */}
        <mesh position={[0, 0, 0.018]}>
          <boxGeometry args={[0.38, 0.54, 0.008]} />
          <meshStandardMaterial
            color="#246BFD"
            roughness={0.92}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Vertical spinal spine runner on back */}
        <mesh position={[0, 0, -0.022]} castShadow>
          <boxGeometry args={[0.06, 0.60, 0.025]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Adjustable Lumbar Support Cushion */}
        <mesh position={[0, -0.11, 0.03]} castShadow>
          <boxGeometry args={[0.30, 0.12, 0.028]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
      </group>

      {/* 5. Ergonomic Contoured Headrest */}
      <group position={[0, 1.18, -0.2]}>
        {/* Dual chrome support posts */}
        <mesh position={[-0.05, -0.08, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.12, 8]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.05, -0.08, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.12, 8]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Headrest cushion */}
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.12, 0.04]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
      </group>

      {/* 6. 3D Adjustable Armrests (Left & Right) */}
      {[-0.25, 0.25].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.64, 0]}>
          {/* Vertical Armrest Post */}
          <mesh position={[0, -0.07, 0]} castShadow>
            <boxGeometry args={[0.038, 0.22, 0.038]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Soft PU Armrest Pad */}
          <mesh position={[0, 0.05, 0.03]} castShadow>
            <boxGeometry args={[0.06, 0.024, 0.24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
