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

  const aspect = 3 / 4;
  const width = 0.35;
  const height = width / aspect;

  return (
    <group position={[-1.4, 1.8, -2.45]}>
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width + 0.04, height + 0.04]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
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
          <meshBasicMaterial color="#333" transparent opacity={0.5} side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  );
}
