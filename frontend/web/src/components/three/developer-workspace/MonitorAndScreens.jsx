import { useMemo } from "react";
import * as THREE from "three";
import { createMainCodeTexture, createLaptopScreenTexture } from "./textureGenerators";

/**
 * MonitorAndScreens
 * Large central developer display showing syntax-highlighted code editor,
 * plus MacBook laptop on the right showing the live build terminal.
 */
export function MonitorAndScreens() {
  const codeTexture = useMemo(() => createMainCodeTexture(1024, 640), []);
  const laptopTexture = useMemo(() => createLaptopScreenTexture(640, 400), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Large Central Main Monitor */}
      <group position={[-0.05, 1.05, -0.28]}>
        {/* Outer Slim Bezel & Chassis */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.82, 0.49, 0.024]} />
          <meshStandardMaterial
            color="#090D14"
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Display Screen Panel with VS Code Editor */}
        <mesh position={[0, 0, 0.013]}>
          <planeGeometry args={[0.79, 0.46]} />
          <meshStandardMaterial
            map={codeTexture}
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
            emissiveMap={codeTexture}
            roughness={0.1}
          />
        </mesh>

        {/* Chin Logo Accent Bar */}
        <mesh position={[0, -0.236, 0.013]}>
          <planeGeometry args={[0.06, 0.008]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        {/* Monitor Stand Vertical Column */}
        <mesh position={[0, -0.28, -0.03]} castShadow>
          <boxGeometry args={[0.05, 0.22, 0.035]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Monitor Stand Base on Desk */}
        <mesh position={[0, -0.375, 0.02]} castShadow>
          <boxGeometry args={[0.24, 0.012, 0.18]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Screen Ambient Light Cast onto Desk & Keyboard */}
        <pointLight
          position={[0, 0, 0.2]}
          intensity={0.42}
          color="#93C5FD"
          distance={1.4}
          decay={2}
        />
        {/* Subtle Rear Bias Backlight */}
        <pointLight
          position={[0, 0, -0.1]}
          intensity={0.25}
          color="#38BDF8"
          distance={1.0}
          decay={2}
        />
      </group>

      {/* 2. MacBook Pro / Laptop on Right Desk */}
      <group position={[0.54, 0.75, -0.06]} rotation={[0, -0.38, 0]}>
        {/* Aluminum Laptop Bottom Base */}
        <mesh position={[0, 0.006, 0]} castShadow>
          <boxGeometry args={[0.33, 0.012, 0.22]} />
          <meshStandardMaterial
            color="#CBD5E1"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Keyboard Well & Chiclet Keys */}
        <mesh position={[0, 0.013, -0.015]}>
          <boxGeometry args={[0.29, 0.003, 0.12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.013, 0.07]}>
          <boxGeometry args={[0.09, 0.002, 0.055]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* Laptop Screen Lid (Angled at 115 degrees) */}
        <group position={[0, 0.012, -0.11]} rotation={[-0.38, 0, 0]}>
          {/* Back Lid (Silver Aluminum) */}
          <mesh position={[0, 0, -0.004]} castShadow>
            <boxGeometry args={[0.33, 0.22, 0.008]} />
            <meshStandardMaterial
              color="#CBD5E1"
              roughness={0.25}
              metalness={0.8}
            />
          </mesh>

          {/* Screen Display Panel */}
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[0.31, 0.20]} />
            <meshStandardMaterial
              map={laptopTexture}
              emissive="#FFFFFF"
              emissiveIntensity={0.45}
              emissiveMap={laptopTexture}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
