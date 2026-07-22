import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import ExperienceFace from "./ExperienceFace";
import { useExperience } from "../../context/ExperienceContext";
import { useTheme } from "../../context/ThemeContext";
import { playDoorOpen, playDoorClose } from "../../utils/doorSound";

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

export default function ExperiencePrism({ experiences }) {
  const turntableRef = useRef();
  const currentAngle = useRef(0);
  const targetAngleRef = useRef(0);
  const { dark } = useTheme();
  const { hoveredFace, setHovered, openDoor, closeDoor, activeIndex, doorOpen, isAnimating, animationDone } = useExperience();

  const expCount = Math.min(4, Math.max(3, experiences.length));
  const radius = 4.2;
  const faceWidth = 5.8;
  const faceHeight = 2.0;

  const handleFaceOpen = useCallback((index) => {
    if (isAnimating) return;
    if (doorOpen && activeIndex === index) {
      playDoorClose();
      closeDoor();
      targetAngleRef.current = 0;
      setTimeout(animationDone, 1200);
    } else {
      if (doorOpen) {
        playDoorClose();
        closeDoor();
        setTimeout(() => {
          playDoorOpen();
          openDoor(index);
          const faceAngle = (index / expCount) * Math.PI * 2;
          targetAngleRef.current = -faceAngle;
          setTimeout(animationDone, 1200);
        }, 800);
      } else {
        playDoorOpen();
        openDoor(index);
        const faceAngle = (index / expCount) * Math.PI * 2;
        targetAngleRef.current = -faceAngle;
        setTimeout(animationDone, 1200);
      }
    }
  }, [openDoor, closeDoor, animationDone, isAnimating, doorOpen, activeIndex, expCount]);

  const handleHover = useCallback((index) => {
    setHovered(index);
  }, [setHovered]);

  useFrame((_, delta) => {
    if (!turntableRef.current) return;

    const diff = targetAngleRef.current - currentAngle.current;
    if (Math.abs(diff) > 0.0005) {
      const step = diff * Math.min(delta * 2.2, 1);
      currentAngle.current += step;
      turntableRef.current.rotation.y = currentAngle.current;
    } else {
      currentAngle.current = targetAngleRef.current;
      turntableRef.current.rotation.y = currentAngle.current;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#e0e7ff" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, 6, 3]} intensity={0.6} color="#60a5fa" distance={15} decay={2} />
      <spotLight position={[0, 8, 4]} angle={0.5} penumbra={0.6} intensity={0.8} color="#ffffff" />

      <group ref={turntableRef}>
        {experiences.slice(0, expCount).map((experience, i) => (
          <ExperienceFace
            key={experience.id || i}
            experience={experience}
            index={i}
            total={expCount}
            radius={radius}
            faceWidth={faceWidth}
            faceHeight={faceHeight}
            currentAngle={currentAngle}
            isActive={doorOpen && activeIndex === i}
            isOpen={doorOpen && activeIndex === i}
            isHovered={hoveredFace === i}
            onOpen={handleFaceOpen}
            onHover={handleHover}
          />
        ))}

        <mesh position={[0, faceHeight / 2 + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, 64]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -(faceHeight / 2 + 0.015), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.015, 64]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
        </mesh>
      </group>

      <FloatingParticles count={60} />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={14} blur={2.5} far={5} color="#1e3a5f" />

      <Environment preset="city" />
      <fog attach="fog" args={[dark ? "#0F1115" : "#FFFFFF", 10, 30]} />

      {!doorOpen && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
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
