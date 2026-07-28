import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

export default function PrismFace({ service, index, total, radius, height, isActive, isOpen, isHovered, onOpen, onHover }) {
  const doorRef = useRef();
  const btnGroupRef = useRef();
  const [btnHover, setBtnHover] = useState(false);
  const { dark } = useTheme();

  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const faceX = Math.cos(angle) * (radius + 0.01);
  const faceZ = Math.sin(angle) * (radius + 0.01);
  const faceRotY = -angle + Math.PI / 2;

  const faceWidth = (2 * Math.PI * radius) / total * 0.78;
  const faceHeight = height * 0.75;

  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = isOpen ? Math.PI / 2 : 0;
  }, [isOpen]);

  useFrame((_, delta) => {
    if (!doorRef.current) return;
    const diff = targetRotation.current - currentRotation.current;
    if (Math.abs(diff) > 0.001) {
      currentRotation.current += diff * Math.min(delta * 4, 1);
      doorRef.current.rotation.y = currentRotation.current;
    } else {
      currentRotation.current = targetRotation.current;
      doorRef.current.rotation.y = currentRotation.current;
    }
    if (btnGroupRef.current) {
      const s = btnHover ? 1.08 : 1;
      btnGroupRef.current.scale.x = THREE.MathUtils.lerp(btnGroupRef.current.scale.x, s, 0.12);
      btnGroupRef.current.scale.y = THREE.MathUtils.lerp(btnGroupRef.current.scale.y, s, 0.12);
    }
  });

  const shortDesc = (service.shortDescription || service.description || "").slice(0, 100);
  const dim = isActive ? 1 : isHovered ? 0.97 : 0.92;

  return (
    <group
      position={[faceX, 0, faceZ]}
      rotation={[0, faceRotY, 0]}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(-1); setBtnHover(false); }}
    >
      <group ref={doorRef} position={[-faceWidth / 2, 0, 0]}>
        <group position={[faceWidth / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[faceWidth, faceHeight]} />
            <meshStandardMaterial color={dark ? "#ffffff" : "#1B1F24"} roughness={0.35} metalness={0.05} transparent opacity={dim} side={THREE.DoubleSide} />
          </mesh>

          <mesh position={[0, 0, -0.003]}>
            <planeGeometry args={[faceWidth + 0.04, faceHeight + 0.04]} />
            <meshStandardMaterial color={isHovered ? "#60a5fa" : (dark ? "#334155" : "#E5E7EB")} roughness={0.4} transparent opacity={0.35} />
          </mesh>

          <mesh position={[0, faceHeight / 2 - 0.02, 0.001]}>
            <planeGeometry args={[faceWidth * 0.3, 0.03]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>

          <group position={[0, faceHeight * 0.26, 0.006]}>
            <mesh>
              <circleGeometry args={[0.32, 32]} />
              <meshStandardMaterial color={isHovered ? "#eff6ff" : (dark ? "#f1f5f9" : "#f1f5f9")} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, -0.001]}>
              <ringGeometry args={[0.30, 0.32, 32]} />
              <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={isHovered ? 0.5 : 0.2} />
            </mesh>
            <Text position={[0, 0, 0.002]} fontSize={0.2} color="#2563eb" anchorX="center" anchorY="middle" fontWeight="bold">
              {String(index + 1).padStart(2, "0")}
            </Text>
          </group>

          <Text position={[0, faceHeight * 0.06, 0.006]} fontSize={Math.min(0.26, faceWidth * 0.14)} fontWeight="bold" color={dark ? "#0f172a" : "#ffffff"} anchorX="center" anchorY="middle" maxWidth={faceWidth * 0.85}>
            {service.title || "Service"}
          </Text>

          <Text position={[0, -faceHeight * 0.06, 0.006]} fontSize={Math.min(0.13, faceWidth * 0.07)} color={dark ? "#475569" : "#B8BDC7"} anchorX="center" anchorY="middle" maxWidth={faceWidth * 0.78} lineHeight={1.4}>
            {shortDesc}
          </Text>

          <group ref={btnGroupRef} position={[0, -faceHeight * 0.22, 0.006]} onPointerEnter={() => setBtnHover(true)} onPointerLeave={() => setBtnHover(false)} onClick={(e) => { e.stopPropagation(); onOpen(index); }}>
            <mesh>
              <planeGeometry args={[0.9, 0.3]} />
              <meshStandardMaterial color={btnHover ? "#1e40af" : "#2563eb"} roughness={0.3} metalness={0.1} />
            </mesh>
            <Text position={[0, 0, 0.002]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
              {isActive ? "Close" : "Open"}
            </Text>
          </group>

          <mesh position={[-faceWidth / 2, 0, 0.001]}>
            <planeGeometry args={[0.03, faceHeight * 0.9]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
