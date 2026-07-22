import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export default function PrismFace({ service, index, total, radius, height, isActive, isHovered, onClick, onHover }) {
  const groupRef = useRef();
  const btnGroupRef = useRef();
  const [btnHover, setBtnHover] = useState(false);

  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const faceX = Math.cos(angle) * (radius + 0.008);
  const faceZ = Math.sin(angle) * (radius + 0.008);
  const faceRotY = -angle + Math.PI / 2;

  const faceWidth = (2 * Math.PI * radius) / total * 0.78;
  const faceHeight = height * 0.78;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (btnGroupRef.current) {
      const targetScale = btnHover ? 1.08 : 1;
      btnGroupRef.current.scale.x = THREE.MathUtils.lerp(btnGroupRef.current.scale.x, targetScale, 0.1);
      btnGroupRef.current.scale.y = THREE.MathUtils.lerp(btnGroupRef.current.scale.y, targetScale, 0.1);
    }
  });

  const iconUrl = service.iconUrl || service.icon;
  const shortDesc = (service.shortDescription || service.description || "").slice(0, 100);

  return (
    <group
      ref={groupRef}
      position={[faceX, 0, faceZ]}
      rotation={[0, faceRotY, 0]}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(-1); setBtnHover(false); }}
    >
      {/* Face background - white */}
      <mesh>
        <planeGeometry args={[faceWidth, faceHeight]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={isHovered ? 0.98 : 0.92}
        />
      </mesh>

      {/* Border - light blue/gray */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[faceWidth + 0.04, faceHeight + 0.04]} />
        <meshStandardMaterial
          color={isHovered ? "#60a5fa" : "#94a3b8"}
          roughness={0.4}
          transparent
          opacity={isHovered ? 0.8 : 0.5}
        />
      </mesh>

      {/* Top accent line */}
      <mesh position={[0, faceHeight / 2 - 0.02, 0.001]}>
        <planeGeometry args={[faceWidth * 0.25, 0.025]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>

      {/* Icon circle */}
      <group position={[0, faceHeight * 0.28, 0.006]}>
        <mesh>
          <circleGeometry args={[0.28, 32]} />
          <meshStandardMaterial
            color={isHovered ? "#eff6ff" : "#f1f5f9"}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 0, -0.001]}>
          <ringGeometry args={[0.26, 0.28, 32]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#2563eb"
            emissiveIntensity={isHovered ? 0.4 : 0.15}
          />
        </mesh>
        <Text
          position={[0, 0, 0.002]}
          fontSize={0.17}
          color="#2563eb"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {String(index + 1).padStart(2, "0")}
        </Text>
      </group>

      {/* Title */}
      <Text
        position={[0, faceHeight * 0.08, 0.006]}
        fontSize={Math.min(0.18, faceWidth * 0.1)}
        fontWeight="bold"
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        maxWidth={faceWidth * 0.85}
      >
        {service.title || "Service"}
      </Text>

      {/* Short description */}
      <Text
        position={[0, -faceHeight * 0.06, 0.006]}
        fontSize={Math.min(0.09, faceWidth * 0.055)}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        maxWidth={faceWidth * 0.78}
        lineHeight={1.4}
      >
        {shortDesc}
      </Text>

      {/* Open button */}
      <group
        ref={btnGroupRef}
        position={[0, -faceHeight * 0.22, 0.006]}
        onPointerEnter={() => setBtnHover(true)}
        onPointerLeave={() => setBtnHover(false)}
        onClick={(e) => { e.stopPropagation(); onClick(index); }}
      >
        {/* Button bg */}
        <mesh>
          <planeGeometry args={[0.7, 0.24]} />
          <meshStandardMaterial
            color={btnHover ? "#1e40af" : "#2563eb"}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* Button border */}
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[0.72, 0.26]} />
          <meshStandardMaterial
            color="#1d4ed8"
            roughness={0.4}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Button text */}
        <Text
          position={[0, 0, 0.002]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Open
        </Text>
      </group>
    </group>
  );
}
