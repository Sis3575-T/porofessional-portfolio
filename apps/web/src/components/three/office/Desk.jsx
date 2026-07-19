export default function Desk({ config = {} }) {
  const deskColor = config.deskColor || "#2a1f14";
  const topColor = config.deskTopColor || "#3d2b1a";

  return (
    <group position={[0, 0.7, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.04, 1.0]} />
        <meshStandardMaterial color={topColor} roughness={0.6} metalness={0.05} />
      </mesh>

      <mesh position={[-0.85, -0.3, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.6, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.85, -0.3, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.6, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.85, -0.3, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.6, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.85, -0.3, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.6, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
    </group>
  );
}
