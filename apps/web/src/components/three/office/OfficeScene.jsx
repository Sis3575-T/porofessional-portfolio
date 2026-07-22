import { Suspense } from "react";
import Room from "./Room";
import Desk from "./DeskItems";
import FloatingPhoto from "./FloatingPhoto";
import Laptop from "./Laptop";
import Monitor from "./Monitor";
import Chair from "./Chair";
import OfficeLighting from "./OfficeLighting";
import AvatarPlane from "./AvatarPlane";
import Avatar3D from "./Avatar3D";

export default function OfficeScene({ profileImage, config = {} }) {
  return (
    <group>
      <Room config={config} />
      <Desk config={config} />
      <Monitor />
      <Laptop />
      <Chair config={config} />
      <Suspense fallback={null}>
        <Avatar3D />
      </Suspense>
      <AvatarPlane />
      <FloatingPhoto imageUrl={config.profileImagePlacement === 'floating' ? profileImage : null} />
      <OfficeLighting config={config} />
    </group>
  );
}
