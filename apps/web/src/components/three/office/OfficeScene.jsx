import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Room from "./Room";
import Desk from "./DeskItems";
import FloatingPhoto from "./FloatingPhoto";
import Laptop from "./Laptop";
import Monitor from "./Monitor";
import Chair from "./Chair";
import Person from "./Person";
import OfficeLighting from "./OfficeLighting";

export default function OfficeScene({ profileImage, config = {}, mouse = { current: { x: 0, y: 0 } } }) {
  const groupRef = useRef();
  const chairRef = useRef();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.05;
    const base = Math.sin(t) * 0.012;
    const pointerX = mouse?.current?.x ?? 0;
    const pointerY = mouse?.current?.y ?? 0;

    targetX.current = THREE.MathUtils.lerp(targetX.current, pointerX * 0.18, 0.08);
    targetY.current = THREE.MathUtils.lerp(targetY.current, pointerY * 0.08, 0.08);

    groupRef.current.rotation.y = base + targetX.current;
    groupRef.current.rotation.x = targetY.current;

    if (chairRef.current) {
      chairRef.current.rotation.y = targetX.current * 1.3;
      chairRef.current.rotation.x = THREE.MathUtils.lerp(chairRef.current.rotation.x, targetY.current * 0.2, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <Room config={config} />
      <Desk config={config} />
      <Monitor imageUrl={profileImage} />
      <Laptop />
      <group ref={chairRef}>
        <Chair config={config} />
      </group>
      <Person typingSpeed={config.typingSpeed ?? 2} breathingSpeed={config.breathingSpeed ?? 0.8} />
      <FloatingPhoto imageUrl={config.profileImagePlacement === 'floating' ? profileImage : null} />
      <OfficeLighting config={config} />
    </group>
  );
}
