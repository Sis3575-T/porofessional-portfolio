import { useTheme } from "../../../context/ThemeContext";

/**
 * WorkspaceLighting
 * Professional studio lighting adapted for both light and dark themes.
 */
export function WorkspaceLighting() {
  const { dark } = useTheme();

  return (
    <>
      {/* Ambient Fill Light */}
      <ambientLight
        intensity={dark ? 0.75 : 0.85}
        color={dark ? "#E2E8F0" : "#FFFFFF"}
      />

      {/* Main Key Sun Light (Warm White with Soft Shadows) */}
      <directionalLight
        position={[3.0, 4.8, 2.5]}
        intensity={dark ? 1.0 : 1.1}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={12}
        shadow-camera-left={-2.8}
        shadow-camera-right={2.8}
        shadow-camera-top={2.8}
        shadow-camera-bottom={-2.8}
        shadow-bias={-0.0004}
      />

      {/* Cool Cyan Accent Fill Light */}
      <directionalLight
        position={[-3.2, 3.2, 2.0]}
        intensity={0.55}
        color="#38BDF8"
      />

      {/* Rear Rim Backlight (Highlighting Chair & Screen Silhouettes) */}
      <directionalLight
        position={[0, 3.6, -3.2]}
        intensity={0.45}
        color="#818CF8"
      />

      {/* Subtle Under-Platform Uplight */}
      <pointLight
        position={[0, 0.3, 0]}
        intensity={0.25}
        color="#38BDF8"
        distance={2.5}
        decay={2}
      />
    </>
  );
}
