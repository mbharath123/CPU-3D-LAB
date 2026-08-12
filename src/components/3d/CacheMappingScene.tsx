import React from 'react';
import { Text } from '@react-three/drei';
import type {
  CacheMappingType,
  AddressBreakdown,
} from '../../types';

interface CacheMappingSceneProps {
  mappingType: CacheMappingType;
  addressInfo: AddressBreakdown;
  selectedLineIndex?: number | null;
  onSelectLine?: (index: number) => void;
}

export const CacheMappingScene: React.FC<CacheMappingSceneProps> = ({
  mappingType,
  addressInfo,
  selectedLineIndex,
  onSelectLine,
}) => {
  const lineCount = 8;
  const targetIndex = addressInfo.calculatedIndex;

  return (
    <group position={[0, 0, 0]}>
      {/* Header Holographic Title */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.45}
        color="#00f3ff"

      >
        {mappingType === 'direct' && 'DIRECT MAPPED CACHE (1 Block / Line)'}
        {mappingType === 'set-associative' && '2-WAY SET ASSOCIATIVE CACHE (Sets of 2 Lines)'}
        {mappingType === 'fully-associative' && 'FULLY ASSOCIATIVE CACHE (Any Block ➔ Any Line)'}
      </Text>

      {/* 8 Floating 3D Cache Lines */}
      {Array.from({ length: lineCount }).map((_, idx) => {
        const yPos = 2.8 - idx * 0.8;
        const isTarget = mappingType === 'direct' ? idx === targetIndex :
          mappingType === 'set-associative' ? (idx === targetIndex || idx === targetIndex + 1) : true;
        const isSelected = selectedLineIndex === idx;

        let lineColor = '#3b82f6';
        if (isSelected) lineColor = '#ff007f';
        else if (isTarget) lineColor = '#00f3ff';

        return (
          <group key={`cache-line-${idx}`} position={[0, yPos, 0]}>
            {/* Line Index Block */}
            <mesh position={[-4.5, 0, 0]} onClick={() => onSelectLine?.(idx)}>
              <boxGeometry args={[1.2, 0.65, 0.8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <Text position={[-4.5, 0, 0.42]} fontSize={0.22} color="#cbd5e1">
              Line {idx}
            </Text>

            {/* Valid Bit */}
            <mesh position={[-3.0, 0, 0]}>
              <boxGeometry args={[1.2, 0.65, 0.8]} />
              <meshStandardMaterial color={isTarget ? '#10b981' : '#334155'} />
            </mesh>
            <Text position={[-3.0, 0, 0.42]} fontSize={0.2} color="#ffffff">
              V={isTarget ? '1' : '0'}
            </Text>

            {/* Tag Field */}
            <mesh position={[-1.2, 0, 0]}>
              <boxGeometry args={[2.0, 0.65, 0.8]} />
              <meshStandardMaterial
                color={isTarget ? '#a855f7' : '#1e293b'}
                emissive={isTarget ? '#a855f7' : '#000000'}
                emissiveIntensity={0.5}
              />
            </mesh>
            <Text position={[-1.2, 0, 0.42]} fontSize={0.2} color="#ffffff">
              TAG: {isTarget ? addressInfo.tagBits : '0x00'}
            </Text>

            {/* Data Field (64-bit Cache Line) */}
            <mesh position={[2.2, 0, 0]}>
              <boxGeometry args={[4.2, 0.65, 0.8]} />
              <meshStandardMaterial
                color={lineColor}
                emissive={lineColor}
                emissiveIntensity={isTarget ? 0.8 : 0.2}
                transparent
                opacity={0.8}
              />
            </mesh>
            <Text position={[2.2, 0, 0.42]} fontSize={0.2} color="#ffffff">
              DATA: [0x4A, 0x8F, 0x12, 0x99, 0xC4, 0xFE, 0x00, 0x7E]
            </Text>
          </group>
        );
      })}
    </group>
  );
};
