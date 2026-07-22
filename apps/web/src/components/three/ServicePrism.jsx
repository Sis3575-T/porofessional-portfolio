import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import PrismFace from "./PrismFace";
import { useServiceViewer } from "../../context/ServiceViewerContext";

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

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  geo.center();
  geo.rotateX(Math.PI / 2);
  return geo;
}

function FloatingParticles({ count = 50 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#60a5fa" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function ServicePrism({ services }) {
  const groupRef = useRef();
  const { hoveredFace, setHovered, openService, isOpen, isAnimating } = useServiceViewer();

  const serviceCount = Math.max(3, services.length);
  const radius = 1.4 + serviceCount * 0.06;
  const height = 5.5;

  const geometry = useMemo(
    () => createPrismGeometry(serviceCount, radius, height),
    [serviceCount, radius, height]
  );

  const handleFaceClick = useCallback((index) => {
    if (isAnimating) return;
    openService(index);
  }, [openService, isAnimating]);

  const handleHover = useCallback((index) => {
    setHovered(index);
  }, [setHovered]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (!isOpen && !isAnimating) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    groupRef.current.position.y = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#e0e7ff" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, 6, 3]} intensity={0.6} color="#60a5fa" distance={15} decay={2} />
      <spotLight position={[0, 8, 4]} angle={0.5} penumbra={0.6} intensity={0.8} color="#ffffff" />

      <group ref={groupRef}>
        {/* Core prism - blue tinted glass */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#1e3a5f"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.2}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Wireframe frame */}
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.15}
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>

        {/* Service faces */}
        {services.map((service, i) => (
          <PrismFace
            key={service.id || i}
            service={service}
            index={i}
            total={serviceCount}
            radius={radius}
            height={height}
            isActive={false}
            isHovered={hoveredFace === i}
            onClick={handleFaceClick}
            onHover={handleHover}
          />
        ))}

        {/* Top cap */}
        <mesh position={[0, height / 2 + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, serviceCount]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -(height / 2 + 0.015), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, serviceCount]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>
      </group>

      <FloatingParticles count={60} />

      <ContactShadows
        position={[0, -(height / 2 + 0.5), 0]}
        opacity={0.3}
        scale={14}
        blur={2.5}
        far={5}
        color="#1e3a5f"
      />

      <Environment preset="city" />
      <fog attach="fog" args={["#0c1929", 10, 30]} />

      {!isOpen && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={16}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.6}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
}
