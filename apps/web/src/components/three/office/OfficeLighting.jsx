export default function OfficeLighting({ config = {} }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity ?? 0.15} color="#6688aa" />

      <directionalLight
        position={[4, 6, 3]}
        intensity={config.directionalIntensity ?? 0.5}
        color="#ddeeff"
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
        position={[-2, 3, -1]}
        intensity={0.15}
        color="#4466aa"
      />

      <pointLight
        position={[-0.8, 0.85, -0.3]}
        intensity={config.accentIntensity ?? 0.2}
        color="#22d3ee"
        distance={2.5}
        decay={2}
      />

      <pointLight
        position={[0, 0.3, -0.1]}
        intensity={0.08}
        color="#88ddff"
        distance={1}
        decay={2}
      />

      <pointLight
        position={[1.2, 0.3, 0.5]}
        intensity={0.06}
        color="#ff8844"
        distance={1.5}
        decay={2}
      />

      <hemisphereLight args={["#4466aa", "#111122", 0.08]} />

      <rectAreaLight
        position={[0, 2.8, -2.2]}
        width={2}
        height={1.5}
        intensity={0.08}
        color="#88bbff"
        rotation={[0.3, 0, 0]}
      />
    </>
  );
}
