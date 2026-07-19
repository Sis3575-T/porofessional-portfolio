import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Room from "./Room";
import Desk from "./DeskItems";
import FloatingPhoto from "./FloatingPhoto";
import Laptop from "./Laptop";
import Chair from "./Chair";
import FloatingTechIcons from "./FloatingTechIcons";
import Particles from "./Particles";
import OfficeLighting from "./OfficeLighting";

export default function OfficeScene({ profileImage, config = {} }) {
  const sceneRef = useRef();

  return (
    <group ref={sceneRef}>
      <Room config={config} />
      <Desk config={config} />
      <FloatingPhoto imageUrl={profileImage} />
      <Laptop />
      <Chair config={config} />
      <FloatingTechIcons config={config} />
      <Particles config={config} />
      <OfficeLighting config={config} />
    </group>
  );
}
