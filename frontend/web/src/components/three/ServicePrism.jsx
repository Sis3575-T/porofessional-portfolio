import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import PrismFace from "./PrismFace";
import { useServiceViewer } from "../../context/ServiceViewerContext";
import { useTheme } from "../../context/ThemeContext";
import { playDoorOpen, playDoorClose } from "../../utils/doorSound";
import * as THREE from "three";

function SceneBackground({ dark }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(dark ? "#0F1115" : "#FFFFFF");
  }, [dark, scene]);
  return null;
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
  const currentAngle = useRef(0);
  const { dark } = useTheme();
  const { hoveredFace, setHovered, openDoor, closeDoor, activeIndex, doorOpen, isAnimating, animationDone } = useServiceViewer();

  const serviceCount = Math.min(4, Math.max(3, services.length));
  const radius = 3.6 + serviceCount * 0.3;
  const height = 8;

  const handleFaceOpen = useCallback((index) => {
    if (isAnimating) return;
    if (doorOpen && activeIndex === index) {
      playDoorClose();
      closeDoor();
      setTimeout(animationDone, 1200);
    } else {
      if (doorOpen) {
        playDoorClose();
        closeDoor();
        setTimeout(() => {
          playDoorOpen();
          openDoor(index);
          setTimeout(animationDone, 1200);
        }, 800);
      } else {
        playDoorOpen();
        openDoor(index);
        setTimeout(animationDone, 1200);
      }
    }
  }, [openDoor, closeDoor, animationDone, isAnimating, doorOpen, activeIndex]);

  const handleHover = useCallback((index) => {
    setHovered(index);
  }, [setHovered]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (doorOpen && activeIndex >= 0) {
      const targetAngle = -(activeIndex / serviceCount) * Math.PI * 2 + Math.PI / 2;
      let diff = targetAngle - currentAngle.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const step = diff * Math.min(delta * 2.5, 1);
      currentAngle.current += step;
      groupRef.current.rotation.y = currentAngle.current;
    }
  });

  return (
    <>
      <SceneBackground dark={dark} />
      <ambientLight intensity={0.6} color="#e0e7ff" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, 6, 3]} intensity={0.6} color="#60a5fa" distance={15} decay={2} />
      <spotLight position={[0, 8, 4]} angle={0.5} penumbra={0.6} intensity={0.8} color="#ffffff" />

      <group ref={groupRef}>
        {services.slice(0, serviceCount).map((service, i) => (
          <PrismFace
            key={service.id || i}
            service={service}
            index={i}
            total={serviceCount}
            radius={radius}
            height={height}
            isActive={doorOpen && activeIndex === i}
            isOpen={doorOpen && activeIndex === i}
            isHovered={hoveredFace === i}
            onOpen={handleFaceOpen}
            onHover={handleHover}
          />
        ))}

        <mesh position={[0, height / 2 + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, 64]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>

        <mesh position={[0, -(height / 2 + 0.015), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, 64]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>
      </group>

      <FloatingParticles count={60} />

      <ContactShadows position={[0, -(height / 2 + 0.5), 0]} opacity={0.3} scale={14} blur={2.5} far={5} color="#1e3a5f" />

      <Environment preset="city" />
      <fog attach="fog" args={[dark ? "#0F1115" : "#FFFFFF", 10, 30]} />

      {!doorOpen && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
}
