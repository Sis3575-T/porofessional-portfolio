import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

export default function ExperienceFace({ experience, index, total, radius, faceWidth, faceHeight, currentAngle, isActive, isOpen, isHovered, onOpen, onHover }) {
  const counterRef = useRef();
  const doorRef = useRef();
  const btnGroupRef = useRef();
  const [btnHover, setBtnHover] = useState(false);
  const { dark } = useTheme();

  const faceAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const faceX = Math.cos(faceAngle) * (radius + 0.01);
  const faceZ = Math.sin(faceAngle) * (radius + 0.01);
  const faceRotY = -faceAngle + Math.PI / 2;

  const targetRotation = useRef(0);
  const currentDoorRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = isOpen ? Math.PI / 2 : 0;
  }, [isOpen]);

  useFrame((_, delta) => {
    if (counterRef.current && currentAngle) {
      counterRef.current.rotation.y = -(currentAngle.current + faceAngle);
    }

    if (doorRef.current) {
      const diff = targetRotation.current - currentDoorRotation.current;
      if (Math.abs(diff) > 0.001) {
        currentDoorRotation.current += diff * Math.min(delta * 4, 1);
        doorRef.current.rotation.y = currentDoorRotation.current;
      } else {
        currentDoorRotation.current = targetRotation.current;
        doorRef.current.rotation.y = currentDoorRotation.current;
      }
    }

    if (btnGroupRef.current) {
      const s = btnHover ? 1.08 : 1;
      btnGroupRef.current.scale.x = THREE.MathUtils.lerp(btnGroupRef.current.scale.x, s, 0.12);
      btnGroupRef.current.scale.y = THREE.MathUtils.lerp(btnGroupRef.current.scale.y, s, 0.12);
    }
  });

  const company = experience.company || "Company";
  const position = experience.position || "Role";
  const startDate = experience.startDate ? new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  const endDate = experience.isCurrent ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  const period = startDate ? `${startDate} – ${endDate}` : "";
  const dim = isActive ? 1 : isHovered ? 0.92 : 0.82;

  return (
    <group
      position={[faceX, 0, faceZ]}
      rotation={[0, faceRotY, 0]}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(-1); setBtnHover(false); }}
    >
      <group ref={counterRef}>
        <group ref={doorRef} position={[-faceWidth / 2, 0, 0]}>
          <group position={[faceWidth / 2, 0, 0]}>
            <mesh>
              <planeGeometry args={[faceWidth, faceHeight]} />
              <meshStandardMaterial color={dark ? "#ffffff" : "#1B1F24"} roughness={0.35} metalness={0.05} transparent opacity={dim} side={THREE.DoubleSide} />
            </mesh>

            <mesh position={[0, 0, -0.003]}>
              <planeGeometry args={[faceWidth + 0.04, faceHeight + 0.04]} />
              <meshStandardMaterial color={isHovered ? "#60a5fa" : (dark ? "#E5E7EB" : "#334155")} roughness={0.4} transparent opacity={0.35} />
            </mesh>

            <mesh position={[0, faceHeight / 2 - 0.02, 0.001]}>
              <planeGeometry args={[faceWidth * 0.15, 0.025]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>

            <group position={[0, 0, 0.005]}>
              <group position={[-faceWidth * 0.38, 0, 0]}>
                <mesh>
                  <circleGeometry args={[0.28, 32]} />
                  <meshStandardMaterial color={isHovered ? "#eff6ff" : "#f1f5f9"} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0, -0.001]}>
                  <ringGeometry args={[0.26, 0.28, 32]} />
                  <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={isHovered ? 0.4 : 0.15} />
                </mesh>
                <Text position={[0, 0, 0.002]} fontSize={0.17} color="#2563eb" anchorX="center" anchorY="middle" fontWeight="bold">
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </group>

              <Text position={[-faceWidth * 0.22, faceHeight * 0.1, 0]} fontSize={Math.min(0.18, faceWidth * 0.032)} fontWeight="bold" color={dark ? "#ffffff" : "#0f172a"} anchorX="left" anchorY="middle" maxWidth={faceWidth * 0.3}>
                {company}
              </Text>

              <Text position={[-faceWidth * 0.22, -faceHeight * 0.1, 0]} fontSize={Math.min(0.08, faceWidth * 0.015)} color={dark ? "#B8BDC7" : "#475569"} anchorX="left" anchorY="middle" maxWidth={faceWidth * 0.3}>
                {position}
              </Text>

              <Text position={[faceWidth * 0.08, -faceHeight * 0.1, 0]} fontSize={Math.min(0.07, faceWidth * 0.013)} color={dark ? "#6B7280" : "#94a3b8"} anchorX="left" anchorY="middle" maxWidth={faceWidth * 0.18}>
                {period}
              </Text>

              <group ref={btnGroupRef} position={[faceWidth * 0.36, 0, 0]} onPointerEnter={() => setBtnHover(true)} onPointerLeave={() => setBtnHover(false)} onClick={(e) => { e.stopPropagation(); onOpen(index); }}>
                <mesh>
                  <planeGeometry args={[0.9, 0.3]} />
                  <meshStandardMaterial color={btnHover ? "#1e40af" : "#2563eb"} roughness={0.3} metalness={0.1} />
                </mesh>
                <Text position={[0, 0, 0.002]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
                  {isActive ? "Close" : "Open"}
                </Text>
              </group>
            </group>

            <mesh position={[-faceWidth / 2, 0, 0.001]}>
              <planeGeometry args={[0.03, faceHeight * 0.9]} />
              <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
