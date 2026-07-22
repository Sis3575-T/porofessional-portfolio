import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAvatar3D } from "../../../context/Avatar3DContext";

const CHAIR_POSITION = [1.15, 0.7, 0.2];
const CHAIR_ROTATION = [0, -Math.PI / 2, 0];

const isGLB = (url) => url && /\.(glb|gltf)$/i.test(url);
const isImage = (url) => url && /\.(png|jpe?g|webp)$/i.test(url);

function SittingPose({ scene }) {
  useEffect(() => {
    if (!scene) return;

    const walkBone = (node, callback) => {
      if (node.isBone || node.isGroup) callback(node);
      if (node.children) node.children.forEach((child) => walkBone(child, callback));
    };

    walkBone(scene, (bone) => {
      const name = bone.name.toLowerCase();

      if (name.includes("spine") || name.includes("chest") || name.includes("upperbody")) {
        bone.rotation.x = 0.15;
      }
      if (name.includes("neck") || name.includes("head")) {
        bone.rotation.x = -0.1;
        bone.rotation.y = 0.2;
      }
      if (name.includes("leftupperleg") || name.includes("leftthigh") || name.includes("l_thigh")) {
        bone.rotation.x = -1.2;
      }
      if (name.includes("leftlowerleg") || name.includes("leftshin") || name.includes("l_calf")) {
        bone.rotation.x = 1.5;
      }
      if (name.includes("rightupperleg") || name.includes("rightthigh") || name.includes("r_thigh")) {
        bone.rotation.x = -1.2;
      }
      if (name.includes("rightlowerleg") || name.includes("rightshin") || name.includes("r_calf")) {
        bone.rotation.x = 1.5;
      }
      if (name.includes("leftupperarm") || name.includes("l_shoulder") || name.includes("l_upperarm")) {
        bone.rotation.x = -0.8;
        bone.rotation.z = 0.3;
      }
      if (name.includes("leftlowerarm") || name.includes("l_forearm") || name.includes("l_lowerarm")) {
        bone.rotation.x = -1.0;
      }
      if (name.includes("rightupperarm") || name.includes("r_shoulder") || name.includes("r_upperarm")) {
        bone.rotation.x = -0.8;
        bone.rotation.z = -0.3;
      }
      if (name.includes("rightlowerarm") || name.includes("r_forearm") || name.includes("r_lowerarm")) {
        bone.rotation.x = -1.0;
      }
      if (name.includes("leftshoulder") || name.includes("l_clavicle")) {
        bone.rotation.z = 0.15;
      }
      if (name.includes("rightshoulder") || name.includes("r_clavicle")) {
        bone.rotation.z = -0.15;
      }
    });
  }, [scene]);

  return null;
}

function IdleAnimations({ scene }) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!scene) return;
    timeRef.current += delta;
    const t = timeRef.current;

    const walkBone = (node, callback) => {
      if (node.isBone || node.isGroup) callback(node);
      if (node.children) node.children.forEach((child) => walkBone(child, callback));
    };

    walkBone(scene, (bone) => {
      const name = bone.name.toLowerCase();

      if (name.includes("head") || name.includes("neck")) {
        bone.rotation.y = 0.2 + Math.sin(t * 0.5) * 0.03;
        bone.rotation.x = -0.1 + Math.sin(t * 0.3) * 0.02;
      }

      if (name.includes("chest") || name.includes("spine") || name.includes("upperbody")) {
        bone.rotation.x = 0.15 + Math.sin(t * 0.8) * 0.008;
      }

      if (name.includes("leftlowerarm") || name.includes("l_forearm")) {
        bone.rotation.x = -1.0 + Math.sin(t * 3.0) * 0.04;
        bone.rotation.z = Math.sin(t * 2.5) * 0.02;
      }
      if (name.includes("rightlowerarm") || name.includes("r_forearm")) {
        bone.rotation.x = -1.0 + Math.sin(t * 3.5 + 0.5) * 0.04;
        bone.rotation.z = Math.sin(t * 2.8 + 0.3) * 0.02;
      }

      if (name.includes("leftupperarm") || name.includes("l_upperarm")) {
        bone.rotation.x = -0.8 + Math.sin(t * 2.0) * 0.015;
      }
      if (name.includes("rightupperarm") || name.includes("r_upperarm")) {
        bone.rotation.x = -0.8 + Math.sin(t * 2.2 + 0.4) * 0.015;
      }
    });
  });

  return null;
}

function GLBModel({ url, visible }) {
  const groupRef = useRef();
  const { scene: gltfScene } = useGLTF(url, true);

  const scene = useMemo(() => {
    if (!gltfScene) return null;
    const cloned = gltfScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 0.8;
          child.material.needsUpdate = true;
        }
      }
    });
    return cloned;
  }, [gltfScene]);

  useEffect(() => {
    if (!groupRef.current || !scene) return;
    while (groupRef.current.children.length) {
      groupRef.current.remove(groupRef.current.children[0]);
    }
    groupRef.current.add(scene);
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={CHAIR_POSITION} rotation={CHAIR_ROTATION} scale={[0.9, 0.9, 0.9]}>
      {scene && <SittingPose scene={scene} />}
      {scene && <IdleAnimations scene={scene} />}
    </group>
  );
}

function PhotoAvatar({ url, visible }) {
  const groupRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => setTexture(null)
    );
  }, [url]);

  const materials = useMemo(() => {
    if (!texture) return null;
    return {
      skin: new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.8 }),
      shirt: new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6 }),
      pants: new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7 }),
      shoes: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 }),
    };
  }, [texture]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible && !!materials;
  });

  if (!materials) return null;

  return (
    <group ref={groupRef} position={CHAIR_POSITION} rotation={CHAIR_ROTATION} scale={[0.9, 0.9, 0.9]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...materials.skin} />
      </mesh>

      {/* Torso (shirt with photo texture) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.15, 0.5, 16]} />
        <primitive object={materials.shirt} attach="material" />
      </mesh>

      {/* Left upper arm */}
      <group position={[-0.25, 1.4, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        {/* Left forearm */}
        <group position={[0, -0.28, 0]} rotation={[-0.8, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right upper arm */}
      <group position={[0.25, 1.4, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        {/* Right forearm - on desk */}
        <group position={[0, -0.28, 0]} rotation={[-0.8, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left leg */}
      <group position={[-0.08, 0.85, 0]} rotation={[-1.2, 0, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.4, 0]} rotation={[1.5, 0, 0]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.25, 4, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, 0.03]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.12]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right leg */}
      <group position={[0.08, 0.85, 0]} rotation={[-1.2, 0, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.4, 0]} rotation={[1.5, 0, 0]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.25, 4, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, 0.03]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.12]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function DefaultAvatar({ visible }) {
  const groupRef = useRef();

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.8 }),
      shirt: new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.6 }),
      pants: new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7 }),
      shoes: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 }),
    }),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={CHAIR_POSITION} rotation={CHAIR_ROTATION} scale={[0.9, 0.9, 0.9]}>
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.15, 0.5, 16]} />
        <primitive object={materials.shirt} attach="material" />
      </mesh>
      <group position={[-0.25, 1.4, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[-0.8, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>
      <group position={[0.25, 1.4, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        <group position={[0, -0.28, 0]} rotation={[-0.8, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 4, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
      </group>
      <group position={[-0.08, 0.85, 0]} rotation={[-1.2, 0, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.4, 0]} rotation={[1.5, 0, 0]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.25, 4, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, 0.03]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.12]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
        </group>
      </group>
      <group position={[0.08, 0.85, 0]} rotation={[-1.2, 0, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        <group position={[0, -0.4, 0]} rotation={[1.5, 0, 0]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.25, 4, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, 0.03]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.12]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function AvatarModel({ url, visible }) {
  if (!url) return <DefaultAvatar visible={visible} />;
  if (isGLB(url)) return <GLBModel url={url} visible={visible} />;
  if (isImage(url)) return <PhotoAvatar url={url} visible={visible} />;
  return <DefaultAvatar visible={visible} />;
}

export default function Avatar3D() {
  const { avatarUrl, visible } = useAvatar3D();
  return <AvatarModel url={avatarUrl} visible={visible} />;
}
