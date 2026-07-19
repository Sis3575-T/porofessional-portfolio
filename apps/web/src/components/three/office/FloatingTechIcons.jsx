import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const icons = [
  { label: "React", color: "#61dafb", size: 0.1 },
  { label: "Node", color: "#68a063", size: 0.1 },
  { label: "TS", color: "#3178c6", size: 0.08 },
  { label: "Docker", color: "#0db7ed", size: 0.1 },
  { label: "Mongo", color: "#4db33d", size: 0.1 },
  { label: "Next", color: "#ffffff", size: 0.08 },
  { label: "AWS", color: "#ff9900", size: 0.08 },
  { label: "Git", color: "#f05032", size: 0.08 },
];

export default function FloatingTechIcons({ config = {} }) {
  const groupRef = useRef();
  const count = Math.min(config.iconCount || 8, icons.length);

  const items = useMemo(() => {
    return icons.slice(0, count).map((item, i) => ({
      ...item,
      angle: (i / count) * Math.PI * 2,
      radius: 1.6 + Math.random() * 0.5,
      speed: 0.12 + Math.random() * 0.08,
      yBase: (Math.random() - 0.5) * 0.6,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    items.forEach((item, i) => {
      const child = groupRef.current.children[i];
      if (!child) return;
      const angle = item.angle + t * item.speed;
      child.position.x = Math.cos(angle) * item.radius;
      child.position.z = Math.sin(angle) * item.radius;
      child.position.y = item.yBase + Math.sin(t * 0.4 + i * 1.2) * 0.15;
      child.rotation.y += 0.008;
    });
  });

  return (
    <group ref={groupRef} position={[0, 1.8, -0.3]}>
      {items.map((item) => (
        <mesh key={item.label}>
          <planeGeometry args={[item.size, item.size]} />
          <meshBasicMaterial color={item.color} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
