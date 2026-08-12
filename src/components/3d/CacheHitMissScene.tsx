import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { soundFx } from '../../utils/soundEffects';

interface CacheHitMissSceneProps {
  mode: 'hit' | 'miss';
  isSimulating: boolean;
  stepProgress: number; // 0 to 1
  onStepComplete?: () => void;
}

const HIERARCHY_NODES = [
  {
    id: 'cpu',
    name: 'CPU Core',
    y: 4,
    color: '#00f3ff',
  },
  {
    id: 'l1',
    name: 'L1 Cache',
    y: 2,
    color: '#3b82f6',
  },
  {
    id: 'l2',
    name: 'L2 Cache',
    y: 0,
    color: '#a855f7',
  },
  {
    id: 'l3',
    name: 'L3 Cache',
    y: -2,
    color: '#ff007f',
  },
  {
    id: 'ram',
    name: 'RAM (DDR5)',
    y: -4,
    color: '#10b981',
  },
];

export const CacheHitMissScene: React.FC<
  CacheHitMissSceneProps
> = ({
  mode,
  isSimulating,
  stepProgress,
}) => {
    // Ref used for the animated request packet
    const pulseRef = useRef<THREE.Mesh>(null!);

    // =========================================================
    // Play sound when simulation starts
    // =========================================================

    useEffect(() => {
      if (isSimulating) {
        if (mode === 'hit') {
          soundFx.playHit();
        } else {
          soundFx.playMiss();
        }
      }
    }, [isSimulating, mode]);

    // =========================================================
    // Calculate packet Y position
    // =========================================================

    let packetY = 4;

    if (mode === 'hit') {
      /*
        CACHE HIT:
  
        CPU
         ↓
        L1
         ↓
        CPU
  
        y = 4 → 2 → 4
      */

      if (stepProgress < 0.5) {
        packetY =
          4 - (stepProgress * 2) * 2;
      } else {
        packetY =
          2 + ((stepProgress - 0.5) * 2) * 2;
      }
    } else {
      /*
        CACHE MISS:
  
        CPU
         ↓
        L1
         ↓
        L2
         ↓
        L3
         ↓
        RAM
         ↓
        CPU
  
        y = 4 → -4 → 4
      */

      if (stepProgress < 0.5) {
        packetY =
          4 - (stepProgress * 2) * 8;
      } else {
        packetY =
          -4 + ((stepProgress - 0.5) * 2) * 8;
      }
    }

    // =========================================================
    // Animate request packet
    // =========================================================

    useFrame((_, delta) => {
      if (pulseRef.current) {
        pulseRef.current.rotation.z += delta * 2;
      }
    });

    // =========================================================
    // Status indicators
    // =========================================================

    const isHitSuccess =
      mode === 'hit' &&
      stepProgress >= 0.3;

    const isMissActive =
      mode === 'miss' &&
      stepProgress >= 0.1;

    // =========================================================
    // Scene
    // =========================================================

    return (
      <group position={[0, 0, 0]}>

        {/* =====================================================
          LASER CONNECTIONS
          ===================================================== */}

        {HIERARCHY_NODES
          .slice(0, HIERARCHY_NODES.length - 1)
          .map((node, idx) => {
            const nextNode =
              HIERARCHY_NODES[idx + 1];

            const midY =
              (node.y + nextNode.y) / 2;

            return (
              <mesh
                key={`hitmiss-laser-${idx}`}
                position={[0, midY, 0]}
              >
                <cylinderGeometry
                  args={[0.08, 0.08, 1.8, 16]}
                />

                <meshBasicMaterial
                  color={
                    mode === 'hit'
                      ? '#10b981'
                      : '#ff007f'
                  }
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          })}

        {/* =====================================================
          CACHE HIERARCHY NODES
          ===================================================== */}

        {HIERARCHY_NODES.map((node) => (
          <group
            key={node.id}
            position={[0, node.y, 0]}
          >

            {/* Cache hardware block */}

            <mesh>
              <boxGeometry
                args={[4.5, 1.0, 2.0]}
              />

              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* Node label */}

            <Text
              position={[0, 0, 1.05]}
              fontSize={0.32}
              color="#ffffff"
            >
              {node.name}
            </Text>

          </group>
        ))}

        {/* =====================================================
          ANIMATED REQUEST PACKET
          ===================================================== */}

        {isSimulating && (
          <mesh
            ref={pulseRef}
            position={[0, packetY, 1.2]}
          >

            <sphereGeometry
              args={[0.45, 32, 32]}
            />

            <meshStandardMaterial
              color={
                mode === 'hit'
                  ? '#10b981'
                  : '#ff007f'
              }
              emissive={
                mode === 'hit'
                  ? '#10b981'
                  : '#ff007f'
              }
              emissiveIntensity={1.5}
            />

          </mesh>
        )}

        {/* =====================================================
          CACHE HIT MESSAGE
          ===================================================== */}

        {mode === 'hit' && isHitSuccess && (
          <group position={[0, 1, 3]}>

            <Float
              speed={3}
              floatIntensity={1}
            >

              <Text
                fontSize={0.85}
                color="#10b981"
              >
                ✓ CACHE HIT
              </Text>

              <Text
                position={[0, -0.7, 0]}
                fontSize={0.32}
                color="#ffffff"
              >
                Data Found in L1 Cache | Latency: 1.2ns | 3 Cycles
              </Text>

            </Float>

          </group>
        )}

        {/* =====================================================
          CACHE MISS MESSAGE
          ===================================================== */}

        {mode === 'miss' && isMissActive && (
          <group position={[0, 1, 3]}>

            <Float
              speed={3}
              floatIntensity={1}
            >

              <Text
                fontSize={0.85}
                color="#ff007f"
              >
                ❌ CACHE MISS
              </Text>

              <Text
                position={[0, -0.7, 0]}
                fontSize={0.32}
                color="#ffffff"
              >
                Missed L1 ➔ L2 ➔ L3 | RAM Fetch Latency: 70ns | 210 Cycles
              </Text>

            </Float>

          </group>
        )}

      </group>
    );
  };