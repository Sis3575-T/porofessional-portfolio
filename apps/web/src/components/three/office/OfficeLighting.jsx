export default function OfficeLighting({ config = {} }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity ?? 0.12} color="#fff5e6" />

      <directionalLight
        position={[4, 6, 3]}
        intensity={config.directionalIntensity ?? 0.6}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={config.shadowQuality === "high" ? 2048 : 1024}
        shadow-mapSize-height={config.shadowQuality === "high" ? 2048 : 1024}
        shadow-camera-far={10}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.001}
      />

      <directionalLight
        position={[-3, 4, -1]}
        intensity={0.08}
        color="#fff8f0"
      />

      <pointLight
        position={[-0.8, 0.85, -0.3]}
        intensity={0.35}
        color="#ffd595"
        distance={2}
        decay={2}
      />

      <pointLight
        position={[0, 2.8, -1.5]}
        intensity={0.15}
        color="#fff8f0"
        distance={4}
        decay={2}
      />

      <hemisphereLight args={["#fff8f0", "#8a7a6a", 0.1]} />
    </>
  );
}
