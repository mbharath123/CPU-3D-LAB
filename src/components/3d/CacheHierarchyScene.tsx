import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CACHE_HIERARCHY_DATA } from '../../data/educationalData';

interface CacheHierarchySceneProps {
  selectedLevel: string | null;
  onSelectLevel: (levelId: string) => void;
}

const HIERARCHY_LEVELS = [
  { id: 'cpu', name: 'Registers', y: 5, width: 2.2, color: '#00f3ff' },
  { id: 'l1', name: 'L1 Cache', y: 3, width: 3.4, color: '#3b82f6' },
  { id: 'l2', name: 'L2 Cache', y: 1, width: 4.8, color: '#a855f7' },
  { id: 'l3', name: 'L3 Cache', y: -1, width: 6.2, color: '#ff007f' },
  { id: 'ram', name: 'DDR5 RAM', y: -3, width: 7.8, color: '#10b981' },
  { id: 'ssd', name: 'NVMe SSD', y: -5, width: 9.4, color: '#f59e0b' },
];

export const CacheHierarchyScene: React.FC<CacheHierarchySceneProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, _) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Laser Connections between Hierarchy Levels */}
      {HIERARCHY_LEVELS.slice(0, HIERARCHY_LEVELS.length - 1).map((lvl, idx) => {
        const nextLvl = HIERARCHY_LEVELS[idx + 1];
        const midY = (lvl.y + nextLvl.y) / 2;
        return (
          <mesh key={`h-laser-${idx}`} position={[0, midY, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 16]} />
            <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} />
          </mesh>
        );
      })}

      {/* Floating 3D Hierarchy Levels */}
      {HIERARCHY_LEVELS.map((lvl) => {
        const data = CACHE_HIERARCHY_DATA[lvl.id];
        const isSelected = selectedLevel === lvl.id;

        return (
          <group key={lvl.id} position={[0, lvl.y, 0]}>
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
              {/* Main Glowing Level Block */}
              <mesh onClick={() => onSelectLevel(lvl.id)}>
                <boxGeometry args={[lvl.width, 1.1, 2.6]} />
                <meshPhysicalMaterial
                  color={isSelected ? '#00f3ff' : lvl.color}
                  transparent
                  opacity={isSelected ? 0.9 : 0.6}
                  roughness={0.15}
                  transmission={0.4}
                  thickness={1.5}
                />
              </mesh>

              {/* Glowing Outline Ring */}
              <mesh>
                <boxGeometry args={[lvl.width + 0.15, 1.25, 2.75]} />
                <meshBasicMaterial
                  color={lvl.color}
                  wireframe
                  transparent
                  opacity={isSelected ? 0.9 : 0.3}
                />
              </mesh>

              {/* Text Label: Name */}
              <Text
                position={[-lvl.width / 2 + 0.4, 0, 1.36]}
                fontSize={0.32}
                color="#ffffff"
                anchorX="left"

              >
                {lvl.name}
              </Text>

              {/* Text Label: Latency & Capacity */}
              <Text
                position={[lvl.width / 2 - 0.4, 0, 1.36]}
                fontSize={0.24}
                color={lvl.color}
                anchorX="right"
              >
                ⚡ {data?.latency} | 💾 {data?.capacity.split(' ')[0]} {data?.capacity.split(' ')[1]}
              </Text>
            </Float>
          </group>
        );
      })}
    </group>
  );
};
