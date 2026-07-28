import { Suspense } from "react";
import Room from "./Room";
import Desk from "./DeskItems";
import Laptop from "./Laptop";
import Monitor from "./Monitor";
import Chair from "./Chair";
import OfficeLighting from "./OfficeLighting";

export default function OfficeScene({ profileImage, config = {} }) {
  return (
    <group>
      <Room config={config} />
      <Desk config={config} />
      <Monitor />
      <Laptop />
      <Chair config={config} />
      <OfficeLighting config={config} />
    </group>
  );
}
