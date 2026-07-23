export default function OfficeLighting({ config = {} }) {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={config.ambientIntensity ?? 0.35} color="#f5f0e8" />

      {/* Main daylight from window - soft and warm */}
      <directionalLight
        position={[-2, 4, -3]}
        intensity={config.directionalIntensity ?? 0.9}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={config.shadowQuality === "high" ? 2048 : 1024}
        shadow-mapSize-height={config.shadowQuality === "high" ? 2048 : 1024}
        shadow-camera-far={12}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />

      {/* Secondary fill from right */}
      <directionalLight
        position={[3, 3, 1]}
        intensity={0.3}
        color="#ffffff"
      />

      {/* Key light for face - from front-right */}
      <pointLight
        position={[0.5, 1.6, 0.5]}
        intensity={0.5}
        color="#fff5e8"
        distance={4}
        decay={2}
      />

      {/* Monitor screen glow */}
      <pointLight
        position={[0, 1.1, -0.25]}
        intensity={0.15}
        color="#e8f0ff"
        distance={2}
        decay={2}
      />

      {/* Overhead room light */}
      <pointLight
        position={[0, 2.8, 0]}
        intensity={0.25}
        color="#fff8f0"
        distance={6}
        decay={2}
      />

      {/* Window light spill */}
      <spotLight
        position={[0, 2.5, -2]}
        target-position={[0, 0.5, 1]}
        angle={0.6}
        penumbra={0.8}
        intensity={0.3}
        color="#fffaf0"
        distance={6}
        decay={2}
      />

      {/* Hemisphere for natural sky/ground */}
      <hemisphereLight args={["#e8f0ff", "#8b7355", 0.2]} />
    </>
  );
}
