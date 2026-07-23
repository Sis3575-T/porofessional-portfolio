import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!imageUrl) { setTexture(null); return; }
    let cancelled = false;
    loadTexture(imageUrl)
      .then((t) => { if (!cancelled) setTexture(t); })
      .catch(() => { if (!cancelled) setTexture(null); });
    return () => { cancelled = true; };
  }, [imageUrl]);

  if (!imageUrl || !texture) return null;

  const aspect = 3 / 4;
  const width = 0.25;
  const height = width / aspect;

  return (
    <group position={[-3.46, 1.6, 0]}>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.015]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.3}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
