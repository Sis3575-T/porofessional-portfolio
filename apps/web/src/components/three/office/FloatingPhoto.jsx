import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(url, resolve, undefined, reject);
  });
}

export default function FloatingPhoto({ imageUrl }) {
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (!imageUrl) { setTexture(null); return; }
    let cancelled = false;
    loadTexture(imageUrl)
      .then((t) => { if (!cancelled) setTexture(t); })
      .catch(() => { if (!cancelled) setTexture(null); });
    return () => { cancelled = true; };
  }, [imageUrl]);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = Date.now() * 0.0003;
    meshRef.current.position.y = 1.4 + Math.sin(t) * 0.015;
  });

  const aspect = 3 / 4;
  const width = 0.45;
  const height = width / aspect;

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1.4, -0.6]}>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            transparent
            roughness={0.3}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshBasicMaterial color="#0a0a2a" transparent opacity={0} side={THREE.DoubleSide} />
        )}
      </mesh>
      {texture && (
        <mesh position={[0, 1.4, -0.602]}>
          <planeGeometry args={[width + 0.01, height + 0.01]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
