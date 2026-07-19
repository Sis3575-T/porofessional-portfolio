import { useMemo } from "react";
import * as THREE from "three";

function Keyboard() {
  return (
    <group position={[0, 0.77, 0.18]}>
      <mesh>
        <boxGeometry args={[0.36, 0.015, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.1} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[-0.15 + (i % 10) * 0.033, 0.01, -0.04 + Math.floor(i / 10) * 0.04]}>
          <boxGeometry args={[0.025, 0.008, 0.025]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.25, 0.77, 0.2]}>
      <mesh rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.02, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

function CoffeeCup() {
  return (
    <group position={[-0.65, 0.76, 0.28]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.03, 0.09, 16]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.046, 0]}>
        <cylinderGeometry args={[0.025, 0.028, 0.01, 16]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.9} />
      </mesh>
      <mesh position={[-0.038, 0.02, 0]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.015, 0.004, 8, 12, Math.PI / 2]} />
        <meshStandardMaterial color="#ddd" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-0.75, 0.76, 0.05]}>
      <mesh>
        <boxGeometry args={[0.1, 0.005, 0.08]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.08, 0.003, 0.065]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Plant() {
  return (
    <group position={[-0.8, 0.76, 0.35]}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.035, 0.06, 12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.025, 0.015, 0.04, 8]} />
        <meshStandardMaterial color="#2a4a1a" roughness={0.9} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.04, 0.07 + Math.random() * 0.03, Math.sin((i / 5) * Math.PI * 2) * 0.04]}>
          <sphereGeometry args={[0.015 + Math.random() * 0.01, 6]} />
          <meshStandardMaterial color="#2a5a1a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Phone() {
  return (
    <group position={[-0.5, 0.77, 0.32]}>
      <mesh>
        <boxGeometry args={[0.04, 0.008, 0.07]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.007, 0]}>
        <boxGeometry args={[0.035, 0.003, 0.06]} />
        <meshStandardMaterial color="#0a0a2a" emissive="#2233aa" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function Desk({ config = {} }) {
  const deskColor = config.deskColor || "#1a1410";
  const topColor = config.deskTopColor || "#2a2018";

  return (
    <group position={[0, 0.7, 0]}>
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.04, 1.0]} />
        <meshStandardMaterial color={topColor} roughness={0.5} metalness={0.05} />
      </mesh>

      <mesh position={[-0.95, -0.33, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.95, -0.33, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.95, -0.33, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.95, -0.33, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color={deskColor} roughness={0.8} />
      </mesh>

      <Keyboard />
      <Mouse />
      <CoffeeCup />
      <Notebook />
      <Plant />
      <Phone />
    </group>
  );
}
