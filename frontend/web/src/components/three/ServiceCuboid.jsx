import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

const FACE_CONFIGS = [
  { position: [0, 0, 1], rotation: [0, 0, 0], label: "Front" },
  { position: [0, 0, -1], rotation: [0, Math.PI, 0], label: "Back" },
  { position: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0], label: "Left" },
  { position: [1, 0, 0], rotation: [0, Math.PI / 2, 0], label: "Right" },
  { position: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0], label: "Top" },
  { position: [0, -1, 0], rotation: [Math.PI / 2, 0, 0], label: "Bottom" },
];

const ICONS = {
  code: (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0.011]}>
        <planeGeometry args={[0.32, 0.19]} />
        <meshStandardMaterial color="#0f3460" emissive="#0f3460" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[0.38, 0.008, 0.12]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  ),
  server: (
    <group>
      {[0.12, 0, -0.12].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.07, 0.2]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.1, 0, 0.101]}>
            <circleGeometry args={[0.008, 16]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  ),
  palette: (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e94560" roughness={0.4} />
      </mesh>
      {["#0f3460", "#16213e", "#533483", "#e94560"].map((c, i) => (
        <mesh key={i} position={[Math.cos(i * 1.5) * 0.12, -0.08 + Math.sin(i) * 0.04, Math.sin(i * 1.5) * 0.12]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={c} roughness={0.3} />
        </mesh>
      ))}
    </group>
  ),
  cloud: (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#533483" roughness={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#533483" roughness={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.08, -0.02, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#533483" roughness={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
    </group>
  ),
  chip: (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.03]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.1, 0.1, 0.005]} />
        <meshStandardMaterial color="#0f3460" emissive="#0f3460" emissiveIntensity={0.5} />
      </mesh>
      {[-0.08, -0.04, 0, 0.04, 0.08].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.12, 0]}>
            <boxGeometry args={[0.015, 0.04, 0.01]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[x, -0.12, 0]}>
            <boxGeometry args={[0.015, 0.04, 0.01]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  ),
  database: (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        <meshStandardMaterial color="#16213e" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        <meshStandardMaterial color="#0f3460" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.01, 16]} />
        <meshStandardMaterial color="#533483" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  ),
};

const ICON_KEYS = ["code", "server", "palette", "cloud", "chip", "database"];

function ServiceFace({ service, faceConfig, index, isActive, onClick }) {
  const meshRef = useRef();
  const iconRef = useRef();
  const iconKey = ICON_KEYS[index % ICON_KEYS.length];
  const icon = ICONS[iconKey];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (iconRef.current) {
      iconRef.current.rotation.y = Math.sin(t * 0.5 + index) * 0.15;
      iconRef.current.position.y = Math.sin(t * 0.8 + index * 0.5) * 0.02;
    }

    const targetEmissive = isActive ? 0.15 : 0;
    meshRef.current.children.forEach((child) => {
      if (child.material && child.material.emissiveIntensity !== undefined) {
        child.material.emissiveIntensity = THREE.MathUtils.lerp(
          child.material.emissiveIntensity || 0,
          targetEmissive,
          0.05
        );
      }
    });
  });

  return (
    <group position={faceConfig.position.map((v) => v * 1.01)} rotation={faceConfig.rotation}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(index); }}>
        <planeGeometry args={[1.9, 5.9]} />
        <meshStandardMaterial
          color={isActive ? "#1a1a2e" : "#111122"}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={isActive ? 1 : 0.85}
        />
      </mesh>

      {/* Glow border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[1.96, 5.96]} />
        <meshStandardMaterial
          color={isActive ? "#00d4ff" : "#1a1a3e"}
          emissive={isActive ? "#00d4ff" : "#0a0a1e"}
          emissiveIntensity={isActive ? 0.8 : 0.1}
          transparent
          opacity={isActive ? 0.6 : 0.2}
        />
      </mesh>

      {/* Icon */}
      <group ref={iconRef} position={[0, 1.5, 0.02]}>
        {icon}
      </group>

      {/* Title */}
      <Text
        position={[0, 0.5, 0.02]}
        fontSize={0.18}
        fontWeight="bold"
        color={isActive ? "#00d4ff" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
      >
        {service.title || "Service"}
      </Text>

      {/* Description */}
      <Text
        position={[0, -0.2, 0.02]}
        fontSize={0.1}
        color={isActive ? "#b0b0cc" : "#666680"}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        lineHeight={1.4}
      >
        {service.description || "Description"}
      </Text>

      {/* Tags */}
      <group position={[0, -1.2, 0.02]}>
        {(service.features || []).slice(0, 3).map((tag, ti) => (
          <group key={ti} position={[(ti - 1) * 0.45, 0, 0]}>
            <mesh>
              <planeGeometry args={[0.4, 0.18]} />
              <meshStandardMaterial
                color="#0f3460"
                emissive="#0f3460"
                emissiveIntensity={isActive ? 0.3 : 0.1}
                transparent
                opacity={0.7}
              />
            </mesh>
            <Text
              position={[0, 0, 0.001]}
              fontSize={0.06}
              color="#00d4ff"
              anchorX="center"
              anchorY="middle"
            >
              {typeof tag === "string" ? tag : tag.name || "Tag"}
            </Text>
          </group>
        ))}
      </group>

      {/* Learn More */}
      <group position={[0, -2.2, 0.02]}>
        <mesh>
          <planeGeometry args={[0.8, 0.25]} />
          <meshStandardMaterial
            color={isActive ? "#00d4ff" : "#1a1a3e"}
            emissive={isActive ? "#00d4ff" : "#000000"}
            emissiveIntensity={isActive ? 0.5 : 0}
            transparent
            opacity={isActive ? 0.9 : 0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.001]}
          fontSize={0.08}
          color={isActive ? "#000000" : "#00d4ff"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Learn More
        </Text>
      </group>
    </group>
  );
}

export default function ServiceCuboid({ services = [], onFaceClick }) {
  const groupRef = useRef();
  const [activeFace, setActiveFace] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  const paddedServices = useMemo(() => {
    const result = [...services];
    while (result.length < 6) {
      result.push({ title: "Coming Soon", description: "New service loading...", features: [] });
    }
    return result.slice(0, 6);
  }, [services]);

  const handleFaceClick = useCallback((index) => {
    setActiveFace(index);
    onFaceClick?.(paddedServices[index], index);
  }, [paddedServices, onFaceClick]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (!hovered) {
      groupRef.current.rotation.y += delta * 0.15;
    }

    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Core cuboid */}
      <RoundedBox args={[2, 6, 2]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#0a0a1a"
          roughness={0.15}
          metalness={0.8}
          transparent
          opacity={0.3}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* Edge glow */}
      <RoundedBox args={[2.04, 6.04, 2.04]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
          wireframe
        />
      </RoundedBox>

      {/* Service faces */}
      {paddedServices.map((service, i) => (
        <ServiceFace
          key={i}
          service={service}
          faceConfig={FACE_CONFIGS[i]}
          index={i}
          isActive={activeFace === i}
          onClick={handleFaceClick}
        />
      ))}

      {/* Top cap decoration */}
      <mesh position={[0, 3.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Bottom cap decoration */}
      <mesh position={[0, -3.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
