import { useState, useEffect } from "react";
import * as THREE from "three";

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(url, resolve, undefined, reject);
  });
}

export default function Monitor({ imageUrl }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!imageUrl) { setTexture(null); return; }
    let cancelled = false;
    loadTexture(imageUrl)
      .then((t) => { if (!cancelled) setTexture(t); })
      .catch(() => { if (!cancelled) setTexture(null); });
    return () => { cancelled = true; };
  }, [imageUrl]);

  return (
    <group position={[0, 1.02, -0.38]}>
      <mesh position={[0, 0.15, 0.005]} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.015]} />
        <meshStandardMaterial color="#181818" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.15, -0.005]}>
        <boxGeometry args={[0.68, 0.46, 0.005]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.2}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            color="#111"
            roughness={0.3}
          />
        )}
      </mesh>
      <mesh position={[0, 0.15, 0.01]}>
        <boxGeometry args={[0.74, 0.52, 0.01]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.4} />
      </mesh>

      <mesh position={[0, -0.12, 0.005]}>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.15]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
