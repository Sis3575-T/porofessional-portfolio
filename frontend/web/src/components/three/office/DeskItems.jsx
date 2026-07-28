import { useMemo } from "react";
import * as THREE from "three";

function Keyboard() {
  return (
    <group position={[0, 0.78, 0.08]}>
      {/* Keyboard body */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.012, 0.13]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Keys */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -0.16 + (i % 10) * 0.035,
            0.008,
            -0.045 + Math.floor(i / 10) * 0.04,
          ]}
        >
          <boxGeometry args={[0.028, 0.006, 0.028]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? "#374151" : "#2a2a2a"}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.32, 0.78, 0.1]}>
      <mesh rotation={[0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.022, 0.03, 8, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.02, -0.01]}>
        <cylinderGeometry args={[0.005, 0.005, 0.015, 8]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

function CoffeeMug() {
  return (
    <group position={[-0.62, 0.78, 0.25]}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.032, 0.028, 0.08, 16]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.7} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.038, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.018, 0.004, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.7} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.035, 0]}>
        <circleGeometry args={[0.028, 16]} />
        <meshStandardMaterial color="#3a2010" roughness={0.3} />
      </mesh>
      {/* Steam hint */}
      <pointLight position={[0, 0.06, 0]} intensity={0.01} color="#ffeedd" distance={0.15} />
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-0.72, 0.78, -0.05]}>
      {/* Notebook */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.008, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.13, 0.005, 0.09]} />
        <meshStandardMaterial color="#f8f8f0" roughness={0.95} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.06, 0.01, 0.02]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Plant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2 + Math.random() * 0.4,
        radius: 0.02 + Math.random() * 0.03,
        height: 0.02 + Math.random() * 0.04,
        tilt: 0.3 + Math.random() * 0.5,
        color: new THREE.Color(
          `hsl(${115 + Math.random() * 25}, ${45 + Math.random() * 15}%, ${28 + Math.random() * 12}%)`
        ),
      })),
    []
  );

  return (
    <group position={[-0.78, 0.78, 0.3]}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.028, 0.06, 12]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.028, 0]}>
        <circleGeometry args={[0.032, 12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.004, 0.005, 0.06, 6]} />
        <meshStandardMaterial color="#2a5a1a" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(leaf.angle) * leaf.radius,
            0.08 + leaf.height,
            Math.sin(leaf.angle) * leaf.radius,
          ]}
          rotation={[leaf.tilt * Math.cos(leaf.angle), leaf.angle, leaf.tilt * Math.sin(leaf.angle)]}
        >
          <sphereGeometry args={[0.015 + Math.random() * 0.01, 8, 6]} />
          <meshStandardMaterial color={leaf.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function SmallPlant() {
  return (
    <group position={[0.75, 0.78, -0.2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.04, 10]} />
        <meshStandardMaterial color="#d4ccc0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color="#3a7a2a" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Phone() {
  return (
    <group position={[-0.48, 0.78, 0.28]}>
      <mesh castShadow>
        <boxGeometry args={[0.035, 0.006, 0.065]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.004, 0]}>
        <boxGeometry args={[0.03, 0.002, 0.055]} />
        <meshStandardMaterial color="#111" roughness={0.15} />
      </mesh>
    </group>
  );
}

function DeskLamp() {
  return (
    <group position={[-0.88, 0.78, -0.25]}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.015, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Lower arm */}
      <group position={[0, 0.04, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
          <meshStandardMaterial color="#333" roughness={0.35} metalness={0.5} />
        </mesh>
        {/* Joint */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Upper arm */}
        <group position={[0, 0.2, 0]} rotation={[0.4, 0, -0.2]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
            <meshStandardMaterial color="#333" roughness={0.35} metalness={0.5} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.04, 0.035, 12, 1, true]} />
            <meshStandardMaterial
              color="#4a4a4a"
              roughness={0.3}
              metalness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Bulb glow */}
          <mesh position={[0, 0.19, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial
              color="#fff7ed"
              emissive="#fde68a"
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight position={[0, 0.18, 0]} intensity={0.15} color="#ffd595" distance={1.5} decay={2} />
        </group>
      </group>
    </group>
  );
}

export default function Desk({ config = {} }) {
  const deskColor = config.deskColor || "#5a4030";
  const topColor = config.deskTopColor || "#6b4c35";

  return (
    <group position={[0, 0.7, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.04, 1.1]} />
        <meshStandardMaterial
          color={topColor}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {/* Front edge bevel */}
      <mesh position={[0, 0.005, 0.55]} castShadow>
        <boxGeometry args={[2.4, 0.02, 0.02]} />
        <meshStandardMaterial color={topColor} roughness={0.5} />
      </mesh>

      {/* Legs - modern metal frame */}
      {/* Left leg frame */}
      <mesh position={[-1.1, -0.32, -0.45]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-1.1, -0.32, 0.45]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Left crossbar */}
      <mesh position={[-1.1, -0.55, 0]} castShadow>
        <boxGeometry args={[0.03, 0.03, 0.9]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Right leg frame */}
      <mesh position={[1.1, -0.32, -0.45]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[1.1, -0.32, 0.45]} castShadow>
        <boxGeometry args={[0.04, 0.64, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Right crossbar */}
      <mesh position={[1.1, -0.55, 0]} castShadow>
        <boxGeometry args={[0.03, 0.03, 0.9]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Items */}
      <Keyboard />
      <Mouse />
      <CoffeeMug />
      <Notebook />
      <Plant />
      <SmallPlant />
      <Phone />
      <DeskLamp />
    </group>
  );
}
