export default function OfficeLighting({ config = {} }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity ?? 0.2} color="#8899cc" />

      <directionalLight
        position={[3, 5, 2]}
        intensity={config.directionalIntensity ?? 0.6}
        color="#ddeeff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={8}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />

      <pointLight position={[-0.5, 0.9, -0.6]} intensity={config.accentIntensity ?? 0.25} color="#22d3ee" distance={2} />
      <pointLight position={[1.5, 0.3, 0.5]} intensity={0.1} color="#ff8844" distance={1.5} />

      <hemisphereLight args={["#4466aa", "#111122", 0.1]} />
    </>
  );
}
