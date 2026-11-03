import * as THREE from "three";

/**
 * WorkstationPC
 * High-performance developer desktop tower case sitting on the left platform.
 * Features tempered glass side panel, 3 glowing cyan/blue LED intake fans,
 * GPU / motherboard internal details, and subtle ambient internal glow.
 */
export function WorkstationPC() {
  return (
    <group position={[-0.62, 0.28, 0.24]} rotation={[0, 0.15, 0]}>
      {/* 1. Main Matte Black Metal Tower Chassis */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.44, 0.46]} />
        <meshStandardMaterial
          color="#0B0F17"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Right Side Tempered Glass Panel */}
      <mesh position={[0.111, 0, 0]}>
        <planeGeometry args={[0.44, 0.42]} />
        <meshPhysicalMaterial
          color="#1E293B"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          ior={1.5}
        />
      </mesh>

      {/* 3. Three Glowing Cyan/Blue LED Fans on Front */}
      {[-0.12, 0.0, 0.12].map((yPos, idx) => (
        <group key={idx} position={[0, yPos, 0.231]}>
          {/* Fan Circular Rim Frame */}
          <mesh>
            <cylinderGeometry args={[0.048, 0.048, 0.008, 24]} />
            <meshStandardMaterial color="#090D14" roughness={0.4} />
          </mesh>

          {/* Glowing LED Halo Ring */}
          <mesh position={[0, 0, 0.005]}>
            <torusGeometry args={[0.044, 0.004, 12, 24]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#38BDF8"
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>

          {/* Fan Blades Hub */}
          <mesh position={[0, 0, 0.004]}>
            <cylinderGeometry args={[0.016, 0.016, 0.006, 12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 4. Internal Components Visible Through Glass */}
      <group position={[0.02, 0, 0]}>
        {/* GPU Graphics Card with Blue Accent Strip */}
        <mesh position={[0, -0.04, -0.02]} castShadow>
          <boxGeometry args={[0.07, 0.035, 0.28]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0.036, -0.04, -0.02]}>
          <boxGeometry args={[0.002, 0.01, 0.24]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* CPU Liquid Cooler Block */}
        <mesh position={[-0.04, 0.08, -0.05]}>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 16]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#246BFD"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Internal Glow Light */}
        <pointLight
          position={[0.05, 0, 0]}
          intensity={0.45}
          color="#38BDF8"
          distance={0.8}
          decay={2}
        />
      </group>

      {/* Top Power Button & Front I/O */}
      <mesh position={[0, 0.221, 0.18]}>
        <cylinderGeometry args={[0.008, 0.008, 0.003, 12]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}
