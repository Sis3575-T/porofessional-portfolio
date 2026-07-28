import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function createPrismGeometry(sides, radius, height) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.rotateX(Math.PI / 2);
  return geo;
}

function PrismFace({ service, index, total, radius, height, isActive, onClick, accentColor }) {
  const meshRef = useRef();
  const iconRef = useRef();
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;

  const faceX = Math.cos(angle) * (radius + 0.01);
  const faceZ = Math.sin(angle) * (radius + 0.01);
  const faceRotY = -angle + Math.PI / 2;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (iconRef.current) {
      iconRef.current.rotation.y = Math.sin(t * 0.5 + index) * 0.15;
      iconRef.current.position.y = Math.sin(t * 0.8 + index * 0.5) * 0.02;
    }

    const targetScale = isActive ? 1.02 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.05);
  });

  const faceWidth = (2 * Math.PI * radius) / total * 0.85;
  const faceHeight = height * 0.85;

  const color = accentColor || "#00d4ff";

  return (
    <group position={[faceX, 0, faceZ]} rotation={[0, faceRotY, 0]}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(index); }}>
        <planeGeometry args={[faceWidth, faceHeight]} />
        <meshStandardMaterial
          color={isActive ? "#12122a" : "#0d0d1f"}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={isActive ? 1 : 0.8}
        />
      </mesh>

      {/* Glow border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[faceWidth + 0.04, faceHeight + 0.04]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.7 : 0.1}
          transparent
          opacity={isActive ? 0.5 : 0.15}
        />
      </mesh>

      {/* Icon placeholder (uploaded by admin) */}
      <group ref={iconRef} position={[0, faceHeight * 0.28, 0.01]}>
        <mesh>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.5 : 0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
        {service.iconUrl ? (
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.08}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {"[Icon]"}
          </Text>
        ) : (
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.12}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {String(index + 1).padStart(2, "0")}
          </Text>
        )}
      </group>

      {/* Title */}
      <Text
        position={[0, faceHeight * 0.05, 0.01]}
        fontSize={Math.min(0.14, faceWidth * 0.12)}
        fontWeight="bold"
        color={isActive ? "#ffffff" : "#b0b0cc"}
        anchorX="center"
        anchorY="middle"
        maxWidth={faceWidth * 0.85}
      >
        {service.title || "Service"}
      </Text>

      {/* Description */}
      <Text
        position={[0, -faceHeight * 0.12, 0.01]}
        fontSize={Math.min(0.08, faceWidth * 0.07)}
        color={isActive ? "#8888aa" : "#555570"}
        anchorX="center"
        anchorY="middle"
        maxWidth={faceWidth * 0.8}
        lineHeight={1.3}
      >
        {(service.description || "").slice(0, 100)}
      </Text>

      {/* Feature tags */}
      <group position={[0, -faceHeight * 0.3, 0.01]}>
        {(service.features || []).slice(0, 3).map((tag, ti) => {
          const tagText = typeof tag === "string" ? tag : tag.name || "Tag";
          const tagWidth = Math.min(0.5, faceWidth * 0.25);
          return (
            <group key={ti} position={[(ti - Math.min(service.features.length, 3) / 2 + 0.5) * (tagWidth + 0.04), 0, 0]}>
              <mesh>
                <planeGeometry args={[tagWidth, 0.14]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isActive ? 0.3 : 0.1}
                  transparent
                  opacity={0.15}
                />
              </mesh>
              <Text
                position={[0, 0, 0.001]}
                fontSize={0.05}
                color={color}
                anchorX="center"
                anchorY="middle"
              >
                {tagText}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Learn More */}
      <group position={[0, -faceHeight * 0.42, 0.01]}>
        <mesh>
          <planeGeometry args={[0.6, 0.18]} />
          <meshStandardMaterial
            color={isActive ? color : "#1a1a3e"}
            emissive={isActive ? color : "#000000"}
            emissiveIntensity={isActive ? 0.4 : 0}
            transparent
            opacity={isActive ? 0.9 : 0.2}
          />
        </mesh>
        <Text
          position={[0, 0, 0.001]}
          fontSize={0.06}
          color={isActive ? "#000000" : color}
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

function FloatingParticles({ count = 40 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.02;
    mesh.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00d4ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function DynamicPrism({ services = [], onFaceClick }) {
  const groupRef = useRef();
  const [activeFace, setActiveFace] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  const serviceCount = Math.max(3, services.length);
  const radius = 1.2 + serviceCount * 0.08;
  const height = 5.5;

  const geometry = useMemo(
    () => createPrismGeometry(serviceCount, radius, height),
    [serviceCount, radius, height]
  );

  const paddedServices = useMemo(() => {
    const result = [...services];
    while (result.length < serviceCount) {
      result.push({ title: "Coming Soon", description: "New service loading...", features: [] });
    }
    return result;
  }, [services, serviceCount]);

  const handleFaceClick = useCallback((index) => {
    setActiveFace(index);
    onFaceClick?.(paddedServices[index], index);
  }, [paddedServices, onFaceClick]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (!hovered) {
      groupRef.current.rotation.y += delta * 0.12;
    }

    groupRef.current.position.y = Math.sin(t * 0.5) * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00d4ff" distance={15} decay={2} />
      <spotLight position={[0, 8, 3]} angle={0.4} penumbra={0.5} intensity={0.7} color="#ffffff" />

      <group
        ref={groupRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Core prism */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#0a0a1e"
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.35}
            envMapIntensity={1}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.1}
            transparent
            opacity={0.06}
            wireframe
          />
        </mesh>

        {/* Service faces */}
        {paddedServices.map((service, i) => (
          <PrismFace
            key={service.id || i}
            service={service}
            index={i}
            total={serviceCount}
            radius={radius}
            height={height}
            isActive={activeFace === i}
            onClick={handleFaceClick}
            accentColor={service.accentColor}
          />
        ))}

        {/* Top cap */}
        <mesh position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.02, serviceCount]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -(height / 2 + 0.02), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.02, serviceCount]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>

      <FloatingParticles count={50} />

      <ContactShadows
        position={[0, -(height / 2 + 0.3), 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
        color="#000030"
      />

      <Environment preset="city" />
      <fog attach="fog" args={["#0a0a1a", 8, 25]} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={14}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate={false}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}
