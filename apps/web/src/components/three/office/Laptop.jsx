export default function Laptop() {
  return (
    <group position={[0, 0.77, -0.12]}>
      <group rotation={[-0.35, 0, 0]} position={[0, 0.015, -0.06]}>
        <mesh position={[0, 0, -0.002]}>
          <boxGeometry args={[0.28, 0.18, 0.005]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[0.26, 0.16, 0.003]} />
          <meshStandardMaterial color="#111" roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, -0.005, 0.015]}>
        <boxGeometry args={[0.28, 0.008, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
