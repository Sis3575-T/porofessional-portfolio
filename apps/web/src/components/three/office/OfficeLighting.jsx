export default function OfficeLighting({ config = {} }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity ?? 0.4} color="#ffffff" />

      <directionalLight
        position={[4, 6, 3]}
        intensity={config.directionalIntensity ?? 1.2}
        color="#ffffff"
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
        intensity={0.5}
        color="#ffffff"
      />

      <pointLight
        position={[-0.8, 0.85, -0.3]}
        intensity={0.6}
        color="#ffffff"
        distance={3}
        decay={2}
      />

      <pointLight
        position={[0, 2.8, -1.5]}
        intensity={0.4}
        color="#ffffff"
        distance={5}
        decay={2}
      />

      <hemisphereLight args={["#ffffff", "#aaaaaa", 0.3]} />
    </>
  );
}
