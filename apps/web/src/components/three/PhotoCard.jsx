import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const DEFAULT_CONFIG = {
  rotationSpeed: 0.3,
  floatSpeed: 0.5,
  floatIntensity: 0.3,
  cardWidth: 1.8,
  cardHeight: 2.4,
  cornerRadius: 0.08,
  borderWidth: 0.02,
  borderColor: "#888888",
};

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(url, resolve, undefined, reject);
  });
}

export default function PhotoCard({ imageUrl, config = {}, mouse, isLowEnd }) {
  const groupRef = useRef();
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const [texture, setTexture] = useState(null);
  const [texError, setTexError] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;
    setTexError(false);
    let cancelled = false;
    loadTexture(imageUrl)
      .then((tex) => { if (!cancelled) setTexture(tex); })
      .catch(() => { if (!cancelled) setTexError(true); });
    return () => { cancelled = true; };
  }, [imageUrl]);

  const frameGeo = useMemo(() => {
    const w = cfg.cardWidth + cfg.borderWidth * 2;
    const h = cfg.cardHeight + cfg.borderWidth * 2;
    return new THREE.PlaneGeometry(w, h);
  }, [cfg.cardWidth, cfg.cardHeight, cfg.borderWidth]);

  const photoGeo = useMemo(() => new THREE.PlaneGeometry(cfg.cardWidth - 0.04, cfg.cardHeight - 0.04), [cfg.cardWidth, cfg.cardHeight]);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (mouse.current) {
      groupRef.current.rotation.y += (mouse.current.x * 0.15 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.current.y * 0.1 - groupRef.current.rotation.x) * 0.05;
    }
  });

  if (texError || !texture) {
    return (
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[cfg.cardWidth, cfg.cardHeight]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
    );
  }

  if (isLowEnd) {
    return (
      <group ref={groupRef}>
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[cfg.cardWidth, cfg.cardHeight]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <Float speed={cfg.floatSpeed} floatIntensity={cfg.floatIntensity}>
        <mesh position={[0, 0.5, -0.01]}>
          <primitive object={frameGeo} />
          <meshPhysicalMaterial
            color={cfg.borderColor}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <primitive object={photoGeo} />
          <meshPhysicalMaterial
            map={texture}
            metalness={0.1}
            roughness={0.3}
            envMapIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0.5, -0.02]}>
          <primitive object={frameGeo} />
          <meshPhysicalMaterial
            color={cfg.borderColor}
            metalness={0.6}
            roughness={0.1}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.4}
          scale={3}
          blur={2.5}
        />
      </Float>
    </group>
  );
}
