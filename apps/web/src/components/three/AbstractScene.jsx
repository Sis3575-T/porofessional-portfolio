import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function FloatingCube({ position, color, speed = 1, size = 0.3, mouse }) {
  const ref = useRef();
  const initPos = useMemo(() => position, []);
  useFrame((state) => {
    ref.current.rotation.x += 0.005 * speed;
    ref.current.rotation.y += 0.01 * speed;
    ref.current.position.y = initPos[1] + Math.sin(state.clock.elapsedTime * speed) * 0.08;
    if (mouse.current) {
      ref.current.position.x = initPos[0] + mouse.current.x * 0.15;
      ref.current.position.z = initPos[2] + mouse.current.y * 0.15;
    }
  });
  return (
    <Float speed={speed * 0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color, speed = 1, size = 0.2, mouse }) {
  const ref = useRef();
  const initPos = useMemo(() => position, []);
  useFrame((state) => {
    ref.current.position.x = initPos[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
    ref.current.position.z = initPos[2] + Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.2;
    if (mouse.current) {
      ref.current.position.y = initPos[1] + mouse.current.y * 0.12;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function TorusKnot({ mouse }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x += 0.003;
    ref.current.rotation.y += 0.005;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    if (mouse.current) {
      ref.current.rotation.x += mouse.current.y * 0.005;
      ref.current.rotation.y += mouse.current.x * 0.005;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />
      <meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function Particles({ count = 80, mouse }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
    }
    return pos;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    if (mouse.current) ref.current.rotation.x += mouse.current.y * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#22d3ee" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function SimpleGlow() {
  return (
    <mesh position={[0, 0, -1]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.04} />
    </mesh>
  );
}

export default function AbstractScene({ mouse, isLowEnd }) {
  if (isLowEnd) {
    return (
      <>
        <TorusKnot mouse={mouse} />
        <SimpleGlow />
      </>
    );
  }

  return (
    <>
      <TorusKnot mouse={mouse} />
      <FloatingCube position={[-1.5, 0.8, -1]} color="#22d3ee" speed={0.8} mouse={mouse} />
      <FloatingCube position={[1.8, -0.5, -1.5]} color="#8b5cf6" speed={1.2} size={0.25} mouse={mouse} />
      <FloatingSphere position={[-1.2, -1, -2]} color="#f472b6" speed={0.6} mouse={mouse} />
      <FloatingSphere position={[1.5, 1.2, -2]} color="#22d3ee" speed={0.9} size={0.15} mouse={mouse} />
      <Particles count={80} mouse={mouse} />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={5} blur={2} />
    </>
  );
}
