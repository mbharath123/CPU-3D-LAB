import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import type {
  PipelineInstruction,
  HazardType,
} from '../../types';

interface PipelineSceneProps {
  instructions: PipelineInstruction[];
  activeHazard: HazardType;
  selectedStage: string | null;
  onSelectStage: (stageName: string) => void;
}

const STAGES = [
  {
    id: 'IF',
    name: 'Fetch',
    fullName: 'Instruction Fetch',
    color: '#00f3ff',
    x: -8,
  },
  {
    id: 'ID',
    name: 'Decode',
    fullName: 'Instruction Decode',
    color: '#3b82f6',
    x: -4,
  },
  {
    id: 'EX',
    name: 'Execute',
    fullName: 'Execute / ALU',
    color: '#a855f7',
    x: 0,
  },
  {
    id: 'MEM',
    name: 'Memory',
    fullName: 'Memory Access',
    color: '#ff007f',
    x: 4,
  },
  {
    id: 'WB',
    name: 'WriteBack',
    fullName: 'Write Back',
    color: '#10b981',
    x: 8,
  },
];

export const PipelineScene = ({
  instructions,
  activeHazard,
  selectedStage,
  onSelectStage,
}: PipelineSceneProps) => {
  const laserRef = useRef<THREE.Group>(null);

  /*
   * Animate the pipeline laser beams.
   */
  useFrame((state) => {
    if (!laserRef.current) {
      return;
    }

    laserRef.current.children.forEach((child, index) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      const material = child.material;

      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity =
          0.4 +
          Math.sin(
            state.clock.getElapsedTime() * 4 + index
          ) *
          0.3;
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>

      {/* =====================================================
          PIPELINE CONNECTION LASERS
          ===================================================== */}

      <group ref={laserRef}>
        {STAGES.slice(0, STAGES.length - 1).map(
          (stage, index) => {
            const nextStage = STAGES[index + 1];

            const midX =
              (stage.x + nextStage.x) / 2;

            return (
              <mesh
                key={`laser-${index}`}
                position={[midX, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry
                  args={[0.08, 0.08, 4, 16]}
                />

                <meshBasicMaterial
                  color={
                    activeHazard !== 'none'
                      ? '#ff007f'
                      : '#00f3ff'
                  }
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          }
        )}
      </group>


      {/* =====================================================
          DATA HAZARD / FORWARDING PATH
          ===================================================== */}

      {activeHazard === 'data' && (
        <group>
          <mesh
            position={[2, 1.8, 0]}
            rotation={[0, 0, 0]}
          >
            <boxGeometry
              args={[4.2, 0.1, 0.1]}
            />

            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.9}
            />
          </mesh>

          <Text
            position={[2, 2.2, 0]}
            fontSize={0.25}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            FORWARDING PATH
          </Text>
        </group>
      )}


      {/* =====================================================
          CONTROL HAZARD
          ===================================================== */}

      {activeHazard === 'control' && (
        <group position={[-6, 2, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="#ff007f"
            anchorX="center"
            anchorY="middle"
          >
            BRANCH MISPREDICTION - PIPELINE FLUSH
          </Text>
        </group>
      )}


      {/* =====================================================
          PIPELINE STAGES
          ===================================================== */}

      {STAGES.map((stage) => {
        const isSelected =
          selectedStage === stage.id;

        return (
          <group
            key={stage.id}
            position={[stage.x, 0, 0]}
          >
            <Float
              speed={1.5}
              rotationIntensity={0.2}
              floatIntensity={0.4}
            >

              {/* ---------------------------------------------
                  OUTER GLASS STAGE BOX
                  --------------------------------------------- */}

              <mesh
                onClick={() =>
                  onSelectStage(stage.id)
                }
              >
                <boxGeometry
                  args={[2.4, 2.4, 2.4]}
                />

                <meshPhysicalMaterial
                  color={
                    isSelected
                      ? '#00f3ff'
                      : stage.color
                  }
                  transparent
                  opacity={
                    isSelected
                      ? 0.85
                      : 0.45
                  }
                  roughness={0.1}
                  transmission={0.6}
                  thickness={1.2}
                  ior={1.5}
                />
              </mesh>


              {/* ---------------------------------------------
                  INNER HARDWARE CORE
                  --------------------------------------------- */}

              <mesh>
                <boxGeometry
                  args={[1.4, 1.4, 1.4]}
                />

                <meshStandardMaterial
                  color={stage.color}
                  emissive={stage.color}
                  emissiveIntensity={
                    isSelected
                      ? 0.9
                      : 0.5
                  }
                  wireframe
                />
              </mesh>


              {/* ---------------------------------------------
                  STAGE ID
                  --------------------------------------------- */}

              <Text
                position={[0, 1.6, 0]}
                fontSize={0.4}
                color={stage.color}
                anchorX="center"
                anchorY="middle"
              >
                {stage.id}
              </Text>


              {/* ---------------------------------------------
                  STAGE NAME
                  --------------------------------------------- */}

              <Text
                position={[0, -1.6, 0]}
                fontSize={0.24}
                color="#cbd5e1"
                anchorX="center"
                anchorY="middle"
              >
                {stage.name}
              </Text>

            </Float>
          </group>
        );
      })}


      {/* =====================================================
          INSTRUCTION PACKETS
          ===================================================== */}

      {instructions.map((inst) => {

        /*
         * -1 = Not fetched
         *  0 = IF
         *  1 = ID
         *  2 = EX
         *  3 = MEM
         *  4 = WB
         *  5 = Completed
         */

        if (
          inst.currentStage < 0 ||
          inst.currentStage > 4
        ) {
          return null;
        }

        const targetStage =
          STAGES[inst.currentStage];

        /*
         * Safety check in case an invalid stage
         * somehow reaches the component.
         */

        if (!targetStage) {
          return null;
        }

        const isBubble =
          inst.type === 'NOP' ||
          inst.isStalled;

        return (
          <group
            key={`inst-${inst.id}`}
            position={[
              targetStage.x,
              0,
              1.2,
            ]}
          >
            <Float
              speed={3}
              rotationIntensity={1}
              floatIntensity={0.5}
            >

              {/* ---------------------------------------------
                  INSTRUCTION CUBE
                  --------------------------------------------- */}

              <mesh>
                <boxGeometry
                  args={[0.9, 0.9, 0.9]}
                />

                <meshStandardMaterial
                  color={
                    isBubble
                      ? '#ff007f'
                      : inst.color
                  }
                  emissive={
                    isBubble
                      ? '#ff007f'
                      : inst.color
                  }
                  emissiveIntensity={0.8}
                />
              </mesh>


              {/* ---------------------------------------------
                  INSTRUCTION NAME
                  --------------------------------------------- */}

              <Text
                position={[0, 0, 0.52]}
                fontSize={0.18}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {inst.name}
              </Text>


              {/* ---------------------------------------------
                  STALL / BUBBLE HALO
                  --------------------------------------------- */}

              {isBubble && (
                <mesh>
                  <sphereGeometry
                    args={[0.75, 16, 16]}
                  />

                  <meshBasicMaterial
                    color="#ff007f"
                    wireframe
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )}

            </Float>
          </group>
        );
      })}


      {/* =====================================================
          PIPELINE INFORMATION
          ===================================================== */}

      <Text
        position={[0, -3.1, 0]}
        fontSize={0.22}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        IF → ID → EX → MEM → WB → COMPLETED
      </Text>

    </group>
  );
};