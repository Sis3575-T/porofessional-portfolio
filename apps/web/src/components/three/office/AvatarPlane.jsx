import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAvatar } from "../../../context/AvatarContext";

export default function AvatarPlane() {
  const meshRef = useRef();
  const { textureUrl, position, rotation, scale, visible, mirrored, locked } = useAvatar();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!textureUrl) {
      setTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(textureUrl, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      setTexture(tex);
    });
    return () => {
      if (texture) {
        texture.dispose();
        setTexture(null);
      }
    };
  }, [textureUrl]);

  const aspect = useMemo(() => {
    if (!texture || !texture.image) return 0.6;
    const img = texture.image;
    return img.width / img.height;
  }, [texture]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(...position);
    meshRef.current.rotation.set(...rotation);
    const sx = mirrored ? -scale[0] : scale[0];
    meshRef.current.scale.set(sx, scale[1], scale[2]);
    meshRef.current.visible = visible;
  });

  if (!texture) return null;

  const planeHeight = 1.0;
  const planeWidth = planeHeight * aspect;

  return (
    <group>
      <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.01}
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.05}
          depthWrite={false}
        />
      </mesh>

      {/* Contact shadow on floor */}
      {visible && (
        <mesh position={[position[0], 0.005, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
