import { useMemo } from "react";
import * as THREE from "three";
import { createBookSpineTexture, createBackpackCodeBadge } from "./textureGenerators";

/**
 * PlatformAccessories
 * Objects placed directly on the circular platform floor:
 * - Developer backpack with </> emblem (right side)
 * - Stack of 4 tech books: React, Node.js, Python, PostgreSQL (left side)
 * - Indoor leafy potted plant (left side)
 */
export function PlatformAccessories() {
  const reactTexture = useMemo(() => createBookSpineTexture("React", "#61DAFB"), []);
  const nodeTexture = useMemo(() => createBookSpineTexture("Node.js", "#22C55E"), []);
  const pythonTexture = useMemo(() => createBookSpineTexture("Python", "#EAB308"), []);
  const postgresTexture = useMemo(() => createBookSpineTexture("PostgreSQL", "#3B82F6"), []);
  const backpackBadge = useMemo(() => createBackpackCodeBadge(256, 256), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Developer Backpack */}
      <group position={[0.54, 0.20, 0.36]} rotation={[0, -0.22, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.36, 0.16]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        <mesh position={[0, -0.04, 0.085]} castShadow>
          <boxGeometry args={[0.20, 0.20, 0.04]} />
          <meshStandardMaterial color="#1E293B" roughness={0.65} />
        </mesh>

        <mesh position={[0, -0.04, 0.108]}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshStandardMaterial
            map={backpackBadge}
            transparent
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, 0.19, 0]}>
          <torusGeometry args={[0.038, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#090D14" roughness={0.6} />
        </mesh>

        {[-0.06, 0.06].map((x, i) => (
          <mesh key={i} position={[x, 0.02, -0.085]}>
            <boxGeometry args={[0.04, 0.30, 0.015]} />
            <meshStandardMaterial color="#090D14" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 2. Stack of 4 Technology Books on Left Platform (Spine visible from front and back) */}
      <group position={[-0.78, 0.06, 0.12]} rotation={[0, 0.12, 0]}>
        {/* Helper for a book with front and rear readable title */}
        {[
          { y: 0.02, rot: 0, tex: postgresTexture },
          { y: 0.06, rot: -0.03, tex: pythonTexture },
          { y: 0.10, rot: 0.04, tex: nodeTexture },
          { y: 0.14, rot: -0.02, tex: reactTexture },
        ].map((book, idx) => (
          <group key={idx} position={[0, book.y, 0]} rotation={[0, book.rot, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.32, 0.038, 0.22]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            {/* Front Spine Face */}
            <mesh position={[0, 0, 0.111]}>
              <planeGeometry args={[0.32, 0.038]} />
              <meshStandardMaterial map={book.tex} roughness={0.3} />
            </mesh>
            {/* Rear Spine Face (for 360° rotation) */}
            <mesh position={[0, 0, -0.111]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.32, 0.038]} />
              <meshStandardMaterial map={book.tex} roughness={0.3} />
            </mesh>
            {/* Pages Edge */}
            <mesh position={[0.159, 0, 0]}>
              <planeGeometry args={[0.21, 0.034]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Indoor Leafy Potted Plant on Left Platform */}
      <group position={[-0.92, 0.06, -0.16]}>
        <mesh position={[0, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.10, 0.075, 0.16, 20]} />
          <meshStandardMaterial color="#D97706" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.17, 0]} castShadow>
          <cylinderGeometry args={[0.108, 0.108, 0.018, 20]} />
          <meshStandardMaterial color="#B45309" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.165, 0]}>
          <circleGeometry args={[0.095, 16]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <group
              key={idx}
              position={[Math.sin(rad) * 0.045, 0.20, Math.cos(rad) * 0.045]}
              rotation={[0.35 * Math.cos(rad), rad, 0.35 * Math.sin(rad)]}
            >
              <mesh position={[0, 0.05, 0.035]}>
                <cylinderGeometry args={[0.0035, 0.0045, 0.11, 6]} />
                <meshStandardMaterial color="#15803D" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.11, 0.07]} rotation={[0.4, 0, 0]} castShadow>
                <sphereGeometry args={[0.04, 12, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? "#16A34A" : "#22C55E"}
                  roughness={0.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
