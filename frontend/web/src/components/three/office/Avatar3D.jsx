import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CHAIR_POSITION = [0, 0, 0.55];
const CHAIR_ROTATION = [0, -0.15, 0];
const BODY_ANGLE = -0.44;
const HEAD_TURN = 0.18;

export default function Avatar3D() {
  const groupRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const timeRef = useRef(0);

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.75, metalness: 0.02 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.05 }),
      shirt: new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.65, metalness: 0.05 }),
      pants: new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.7, metalness: 0.03 }),
      shoes: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.15 }),
      collar: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
    }),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    if (bodyRef.current) {
      bodyRef.current.rotation.y = BODY_ANGLE + Math.sin(t * 0.4) * 0.008;
      bodyRef.current.rotation.x = Math.sin(t * 0.6) * 0.005;
    }
    if (headRef.current) {
      headRef.current.rotation.y = HEAD_TURN + Math.sin(t * 0.3) * 0.04;
      headRef.current.rotation.x = -0.05 + Math.sin(t * 0.25) * 0.02;
      headRef.current.rotation.z = Math.sin(t * 0.2) * 0.01;
    }
    if (leftForearmRef.current) {
      leftForearmRef.current.rotation.x = -1.3 + Math.sin(t * 6) * 0.03;
    }
    if (rightForearmRef.current) {
      rightForearmRef.current.rotation.x = -1.3 + Math.sin(t * 6 + 1) * 0.03;
    }
  });

  const s = 0.95;

  return (
    <group ref={groupRef} position={CHAIR_POSITION} rotation={CHAIR_ROTATION} scale={[s, s, s]}>
      <group ref={bodyRef} position={[0, 0.72, 0]}>
        {/* Pelvis */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.24, 0.1, 0.22]} />
          <meshStandardMaterial {...materials.pants} />
        </mesh>

        {/* Torso */}
        <group position={[0, 0.45, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.42, 16]} />
            <meshStandardMaterial {...materials.shirt} />
          </mesh>
        </group>

        {/* Collar */}
        <mesh position={[0, 0.66, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.06]} />
          <meshStandardMaterial {...materials.collar} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 0.86, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>

          {/* Eyes - white */}
          <mesh position={[-0.035, 0.01, 0.085]}>
            <sphereGeometry args={[0.015, 10, 10]} />
            <meshStandardMaterial color={0xffffff} roughness={0.3} />
          </mesh>
          <mesh position={[0.035, 0.01, 0.085]}>
            <sphereGeometry args={[0.015, 10, 10]} />
            <meshStandardMaterial color={0xffffff} roughness={0.3} />
          </mesh>

          {/* Eyes - iris */}
          <mesh position={[-0.035, 0.01, 0.098]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={0x2c1810} roughness={0.4} />
          </mesh>
          <mesh position={[0.035, 0.01, 0.098]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={0x2c1810} roughness={0.4} />
          </mesh>

          {/* Eyes - pupil */}
          <mesh position={[-0.035, 0.01, 0.103]}>
            <sphereGeometry args={[0.004, 6, 6]} />
            <meshStandardMaterial color={0x000000} roughness={0.2} />
          </mesh>
          <mesh position={[0.035, 0.01, 0.103]}>
            <sphereGeometry args={[0.004, 6, 6]} />
            <meshStandardMaterial color={0x000000} roughness={0.2} />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.035, 0.03, 0.088]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.03, 0.005, 0.005]} />
            <meshStandardMaterial color={0x1a1a1a} roughness={0.9} />
          </mesh>
          <mesh position={[0.035, 0.03, 0.088]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.03, 0.005, 0.005]} />
            <meshStandardMaterial color={0x1a1a1a} roughness={0.9} />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.01, 0.095]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>

          {/* Mouth - smile */}
          <mesh position={[0, -0.035, 0.085]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.03, 0.003, 0.005]} />
            <meshStandardMaterial color={0xc0846a} roughness={0.7} />
          </mesh>

          {/* Hair - top */}
          <mesh position={[0, 0.05, -0.02]} castShadow>
            <sphereGeometry args={[0.095, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial {...materials.hair} />
          </mesh>

          {/* Hair - sides */}
          <mesh position={[-0.08, 0.0, -0.02]} castShadow>
            <sphereGeometry args={[0.06, 12, 12, 0, Math.PI, 0, Math.PI * 0.6]} />
            <meshStandardMaterial {...materials.hair} />
          </mesh>
          <mesh position={[0.08, 0.0, -0.02]} castShadow>
            <sphereGeometry args={[0.06, 12, 12, 0, Math.PI, 0, Math.PI * 0.6]} />
            <meshStandardMaterial {...materials.hair} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.1, -0.01, 0]} castShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>
          <mesh position={[0.1, -0.01, 0]} castShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial {...materials.skin} />
          </mesh>
        </group>

        {/* Left upper arm */}
        <group position={[-0.22, 0.55, 0.02]} rotation={[0.3, 0.15, 0.25]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 6, 12]} />
            <meshStandardMaterial {...materials.shirt} />
          </mesh>
          <group ref={leftForearmRef} position={[0, -0.24, 0.05]} rotation={[-1.3, 0, 0]}>
            <mesh position={[0, -0.08, 0]} castShadow>
              <capsuleGeometry args={[0.03, 0.15, 6, 12]} />
              <meshStandardMaterial {...materials.skin} />
            </mesh>
            <mesh position={[0, -0.18, 0.02]} castShadow>
              <boxGeometry args={[0.05, 0.04, 0.06]} />
              <meshStandardMaterial {...materials.skin} />
            </mesh>
          </group>
        </group>

        {/* Right upper arm */}
        <group position={[0.22, 0.55, 0.02]} rotation={[0.3, -0.15, -0.25]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 6, 12]} />
            <meshStandardMaterial {...materials.shirt} />
          </mesh>
          <group ref={rightForearmRef} position={[0, -0.24, 0.05]} rotation={[-1.3, 0, 0]}>
            <mesh position={[0, -0.08, 0]} castShadow>
              <capsuleGeometry args={[0.03, 0.15, 6, 12]} />
              <meshStandardMaterial {...materials.skin} />
            </mesh>
            <mesh position={[0, -0.18, 0.02]} castShadow>
              <boxGeometry args={[0.05, 0.04, 0.06]} />
              <meshStandardMaterial {...materials.skin} />
            </mesh>
          </group>
        </group>

        {/* Left leg */}
        <group position={[-0.08, 0.08, 0.04]} rotation={[-1.1, 0, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.26, 6, 12]} />
            <meshStandardMaterial {...materials.pants} />
          </mesh>
          <group position={[0, -0.34, 0]} rotation={[1.4, 0, 0]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <capsuleGeometry args={[0.04, 0.2, 6, 12]} />
              <meshStandardMaterial {...materials.pants} />
            </mesh>
            <mesh position={[0, -0.24, 0.02]} castShadow>
              <boxGeometry args={[0.07, 0.035, 0.1]} />
              <meshStandardMaterial {...materials.shoes} />
            </mesh>
          </group>
        </group>

        {/* Right leg */}
        <group position={[0.08, 0.08, 0.04]} rotation={[-1.1, 0, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.26, 6, 12]} />
            <meshStandardMaterial {...materials.pants} />
          </mesh>
          <group position={[0, -0.34, 0]} rotation={[1.4, 0, 0]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <capsuleGeometry args={[0.04, 0.2, 6, 12]} />
              <meshStandardMaterial {...materials.pants} />
            </mesh>
            <mesh position={[0, -0.24, 0.02]} castShadow>
              <boxGeometry args={[0.07, 0.035, 0.1]} />
              <meshStandardMaterial {...materials.shoes} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
