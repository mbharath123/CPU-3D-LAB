import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SceneBackgroundProps {
  particleCount?: number;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ particleCount = 200 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const electronsRef = useRef<THREE.Group>(null!);

  // Generate random particles in zero-g space
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const palette = [
      new THREE.Color('#00f3ff'), // cyan
      new THREE.Color('#3b82f6'), // blue
      new THREE.Color('#a855f7'), // purple
      new THREE.Color('#ff007f'), // magenta
    ];

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [particleCount]);

  // Orbiting binary floating numbers data
  const binaryItems = useMemo(() => {
    const items = [];
    const binaries = ['0101', '1100', '1010', '0011', '1111', '0000', '0110', '1001'];
    for (let i = 0; i < 20; i++) {
      items.push({
        id: i,
        text: binaries[i % binaries.length],
        position: [
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        color: i % 2 === 0 ? '#00f3ff' : '#a855f7',
        speed: 0.2 + Math.random() * 0.3,
      });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.02;
    }
    if (electronsRef.current) {
      electronsRef.current.rotation.y += delta * 0.5;
      electronsRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <>
      {/* Stars Background */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1.5} />

      {/* Floating Ambient Glowing Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Orbiting Electron Ring System */}
      <group ref={electronsRef} position={[0, 0, -8]}>
        {[0, 1, 2, 3].map((ring) => {
          const radius = 5 + ring * 2.2;
          return (
            <mesh key={ring} rotation={[ring * 0.5, ring * 0.8, 0]}>
              <ringGeometry args={[radius, radius + 0.03, 64]} />
              <meshBasicMaterial
                color={ring % 2 === 0 ? '#00f3ff' : '#ff007f'}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>

      {/* Zero-G Floating Binary Text Elements */}
      {binaryItems.map((item) => (
        <Float key={item.id} speed={item.speed} rotationIntensity={1} floatIntensity={2}>
          <Text
            position={item.position}
            fontSize={0.35}
            color={item.color}
            fillOpacity={0.4}
          >
            {item.text}
          </Text>
        </Float>
      ))}

      {/* Grid Floor Overlay */}
      <gridHelper
        args={[60, 60, '#00f3ff', '#1e293b']}
        position={[0, -8, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  );
};
