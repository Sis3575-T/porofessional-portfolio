import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Laptop() {
  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a2a",
    emissive: "#1a3a5a",
    emissiveIntensity: 0.15,
    roughness: 0.3,
  }), []);

  const lidMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#181818",
    roughness: 0.4,
    metalness: 0.3,
  }), []);

  useFrame((state) => {
    screenMat.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group position={[0, 0.77, -0.12]}>
      <group rotation={[-0.35, 0, 0]} position={[0, 0.015, -0.06]}>
        <mesh position={[0, 0, -0.002]}>
          <boxGeometry args={[0.28, 0.18, 0.005]} />
          <primitive object={lidMat} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[0.26, 0.16, 0.003]} />
          <primitive object={screenMat} />
        </mesh>
      </group>
      <mesh position={[0, -0.005, 0.015]}>
        <boxGeometry args={[0.28, 0.008, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
