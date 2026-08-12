import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CpuChipModelProps {
  isExploded?: boolean;
  onSelectComponent?: (name: string) => void;
}

export const CpuChipModel: React.FC<CpuChipModelProps> = ({
  isExploded = false,
  onSelectComponent,
}) => {
  const chipGroupRef = useRef<THREE.Group>(null!);
  const dieRef = useRef<THREE.Mesh>(null!);
  const ramLeftRef = useRef<THREE.Group>(null!);
  const ramRightRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (chipGroupRef.current) {
      chipGroupRef.current.rotation.y += delta * 0.35;
    }
    if (dieRef.current) {
      // Glow pulse on silicon die
      const material = dieRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 3) * 0.3;
    }
    if (ramLeftRef.current && ramRightRef.current) {
      ramLeftRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.3;
      ramRightRef.current.position.y = Math.cos(state.clock.getElapsedTime() * 1.5) * 0.3;
    }
  });

  const explodedY = {
    ihs: isExploded ? 2.2 : 0.45,
    thermal: isExploded ? 1.4 : 0.32,
    die: isExploded ? 0.7 : 0.22,
    substrate: 0,
  };

  return (
    <group ref={chipGroupRef}>
      {/* 1. PCB Substrate (Green/Dark Gold Base) */}
      <mesh
        position={[0, explodedY.substrate, 0]}
        onClick={() => onSelectComponent?.('PCB Substrate & Pins')}
      >
        <boxGeometry args={[4, 0.2, 4]} />
        <meshStandardMaterial
          color="#064e3b"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Gold Pins grid on underside */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x) =>
        [-1.6, -0.8, 0, 0.8, 1.6].map((z) => (
          <mesh key={`pin-${x}-${z}`} position={[x, explodedY.substrate - 0.12, z]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.1} />
          </mesh>
        ))
      )}

      {/* 2. Silicon Die Core (Glowing Circuits) */}
      <mesh
        ref={dieRef}
        position={[0, explodedY.die, 0]}
        onClick={() => onSelectComponent?.('Silicon Processing Core (ALU & Cache)')}
      >
        <boxGeometry args={[2.2, 0.12, 2.2]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#00f3ff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 3. Thermal Interface Layer */}
      <mesh position={[0, explodedY.thermal, 0]}>
        <boxGeometry args={[2.0, 0.05, 2.0]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* 4. Integrated Heat Spreader (IHS Metallic Cap) */}
      <mesh
        position={[0, explodedY.ihs, 0]}
        onClick={() => onSelectComponent?.('Integrated Heat Spreader (IHS)')}
      >
        <boxGeometry args={[3.4, 0.25, 3.4]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* Holographic Text Label on IHS */}
      <Text
        position={[0, explodedY.ihs + 0.14, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.28}
        color="#00f3ff"

      >
        ANTIGRAVITY CORE X-9000
      </Text>

      {/* Orbiting Floating RAM Stick Left */}
      <group ref={ramLeftRef} position={[-3.6, 0.5, 0]} rotation={[0, 0.3, 0.2]}>
        <mesh onClick={() => onSelectComponent?.('DDR5 High-Speed RAM Stick')}>
          <boxGeometry args={[0.3, 2.6, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Memory IC chips on RAM */}
        {[-0.8, -0.3, 0.3, 0.8].map((yOffset) => (
          <mesh key={yOffset} position={[0.18, yOffset, 0]}>
            <boxGeometry args={[0.08, 0.35, 0.5]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Orbiting Floating RAM Stick Right */}
      <group ref={ramRightRef} position={[3.6, 0.5, 0]} rotation={[0, -0.3, -0.2]}>
        <mesh onClick={() => onSelectComponent?.('DDR5 High-Speed RAM Stick')}>
          <boxGeometry args={[0.3, 2.6, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {[-0.8, -0.3, 0.3, 0.8].map((yOffset) => (
          <mesh key={yOffset} position={[-0.18, yOffset, 0]}>
            <boxGeometry args={[0.08, 0.35, 0.5]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Floating 3D Cache Blocks */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[2.5, 2.5, 2.5]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.8}>
        <mesh position={[-2.5, 2.2, -2.2]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.6} transparent opacity={0.85} />
        </mesh>
      </Float>
    </group>
  );
};
