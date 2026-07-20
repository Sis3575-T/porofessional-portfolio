import { useMemo } from "react";
import * as THREE from "three";

function CitySkyline() {
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 30; i++) {
      b.push({
        x: (Math.random() - 0.5) * 10,
        width: 0.08 + Math.random() * 0.15,
        height: 0.3 + Math.random() * 1.5,
        depth: 0.1 + Math.random() * 0.15,
        color: new THREE.Color(`hsl(220, 5%, ${8 + Math.random() * 12}%)`),
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
        <meshPhysicalMaterial color="#2a3a4a" roughness={0.05} metalness={0.1} transparent opacity={0.25} />
      </mesh>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.6, 3.0, 0.02)]} />
        <lineBasicMaterial color="#3a3a3a" />
      </lineSegments>
      <mesh position={[0, -1.52, 0]}>
        <boxGeometry args={[2.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[2.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-1.32, 0, 0]}>
        <boxGeometry args={[0.04, 3.04, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[1.32, 0, 0]}>
        <boxGeometry args={[0.04, 3.04, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default function Room({ config = {} }) {
  const wallColor = config.wallColor || "#f7f7fb";
  const floorColor = config.floorColor || "#f2f4f8";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} metalness={0.05} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.01, 1.6, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3.01, 1.6, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.21, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-1.8, 1.6, -2.51]}>
        <planeGeometry args={[1.9, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.8, 1.6, -2.51]}>
        <planeGeometry args={[1.9, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 0.01, -2.49]}>
        <boxGeometry args={[8, 0.02, 0.02]} />
        <meshStandardMaterial color="#d7dce6" roughness={0.4} metalness={0.05} />
      </mesh>

      <CitySkyline />
      <Window />
    </group>
  );
}
