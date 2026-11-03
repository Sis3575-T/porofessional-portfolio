import { ContactShadows } from "@react-three/drei";
import { PlatformPedestal } from "./PlatformPedestal";
import { DeveloperDesk } from "./DeveloperDesk";
import { ErgonomicChair } from "./ErgonomicChair";
import { MonitorAndScreens } from "./MonitorAndScreens";
import { WorkstationPC } from "./WorkstationPC";
import { DeskAccessories } from "./DeskAccessories";
import { PlatformAccessories } from "./PlatformAccessories";
import { FloatingBadges } from "./FloatingBadges";
import { FloatingOrnaments } from "./FloatingOrnaments";
import { WorkspaceLighting } from "./WorkspaceLighting";

/**
 * DeveloperWorkspaceScene
 * The complete 360° interactive 3D developer workspace.
 * Precision-framed so the entire workspace occupies 90-95% of the visual container.
 * Zero personal photos, zero human characters, zero national flags.
 */
export function DeveloperWorkspaceScene() {
  return (
    <group position={[0, -0.62, 0]}>
      <WorkspaceLighting />
      <PlatformPedestal />
      <DeveloperDesk />
      <ErgonomicChair />
      <MonitorAndScreens />
      <WorkstationPC />
      <DeskAccessories />
      <PlatformAccessories />
      <FloatingBadges />
      <FloatingOrnaments />

      {/* Grounding contact shadow underneath circular platform */}
      <ContactShadows
        position={[0, -0.06, 0]}
        opacity={0.42}
        scale={4.2}
        blur={2.2}
        far={2.0}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}

export default DeveloperWorkspaceScene;
