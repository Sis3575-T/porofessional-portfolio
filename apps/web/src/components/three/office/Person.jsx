import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function LeftArm({ typingSpeed }) {
  const armRef = useRef();
  const forearmRef = useRef();

  useFrame((state) => {
    if (!armRef.current || !forearmRef.current) return;
    const t = state.clock.elapsedTime * typingSpeed;
    forearmRef.current.rotation.x = -0.3 + Math.sin(t * 2.3) * 0.04;
    armRef.current.rotation.x = -0.1 + Math.sin(t * 2.1 + 0.5) * 0.02;
  });

  return (
    <group position={[0.18, 0.65, -0.08]}>
      <group ref={armRef} rotation={[0.1, -0.1, 0.08]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.35, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
        </mesh>
        <group ref={forearmRef} position={[0, -0.35, 0]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, -0.12, 0.03]}>
            <cylinderGeometry args={[0.03, 0.025, 0.22, 8]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.23, 0.04]}>
            <boxGeometry args={[0.03, 0.035, 0.025]} />
            <meshStandardMaterial color="#2a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function RightArm({ typingSpeed }) {
  const armRef = useRef();
  const forearmRef = useRef();

  useFrame((state) => {
    if (!armRef.current || !forearmRef.current) return;
    const t = state.clock.elapsedTime * typingSpeed;
    forearmRef.current.rotation.x = -0.3 + Math.sin(t * 2.7 + 1) * 0.04;
    armRef.current.rotation.x = -0.1 + Math.sin(t * 2.4 + 1.5) * 0.02;
  });

  return (
    <group position={[-0.18, 0.65, -0.08]}>
      <group ref={armRef} rotation={[0.1, 0.1, -0.08]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.35, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
        </mesh>
        <group ref={forearmRef} position={[0, -0.35, 0]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, -0.12, 0.03]}>
            <cylinderGeometry args={[0.03, 0.025, 0.22, 8]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.23, 0.04]}>
            <boxGeometry args={[0.03, 0.035, 0.025]} />
            <meshStandardMaterial color="#2a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Head({ breathingSpeed }) {
  const headRef = useRef();

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.elapsedTime * breathingSpeed;
    headRef.current.position.y = 0.9 + Math.sin(t * 0.8) * 0.005;
  });

  return (
    <group ref={headRef} position={[0, 0.9, -0.05]}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.06, 0.1]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Torso() {
  return (
    <group position={[0, 0.55, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.16, 0.35, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.025, 24]} />
        <meshStandardMaterial color="#0e0e1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.27, 0.55, 24]} />
        <meshStandardMaterial color="#0e0e1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.58, -0.1]}>
        <boxGeometry args={[0.28, 0.22, 0.04]} />
        <meshStandardMaterial color="#0e0e1e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.54, 8]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
      </mesh>
      {[
        [-0.13, 0.05, -0.13],
        [0.13, 0.05, -0.13],
        [-0.13, 0.05, 0.13],
        [0.13, 0.05, 0.13],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <cylinderGeometry args={[0.02, 0.022, 0.035, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function Person({ typingSpeed = 2, breathingSpeed = 0.8 }) {
  return (
    <group position={[1.15, 0.7, 0.2]}>
      <Chair />
      <Torso />
      <Head breathingSpeed={breathingSpeed} />
      <LeftArm typingSpeed={typingSpeed} />
      <RightArm typingSpeed={typingSpeed} />
    </group>
  );
}
