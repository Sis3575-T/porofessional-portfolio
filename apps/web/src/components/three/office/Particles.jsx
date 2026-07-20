import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ config = {} }) {
  const count = config.particleCount || 80;
  const ref = useRef();

  const [geom, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const accentColor = new THREE.Color("#22d3ee");
    const dimColor = new THREE.Color("#4466aa");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const mix = Math.random();
      const color = accentColor.clone().lerp(dimColor, mix * 0.7);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(c, 3));
    return [g, c];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.2;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t + i * 0.5) * 0.0003;
      pos[i * 3] += Math.cos(t * 0.7 + i * 0.3) * 0.00015;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
