import * as THREE from "three";

export default function Chair({ config = {} }) {
  const color = config.chairColor || "#1a1a1a";
  const meshColor = config.chairMesh || "#2a2a2a";

  return (
    <group position={[0, 0, 0.55]} rotation={[0, Math.PI, 0]}>
      {/* Wheels base - 5 star pattern */}
      {[
        [0, 0, 0.2],
        [0.19, 0, 0.06],
        [-0.19, 0, 0.06],
        [0.12, 0, -0.16],
        [-0.12, 0, -0.16],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0], 0.03, pos[2]]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.22, 8]} />
            <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[pos[0] + (pos[0] > 0 ? 0.11 : pos[0] < 0 ? -0.11 : 0), 0.025, pos[2] + (pos[2] > 0 ? 0.09 : pos[2] < 0 ? -0.09 : 0)]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#222" roughness={0.2} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Central pole */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.42, 12]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Gas lift */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.025, 0.08, 12]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Seat pan */}
      <group position={[0, 0.48, 0]}>
        {/* Seat base */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.04, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Seat cushion */}
        <mesh position={[0, 0.025, 0.01]} castShadow>
          <boxGeometry args={[0.38, 0.03, 0.36]} />
          <meshStandardMaterial color={meshColor} roughness={0.9} />
        </mesh>
        {/* Seat front curve */}
        <mesh position={[0, 0.01, 0.19]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.38, 0.03, 0.06]} />
          <meshStandardMaterial color={meshColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Backrest */}
      <group position={[0, 0.78, -0.18]}>
        {/* Back frame */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.52, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Mesh back */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.34, 0.48, 0.01]} />
          <meshStandardMaterial color={meshColor} roughness={0.95} transparent opacity={0.9} />
        </mesh>
        {/* Lumbar support */}
        <mesh position={[0, -0.08, 0.03]} castShadow>
          <boxGeometry args={[0.3, 0.12, 0.02]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      </group>

      {/* Headrest */}
      <group position={[0, 1.12, -0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.2, 0.1, 0.02]} />
          <meshStandardMaterial color={meshColor} roughness={0.9} />
        </mesh>
        {/* Headrest arm */}
        <mesh position={[0, -0.1, 0.01]}>
          <boxGeometry args={[0.04, 0.08, 0.03]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Left armrest */}
      <group position={[-0.24, 0.62, 0]}>
        {/* Arm support */}
        <mesh castShadow>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Arm pad */}
        <mesh position={[0, 0.15, 0.02]} castShadow>
          <boxGeometry args={[0.06, 0.025, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>

      {/* Right armrest */}
      <group position={[0.24, 0.62, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0.02]} castShadow>
          <boxGeometry args={[0.06, 0.025, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
