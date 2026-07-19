import { useMemo } from "react";
import * as THREE from "three";

function CitySkyline() {
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 40; i++) {
      b.push({
        x: (Math.random() - 0.5) * 10,
        width: 0.1 + Math.random() * 0.18,
        height: 0.3 + Math.random() * 1.5,
        depth: 0.1 + Math.random() * 0.15,
        color: new THREE.Color().setHSL(0.62, 0.08, 0.04 + Math.random() * 0.12),
        windows: Math.floor(3 + Math.random() * 6),
      });
    }
    return b;
  }, []);

  return (
    <group position={[0, 0.2, -2.55]}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.height / 2, 0]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshBasicMaterial color={b.color} />
          </mesh>
          {Array.from({ length: b.windows }).map((_, j) => (
            <pointLight
              key={j}
              position={[
                (Math.random() - 0.5) * b.width * 0.4,
                -b.height / 2 + 0.06 + (j / b.windows) * b.height * 0.8,
                b.depth / 2 + 0.005,
              ]}
              intensity={0.01 + Math.random() * 0.04}
              color={new THREE.Color().setHSL(0.08, 0.8, 0.25 + Math.random() * 0.4)}
              distance={0.3}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Window() {
  return (
    <group position={[0, 1.6, -2.5]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.4, 2.8]} />
        <meshPhysicalMaterial color="#0a0a2a" roughness={0.1} metalness={0} transparent opacity={0.35} />
      </mesh>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.6, 3.0, 0.02)]} />
        <lineBasicMaterial color="#2a2a4a" />
      </lineSegments>
      <mesh position={[0, -1.52, 0]}>
        <boxGeometry args={[2.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[2.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-1.32, 0, 0]}>
        <boxGeometry args={[0.04, 3.04, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[1.32, 0, 0]}>
        <boxGeometry args={[0.04, 3.04, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default function Room({ config = {} }) {
  const wallColor = config.wallColor || "#0f0f1e";
  const floorColor = config.floorColor || "#0e0e1e";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={floorColor} roughness={0.7} metalness={0.15} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.01, 1.6, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3.01, 1.6, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.21, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-1.8, 1.6, -2.51]}>
        <planeGeometry args={[1.9, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.8, 1.6, -2.51]}>
        <planeGeometry args={[1.9, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <CitySkyline />
      <Window />
    </group>
  );
}
