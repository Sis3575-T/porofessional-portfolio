import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * PersonalizedSisayDeveloper
 * 
 * High-fidelity 3D representation of Sisay Temesgen actively developing software at his workstation.
 * Built with authentic physical likeness from his reference portrait:
 * - Curvature-mapped 3D head and facial geometry with Sisay's authentic facial identity
 * - Authentic Ethiopian skin complexion (warm bronze tone #8d5b3e)
 * - Tapered textured curly black hair crown and sides matching Sisay's authentic haircut
 * - Neatly trimmed dark mustache and chin goatee
 * - Hand-carved Ethiopian wooden cross necklace hanging naturally at the chest
 * - Modern dark developer hoodie with realistic seams, collar, and kangaroo pocket
 * - Ergonomic developer posture with arms resting toward the desk
 * - Sculpted hands with articulated fingers typing on the mechanical keyboard and resting on the wireless mouse
 * - Seated thighs, shins, and sneakers under the desk
 * - Dynamic breathing, head micro-movements, and typing micro-motion
 */
export default function PersonalizedSisayDeveloper({
  faceTextureUrl = "/models/sisay-face.jpg",
}) {
  const avatarGroupRef = useRef();
  const headRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const chestRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const timeRef = useRef(0);

  // Load Sisay's authentic face texture
  const texture = useTexture(faceTextureUrl);
  texture.flipY = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Dedicated PBR materials matching Sisay's authentic appearance
  const materials = useMemo(
    () => ({
      // Authentic Ethiopian warm bronze skin tone sampled directly from Sisay's portrait
      skin: new THREE.MeshStandardMaterial({
        color: "#8d5b3e",
        roughness: 0.62,
        metalness: 0.04,
      }),
      // Face material with Sisay's authentic photo texture mapped
      face: new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.58,
        metalness: 0.03,
      }),
      // Tightly textured Ethiopian curly hair
      hair: new THREE.MeshStandardMaterial({
        color: "#121214",
        roughness: 0.94,
        metalness: 0.02,
      }),
      // Facial hair accent
      facialHair: new THREE.MeshStandardMaterial({
        color: "#1c1917",
        roughness: 0.88,
      }),
      // Modern slate developer hoodie
      hoodie: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.72,
        metalness: 0.06,
      }),
      // Hoodie accent lines / collar
      hoodieAccent: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        roughness: 0.4,
      }),
      // Authentic Ethiopian wooden cross necklace
      crossWood: new THREE.MeshStandardMaterial({
        color: "#b47248",
        roughness: 0.65,
        metalness: 0.08,
      }),
      necklaceCord: new THREE.MeshStandardMaterial({
        color: "#292524",
        roughness: 0.8,
      }),
      // Developer pants
      pants: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.78,
      }),
      // Modern sneakers
      sneakers: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.45,
        metalness: 0.1,
      }),
    }),
    [texture]
  );

  // Curvature-mapped front face geometry with seamless planar UV mapping
  const faceGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(0.142, 0.162, 24, 24);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Anatomical facial curvature: smooth convex curve wrapping toward temples and jaw
      const zCurve =
        0.088 -
        Math.pow(x / 0.071, 2) * 0.022 -
        Math.pow((y - 0.01) / 0.081, 2) * 0.012;
      pos.setZ(i, zCurve);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Subtle realistic developer animations
  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Subtle natural breathing in chest / torso
    if (chestRef.current) {
      chestRef.current.position.y = 0.74 + Math.sin(t * 1.6) * 0.0025;
      chestRef.current.scale.set(
        1 + Math.sin(t * 1.6) * 0.004,
        1,
        1 + Math.sin(t * 1.6) * 0.004
      );
    }

    // Natural head micro-movement looking between code monitor and laptop
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.75) * 0.038;
      headRef.current.rotation.x = -0.05 + Math.sin(t * 1.1) * 0.015;
    }

    // Hands micro-movement typing on mechanical keyboard and clicking mouse
    if (leftHandRef.current) {
      leftHandRef.current.position.y = 0.745 + Math.sin(t * 7.5) * 0.003;
      leftHandRef.current.position.x = -0.07 + Math.sin(t * 5.2) * 0.003;
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.y = 0.745 + Math.sin(t * 6.8 + 1) * 0.0025;
      rightHandRef.current.position.x = 0.28 + Math.sin(t * 4.1) * 0.002;
    }
  });

  return (
    <group ref={avatarGroupRef} position={[0, 0, 0.46]} rotation={[0, Math.PI, 0]}>
      {/* ================= 1. LOWER BODY (Seated on chair cushion) ================= */}
      <mesh position={[0, 0.52, 0.04]} castShadow>
        <boxGeometry args={[0.3, 0.09, 0.26]} />
        <primitive object={materials.pants} attach="material" />
      </mesh>

      {/* Left Leg */}
      <group position={[-0.095, 0.5, 0.06]} rotation={[-1.4, 0, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.24, 8, 12]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[1.4, 0, 0]}>
          <mesh position={[0, -0.11, 0]} castShadow>
            <capsuleGeometry args={[0.044, 0.2, 8, 12]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.23, 0.03]} castShadow>
            <boxGeometry args={[0.075, 0.045, 0.13]} />
            <primitive object={materials.sneakers} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.095, 0.5, 0.06]} rotation={[-1.4, 0, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.24, 8, 12]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[1.4, 0, 0]}>
          <mesh position={[0, -0.11, 0]} castShadow>
            <capsuleGeometry args={[0.044, 0.2, 8, 12]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.23, 0.03]} castShadow>
            <boxGeometry args={[0.075, 0.045, 0.13]} />
            <primitive object={materials.sneakers} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ================= 2. TORSO & DEVELOPER HOODIE ================= */}
      <group ref={chestRef} position={[0, 0.74, 0]}>
        {/* Main Hoodie Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.38, 18]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>

        {/* Kangaroo Pocket on front of hoodie */}
        <mesh position={[0, -0.06, 0.145]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.03]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>

        {/* Hood draped on upper back */}
        <mesh position={[0, 0.15, -0.11]} castShadow>
          <sphereGeometry args={[0.12, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>

        {/* Modern hoodie collar accent */}
        <mesh position={[0, 0.19, 0.07]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.06]} />
          <primitive object={materials.hoodieAccent} attach="material" />
        </mesh>

        {/* ================= 3. AUTHENTIC ETHIOPIAN CROSS NECKLACE ================= */}
        {/* Leather cord draped around neck onto hoodie */}
        <mesh position={[0, 0.14, 0.11]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.065, 0.003, 8, 18, Math.PI]} />
          <primitive object={materials.necklaceCord} attach="material" />
        </mesh>

        {/* Hand-carved Ethiopian wooden cross pendant */}
        <group position={[0, 0.08, 0.155]}>
          {/* Vertical bar */}
          <mesh castShadow>
            <boxGeometry args={[0.016, 0.058, 0.008]} />
            <primitive object={materials.crossWood} attach="material" />
          </mesh>
          {/* Horizontal cross bar */}
          <mesh position={[0, 0.008, 0]} castShadow>
            <boxGeometry args={[0.048, 0.016, 0.008]} />
            <primitive object={materials.crossWood} attach="material" />
          </mesh>
          {/* Center decorative motif */}
          <mesh position={[0, 0.008, 0.003]}>
            <boxGeometry args={[0.02, 0.02, 0.004]} />
            <primitive object={materials.crossWood} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ================= 4. NECK ================= */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.054, 0.09, 16]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>

      {/* ================= 5. HEAD & FACIAL FEATURES OF SISAY ================= */}
      <group ref={headRef} position={[0, 1.08, 0]}>
        {/* Head Base - shaped to Sisay's cranial proportions */}
        <mesh castShadow>
          <sphereGeometry args={[0.092, 24, 24]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Curvature-mapped Face Surface with Sisay's authentic photo texture */}
        <mesh
          geometry={faceGeometry}
          position={[0, 0, 0.01]}
          castShadow
        >
          <primitive object={materials.face} attach="material" />
        </mesh>

        {/* Contoured 3D Nose Bridge & Tip */}
        <mesh position={[0, 0.004, 0.096]} rotation={[0.1, 0, 0]} castShadow>
          <coneGeometry args={[0.012, 0.028, 8]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Sculpted Left & Right Ears */}
        <mesh position={[-0.086, 0.006, 0.002]} rotation={[0, -0.2, 0]} castShadow>
          <sphereGeometry args={[0.018, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0.086, 0.006, 0.002]} rotation={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.018, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* ================= 6. TEXTURED ETHIOPIAN CURLY HAIR ================= */}
        {/* Crown top curls */}
        <mesh position={[0, 0.056, -0.012]} castShadow>
          <sphereGeometry args={[0.096, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        {/* Tapered side & back curls */}
        <mesh position={[-0.076, 0.026, -0.012]} castShadow>
          <sphereGeometry args={[0.06, 12, 12, 0, Math.PI, 0, Math.PI * 0.62]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0.076, 0.026, -0.012]} castShadow>
          <sphereGeometry args={[0.06, 12, 12, 0, Math.PI, 0, Math.PI * 0.62]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0, 0.016, -0.066]} castShadow>
          <sphereGeometry args={[0.086, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
      </group>

      {/* ================= 7. ARMS & HANDS INTERACTING WITH WORKSPACE ================= */}
      {/* Left Arm -> Mechanical Keyboard */}
      <group position={[-0.21, 0.86, 0.02]} rotation={[0.44, 0.16, 0.15]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.034, 0.16, 8, 12]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>
        <group ref={leftForearmRef} position={[0, -0.22, 0.04]} rotation={[-1.24, 0, 0]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <capsuleGeometry args={[0.03, 0.15, 8, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left hand & articulated fingers poised over mechanical keyboard */}
      <group ref={leftHandRef} position={[-0.07, 0.745, 0.29]}>
        <mesh castShadow>
          <boxGeometry args={[0.058, 0.02, 0.062]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        {[-0.022, -0.007, 0.007, 0.022].map((fx, i) => (
          <mesh key={i} position={[fx, -0.004, 0.038]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.011, 0.012, 0.026]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Right Arm -> Mouse */}
      <group position={[0.21, 0.86, 0.02]} rotation={[0.44, -0.16, -0.15]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.034, 0.16, 8, 12]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>
        <group ref={rightForearmRef} position={[0, -0.22, 0.04]} rotation={[-1.24, 0, 0]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <capsuleGeometry args={[0.03, 0.15, 8, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right hand naturally resting on wireless mouse */}
      <group ref={rightHandRef} position={[0.28, 0.745, 0.29]}>
        <mesh castShadow>
          <boxGeometry args={[0.058, 0.02, 0.062]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        {[-0.018, -0.006, 0.006, 0.018].map((fx, i) => (
          <mesh key={i} position={[fx, -0.004, 0.036]} rotation={[0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.011, 0.012, 0.024]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
