import { useMemo } from "react";
import * as THREE from "three";

function Bookshelf() {
  const books = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      width: 0.02 + Math.random() * 0.025,
      height: 0.12 + Math.random() * 0.06,
      color: new THREE.Color().setHSL(
        Math.random() * 0.1 + 0.55,
        0.3 + Math.random() * 0.4,
        0.25 + Math.random() * 0.3
      ),
    })),
    []
  );

  return (
    <group position={[-2.8, 0.4, -1.5]}>
      {/* Shelf frame */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 1.8, 0.28]} />
        <meshStandardMaterial color="#4a3a2d" roughness={0.7} />
      </mesh>

      {/* Shelves */}
      {[-0.6, -0.1, 0.4, 0.85].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[0.32, 0.015, 0.25]} />
          <meshStandardMaterial color="#5a4a3d" roughness={0.6} />
        </mesh>
      ))}

      {/* Books on each shelf */}
      {[-0.55, -0.05, 0.45, 0.88].map((shelfY, si) => (
        <group key={si}>
          {Array.from({ length: 5 }, (_, i) => {
            const book = books[si * 5 + i] || books[0];
            return (
              <mesh
                key={i}
                position={[-0.1 + i * 0.05, shelfY + book.height / 2 + 0.01, 0.04]}
                castShadow
              >
                <boxGeometry args={[book.width, book.height, 0.15]} />
                <meshStandardMaterial color={book.color} roughness={0.8} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function WallShelf() {
  return (
    <group position={[1.8, 2.0, -2.45]}>
      {/* Shelf board */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.02, 0.18]} />
        <meshStandardMaterial color="#5a4a3d" roughness={0.6} />
      </mesh>
      {/* Bracket left */}
      <mesh position={[-0.3, -0.06, -0.06]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Bracket right */}
      <mesh position={[0.3, -0.06, -0.06]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Items on shelf */}
      <mesh position={[-0.2, 0.04, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.06]} />
        <meshStandardMaterial color="#2a4a3a" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 10]} />
        <meshStandardMaterial color="#d4ccc0" roughness={0.7} />
      </mesh>
      {/* Small plant */}
      <mesh position={[0.25, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#3a7a2a" roughness={0.85} />
      </mesh>
    </group>
  );
}

function WindowWall() {
  return (
    <group position={[0, 0, -2.5]}>
      {/* Window frame */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.6, 2.2, 0.06]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.6} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 1.5, 0.02]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial
          color="#87ceeb"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      {/* Window cross bars */}
      <mesh position={[0, 1.5, 0.035]}>
        <boxGeometry args={[1.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#d4ccc0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0.035]}>
        <boxGeometry args={[0.03, 2.0, 0.02]} />
        <meshStandardMaterial color="#d4ccc0" roughness={0.5} />
      </mesh>

      {/* Skyline outside */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[-1.2 + i * 0.2 + Math.random() * 0.1, 0.3 + Math.random() * 1.2, 0.3]}
        >
          <boxGeometry args={[0.1 + Math.random() * 0.08, 0.6 + Math.random() * 1.2, 0.05]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.55, 0.1, 0.35 + Math.random() * 0.2)}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function WallArt() {
  return (
    <group position={[2.2, 1.8, -2.46]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.25, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.9}
        />
      </mesh>
      {/* Abstract lines */}
      <mesh position={[-0.05, 0.03, 0.012]}>
        <boxGeometry args={[0.15, 0.008, 0.001]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.5} />
      </mesh>
      <mesh position={[0.03, -0.02, 0.012]}>
        <boxGeometry args={[0.1, 0.006, 0.001]} />
        <meshStandardMaterial color="#3498db" roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Room({ config = {} }) {
  const wallColor = config.wallColor || "#f0ece4";
  const floorColor = config.floorColor || "#8b7355";

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={floorColor} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.6, -2.5]}>
        <planeGeometry args={[10, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-3.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[3.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5, 3.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.95} />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, 0.04, -2.49]}>
        <boxGeometry args={[10, 0.08, 0.02]} />
        <meshStandardMaterial color="#e0d8cc" roughness={0.6} />
      </mesh>

      {/* Window */}
      <WindowWall />

      {/* Bookshelf */}
      <Bookshelf />

      {/* Wall shelves */}
      <WallShelf />

      {/* Wall art */}
      <WallArt />

      {/* Acoustic panel */}
      <mesh position={[-3.48, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.04]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.95} />
      </mesh>
    </group>
  );
}
