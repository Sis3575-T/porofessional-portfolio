import { useMemo } from "react";
import * as THREE from "three";

function Keyboard() {
  return (
    <group position={[0, 0.77, 0.18]}>
      <mesh castShadow>
        <boxGeometry args={[0.36, 0.015, 0.12]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.2} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[-0.15 + (i % 10) * 0.033, 0.01, -0.04 + Math.floor(i / 10) * 0.04]}>
          <boxGeometry args={[0.025, 0.008, 0.025]} />
          <meshStandardMaterial color="#374151" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.25, 0.77, 0.2]}>
      <mesh rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.02, 16]} />
        <meshStandardMaterial color="#181818" roughness={0.3} metalness={0.15} />
      </mesh>
    </group>
  );
}

function CoffeeCup() {
  return (
    <group position={[-0.65, 0.76, 0.28]}>
      <mesh castShadow>
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
      <pointLight position={[0, 0.05, 0]} intensity={0.02} color="#ff8844" distance={0.3} />
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-0.75, 0.76, 0.05]}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.005, 0.08]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.08, 0.003, 0.065]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Plant() {
  const leaves = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      angle: (i / 7) * Math.PI * 2 + Math.random() * 0.3,
      radius: 0.03 + Math.random() * 0.025,
      height: 0.02 + Math.random() * 0.03,
      color: new THREE.Color(`hsl(${110 + Math.random() * 30}, ${40 + Math.random() * 20}%, ${25 + Math.random() * 15}%)`),
    })),
  []);

  return (
    <group position={[-0.8, 0.76, 0.35]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.06, 12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.025, 0.015, 0.04, 8]} />
        <meshStandardMaterial color="#2a4a1a" roughness={0.9} />
      </mesh>
      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(leaf.angle) * leaf.radius,
            0.07 + leaf.height,
            Math.sin(leaf.angle) * leaf.radius,
          ]}
        >
          <sphereGeometry args={[0.012 + Math.random() * 0.01, 6]} />
          <meshStandardMaterial color={leaf.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Phone() {
  return (
    <group position={[-0.5, 0.77, 0.32]}>
      <mesh castShadow>
        <boxGeometry args={[0.04, 0.008, 0.07]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.007, 0]}>
        <boxGeometry args={[0.035, 0.003, 0.06]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>
    </group>
  );
}

function DeskLamp() {
  return (
    <group position={[-0.9, 0.76, -0.3]}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.08, 12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.45} metalness={0.25} />
      </mesh>
      <group rotation={[0.4, 0.3, 0]} position={[0, 0.09, 0]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 6]} />
          <meshStandardMaterial color="#374151" roughness={0.35} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <coneGeometry args={[0.04, 0.03, 12]} />
          <meshStandardMaterial color="#4b5563" roughness={0.25} metalness={0.45} />
        </mesh>
        <pointLight position={[0, 0.06, 0]} intensity={0.22} color="#ffd595" distance={1.7} decay={2} />
        <mesh position={[0, 0.05, 0]}>
          <coneGeometry args={[0.035, 0.025, 12]} />
          <meshStandardMaterial
            color="#fff7ed"
            emissive="#fde68a"
            emissiveIntensity={0.12}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Desk({ config = {} }) {
  const deskColor = config.deskColor || "#2e211b";
  const topColor = config.deskTopColor || "#4a3a2d";

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

      <DeskLamp />
      <Keyboard />
      <Mouse />
      <CoffeeCup />
      <Notebook />
      <Plant />
      <Phone />
    </group>
  );
}
