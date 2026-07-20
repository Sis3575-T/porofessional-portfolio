import * as THREE from "three";

export default function Chair({ config = {} }) {
  const color = config.chairColor || "#2a2a2a";

  return (
    <group position={[1.15, 0, 0.2]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.025, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.5, 24]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, -0.12]}>
        <boxGeometry args={[0.32, 0.25, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.68, -0.1]}>
        <boxGeometry args={[0.3, 0.02, 0.06]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
      </mesh>
      {[
        [-0.15, 0.06, -0.15],
        [0.15, 0.06, -0.15],
        [-0.15, 0.06, 0.15],
        [0.15, 0.06, 0.15],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <cylinderGeometry args={[0.02, 0.025, 0.04, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {[
        [-0.18, 0.32, 0],
        [0.18, 0.32, 0],
      ].map((pos, i) => (
        <mesh key={`arm-${i}`} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[0.04, 0.06, 0.28]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
