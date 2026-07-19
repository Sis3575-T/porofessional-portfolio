import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ config = {} }) {
  const count = config.particleCount || 60;
  const ref = useRef();

  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.3;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t + i) * 0.0003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.015}
        color="#22d3ee"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
