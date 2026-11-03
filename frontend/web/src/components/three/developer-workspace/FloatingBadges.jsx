import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createIdentityPanelTexture,
  createEducationPanelTexture,
  createSkillsPanelTexture,
  createGoalsPanelTexture,
} from "./textureGenerators";

/**
 * 3D Rounded Double-Sided Panel Card
 * Fully visible and readable from both front and reverse viewing angles during 360° rotation!
 */
function FloatingCard({ position, rotation = [0, 0, 0], args = [0.8, 0.4], texture, bobPhase = 0 }) {
  const cardRef = useRef();

  useFrame((state) => {
    if (!cardRef.current) return;
    const t = state.clock.getElapsedTime();
    cardRef.current.position.y = position[1] + Math.sin(t * 1.2 + bobPhase) * 0.012;
  });

  const [w, h] = args;
  const depth = 0.016;

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      {/* 3D Card Backplate (Clean white rounded box) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, depth]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.15}
          metalness={0.05}
        />
      </mesh>

      {/* Front Face with Crisp High-Res Information Texture */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[w * 0.98, h * 0.96]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.2}
        />
      </mesh>

      {/* Back Face (Readable from reverse angles when rotated 360 degrees) */}
      <mesh position={[0, 0, -depth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w * 0.98, h * 0.96]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/**
 * FloatingBadges
 * All 4 professional floating 3D information cards arranged compactly around the workspace.
 * Every panel remains inside the camera framing throughout 360-degree rotation.
 */
export function FloatingBadges() {
  const identityTexture = useMemo(() => createIdentityPanelTexture(800, 260), []);
  const educationTexture = useMemo(() => createEducationPanelTexture(640, 440), []);
  const skillsTexture = useMemo(() => createSkillsPanelTexture(680, 500), []);
  const goalsTexture = useMemo(() => createGoalsPanelTexture(640, 420), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Top Center: Sisay Temesgen - Full Stack Developer & AI Learner */}
      <FloatingCard
        position={[0, 1.48, -0.22]}
        rotation={[0.04, 0, 0]}
        args={[0.88, 0.30]}
        texture={identityTexture}
        bobPhase={0}
      />

      {/* 2. Upper Left: Education - Bahir Dar University */}
      <FloatingCard
        position={[-0.92, 1.05, -0.15]}
        rotation={[0.02, 0.22, 0]}
        args={[0.66, 0.44]}
        texture={educationTexture}
        bobPhase={1.5}
      />

      {/* 3. Upper Right: Skills Matrix */}
      <FloatingCard
        position={[0.92, 1.02, -0.18]}
        rotation={[0.02, -0.22, 0]}
        args={[0.70, 0.48]}
        texture={skillsTexture}
        bobPhase={2.8}
      />

      {/* 4. Lower Right: My Goals */}
      <FloatingCard
        position={[0.88, 0.46, 0.12]}
        rotation={[-0.02, -0.25, 0]}
        args={[0.64, 0.40]}
        texture={goalsTexture}
        bobPhase={4.2}
      />
    </group>
  );
}
