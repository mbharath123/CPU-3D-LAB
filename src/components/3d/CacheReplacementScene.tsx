import React from 'react';
import { Text, Float } from '@react-three/drei';
import type { ReplacementPolicyType, CacheLineData } from '../../types';

interface CacheReplacementSceneProps {
  policy: ReplacementPolicyType;
  lines: CacheLineData[];
  victimIndex: number | null;
  onSimulateAccess?: (index: number) => void;
}

export const CacheReplacementScene: React.FC<CacheReplacementSceneProps> = ({
  policy,
  lines,
  victimIndex,
  onSimulateAccess,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Title */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.4}
        color="#a855f7"

      >
        EVICTION POLICY: {policy.toUpperCase()}
      </Text>

      {/* 4 Cache Block Lines */}
      {lines.map((line, idx) => {
        const isVictim = victimIndex === idx;
        const xPos = -4.5 + idx * 3.0;

        return (
          <group key={`rep-line-${idx}`} position={[xPos, 0, 0]}>
            <Float speed={1.5} floatIntensity={0.3}>
              {/* Block Frame */}
              <mesh onClick={() => onSimulateAccess?.(idx)}>
                <boxGeometry args={[2.5, 3.5, 1.8]} />
                <meshStandardMaterial
                  color={isVictim ? '#ff007f' : '#1e293b'}
                  emissive={isVictim ? '#ff007f' : '#3b82f6'}
                  emissiveIntensity={isVictim ? 0.9 : 0.3}
                  transparent
                  opacity={0.85}
                />
              </mesh>

              {/* Block Header */}
              <Text position={[0, 1.3, 0.95]} fontSize={0.28} color="#00f3ff">
                LINE {line.index}
              </Text>

              {/* Tag / Data */}
              <Text position={[0, 0.7, 0.95]} fontSize={0.22} color="#ffffff">
                TAG: {line.tag}
              </Text>

              {/* Policy Specific Metadata Display */}
              <Text position={[0, 0.1, 0.95]} fontSize={0.2} color="#cbd5e1">
                Age: T+{line.insertionOrder}s
              </Text>
              <Text position={[0, -0.4, 0.95]} fontSize={0.2} color="#cbd5e1">
                Access Count: {line.frequency}
              </Text>
              <Text position={[0, -0.9, 0.95]} fontSize={0.2} color="#cbd5e1">
                Last Access: {line.lastAccessCycle}c
              </Text>

              {/* Victim Badge */}
              {isVictim && (
                <group position={[0, -1.4, 1.0]}>
                  <Text fontSize={0.24} color="#ff007f">
                    🎯 EVICTION VICTIM
                  </Text>
                </group>
              )}
            </Float>
          </group>
        );
      })}
    </group>
  );
};
