import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface MemorySpeedRaceSceneProps {
  isRacing: boolean;
}

export const MemorySpeedRaceScene: React.FC<MemorySpeedRaceSceneProps> = ({ isRacing }) => {
  const cpuCarRef = useRef<THREE.Group>(null!);
  const ramCarRef = useRef<THREE.Group>(null!);
  const ssdCarRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (isRacing) {
      // CPU Hyper Car (Ultra Fast)
      if (cpuCarRef.current) {
        cpuCarRef.current.position.x += delta * 18;
        if (cpuCarRef.current.position.x > 12) cpuCarRef.current.position.x = -12;
      }
      // RAM Shuttle (Medium speed)
      if (ramCarRef.current) {
        ramCarRef.current.position.x += delta * 4;
        if (ramCarRef.current.position.x > 12) ramCarRef.current.position.x = -12;
      }
      // SSD Heavy Transport (Ultra Slow)
      if (ssdCarRef.current) {
        ssdCarRef.current.position.x += delta * 0.8;
        if (ssdCarRef.current.position.x > 12) ssdCarRef.current.position.x = -12;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Track 1: CPU Register / L1 (Top Track) */}
      <group position={[0, 2.5, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[26, 0.1, 1.6]} />
          <meshStandardMaterial color="#0284c7" emissive="#00f3ff" emissiveIntensity={0.2} />
        </mesh>

        <group ref={cpuCarRef} position={[-10, 0.4, 0]}>
          {/* Cyberpunk Hyper Car Model */}
          <mesh>
            <boxGeometry args={[2.0, 0.5, 1.0]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.0, 0.4, 0.8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, 0.8, 0]} fontSize={0.28} color="#00f3ff">
            🏎️ CPU Core (0.3ns)
          </Text>
        </group>
      </group>

      {/* Track 2: Main Memory DDR5 RAM (Middle Track) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[26, 0.1, 1.6]} />
          <meshStandardMaterial color="#047857" emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>

        <group ref={ramCarRef} position={[-10, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.6, 1.2]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 0.8, 0]} fontSize={0.28} color="#10b981">
            🚌 DDR5 RAM (70ns)
          </Text>
        </group>
      </group>

      {/* Track 3: NVMe SSD (Bottom Track) */}
      <group position={[0, -2.5, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[26, 0.1, 1.6]} />
          <meshStandardMaterial color="#b45309" emissive="#f59e0b" emissiveIntensity={0.2} />
        </mesh>

        <group ref={ssdCarRef} position={[-10, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[3.0, 0.8, 1.4]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 0.9, 0]} fontSize={0.28} color="#f59e0b">
            🚚 NVMe SSD (50,000ns)
          </Text>
        </group>
      </group>
    </group>
  );
};
