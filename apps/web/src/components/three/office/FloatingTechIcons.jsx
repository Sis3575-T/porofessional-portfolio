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
  { label: "Python", color: "#3776AB", size: 0.08 },
  { label: "Three", color: "#000000", size: 0.08 },
];

export default function FloatingTechIcons({ config = {} }) {
  const groupRef = useRef();
  const count = Math.min(config.iconCount || 8, icons.length);

  const items = useMemo(() => {
    return icons.slice(0, count).map((item, i) => ({
      ...item,
      angle: (i / count) * Math.PI * 2,
      radius: 1.8 + Math.random() * 0.4,
      speed: 0.1 + Math.random() * 0.06,
      yBase: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
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
      child.position.y = item.yBase + Math.sin(t * 0.3 + item.phase) * 0.12;
      child.rotation.y += 0.005;
      child.rotation.x = Math.sin(t * 0.2 + item.phase) * 0.05;
    });
  });

  return (
    <group ref={groupRef} position={[0, 1.6, -0.3]}>
      {items.map((item) => (
        <mesh key={item.label}>
          <planeGeometry args={[item.size, item.size]} />
          <meshBasicMaterial color={item.color} transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
