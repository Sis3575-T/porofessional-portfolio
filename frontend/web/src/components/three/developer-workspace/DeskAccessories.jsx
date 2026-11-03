import * as THREE from "three";

/**
 * DeskAccessories
 * Precision-modeled developer accessories placed on the desk:
 * - Mechanical keyboard with individual keys & accent keycaps
 * - Ergonomic wireless mouse
 * - Professional studio headphones
 * - Ceramic pen/pencil holder cup with pens
 * - Small succulent desk plant
 */
export function DeskAccessories() {
  return (
    <group position={[0, 0.75, 0]}>
      {/* 1. Mechanical Keyboard */}
      <group position={[-0.05, 0.006, 0.09]}>
        {/* Keyboard Aluminum/Matte Chassis */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.014, 0.13]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Spacebar */}
        <mesh position={[0, 0.01, 0.042]} castShadow>
          <boxGeometry args={[0.14, 0.007, 0.024]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.4} />
        </mesh>

        {/* Keycap Matrix (3 rows x 9 columns) */}
        {Array.from({ length: 27 }).map((_, i) => {
          const col = i % 9;
          const row = Math.floor(i / 9);
          const x = -0.16 + col * 0.04;
          const z = -0.04 + row * 0.035;
          const isAccent = (col === 0 && row === 0) || (col === 8 && row === 0) || (col === 4 && row === 1);
          return (
            <mesh key={i} position={[x, 0.01, z]} castShadow>
              <boxGeometry args={[0.03, 0.008, 0.026]} />
              <meshStandardMaterial
                color={isAccent ? "#246BFD" : i % 2 === 0 ? "#1E293B" : "#334155"}
                roughness={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* 2. Ergonomic Wireless Mouse */}
      <group position={[0.26, 0.006, 0.09]}>
        <mesh rotation={[0.08, 0, 0]} castShadow>
          <capsuleGeometry args={[0.022, 0.036, 12, 16]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
        {/* Scroll wheel */}
        <mesh position={[0, 0.02, -0.01]}>
          <cylinderGeometry args={[0.004, 0.004, 0.014, 12]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 3. Pen / Pencil Cup (Right side of monitor, matching reference image) */}
      <group position={[0.24, 0, -0.16]}>
        {/* Ceramic Holder Cup */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.034, 0.028, 0.10, 16]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        {/* Pens & Stylus inside cup */}
        <mesh position={[-0.01, 0.11, -0.01]} rotation={[0.1, 0.2, 0.15]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
          <meshStandardMaterial color="#246BFD" roughness={0.3} />
        </mesh>
        <mesh position={[0.012, 0.11, 0.01]} rotation={[-0.15, 0.1, -0.1]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.13, 8]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        <mesh position={[0.005, 0.12, -0.015]} rotation={[0.2, -0.15, 0.05]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.15, 8]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Small Indoor Desk Plant (Right of pen cup, matching reference image) */}
      <group position={[0.34, 0, -0.18]}>
        {/* White Ceramic Planter Pot */}
        <mesh position={[0, 0.045, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.09, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
        {/* Dark potting soil */}
        <mesh position={[0, 0.088, 0]}>
          <circleGeometry args={[0.038, 16]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        {/* Succulent Green Leaves Fan */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.sin(r) * 0.024, 0.115, Math.cos(r) * 0.024]}
              rotation={[0.4 * Math.cos(r), r, 0.4 * Math.sin(r)]}
              castShadow
            >
              <sphereGeometry args={[0.018, 12, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#10B981" : "#059669"}
                roughness={0.6}
              />
            </mesh>
          );
        })}
        {/* Center top bud */}
        <mesh position={[0, 0.135, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#34D399" roughness={0.5} />
        </mesh>
      </group>

      {/* 5. Professional Studio Headphones (Resting on left desk) */}
      <group position={[-0.44, 0.035, -0.18]} rotation={[Math.PI / 2, 0, 0.35]}>
        {/* Headband Arc */}
        <mesh castShadow>
          <torusGeometry args={[0.065, 0.008, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} />
        </mesh>
        {/* Left Ear Cushion */}
        <mesh position={[-0.065, 0, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* Right Ear Cushion */}
        <mesh position={[0.065, 0, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
