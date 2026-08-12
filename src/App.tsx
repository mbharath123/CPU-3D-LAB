import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import type {
  SectionId,
  PipelineInstruction,
  HazardType,
  CacheMappingType,
  ReplacementPolicyType,
  CacheLineData,
  AddressBreakdown,
  EducationalComponentData,
} from './types';

import { Navbar } from './components/ui/Navbar';
import { PipelineControls } from './components/ui/PipelineControls';
import { CacheAddressDecoder } from './components/ui/CacheAddressDecoder';
import { HolographicDashboard } from './components/ui/HolographicDashboard';
import { EducationalModal } from './components/ui/EducationalModal';
import { ProcessWorking } from './components/ui/ProcessWorking';
import { QuizModal } from './components/ui/QuizModal';

import { SceneBackground } from './components/3d/SceneBackground';
import { CpuChipModel } from './components/3d/CpuChipModel';
import { PipelineScene } from './components/3d/PipelineScene';
import { CacheHierarchyScene } from './components/3d/CacheHierarchyScene';
import { CacheHitMissScene } from './components/3d/CacheHitMissScene';
import { CacheMappingScene } from './components/3d/CacheMappingScene';
import { CacheReplacementScene } from './components/3d/CacheReplacementScene';
import { MemorySpeedRaceScene } from './components/3d/MemorySpeedRaceScene';

import {
  PIPELINE_STAGE_DATA,
  CACHE_HIERARCHY_DATA,
} from './data/educationalData';

import { soundFx } from './utils/soundEffects';

import {
  Play,
  Pause,
  Zap,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export function App() {
  /* =========================================================
     MAIN APP STATE
     ========================================================= */

  const [currentSection, setCurrentSection] =
    useState<SectionId>('landing');

  const [isExploded, setIsExploded] =
    useState(false);

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [quizScore, setQuizScore] =
    useState(0);

  const [modalData, setModalData] =
    useState<EducationalComponentData | null>(null);

  /* =========================================================
     PIPELINE STATE
     ========================================================= */

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [simSpeed, setSimSpeed] =
    useState(1.0);

  const [cycleCount, setCycleCount] =
    useState(1);

  const [activeHazard, setActiveHazard] =
    useState<HazardType>('none');

  const [selectedStage, setSelectedStage] =
    useState<string | null>(null);

  const [instructions, setInstructions] =
    useState<PipelineInstruction[]>([
      {
        id: 1,
        name: 'Instr 1 (ADD)',
        type: 'ADD',
        currentStage: 4,
        color: '#00f3ff',
        cycleStarted: 1,
      },
      {
        id: 2,
        name: 'Instr 2 (SUB)',
        type: 'SUB',
        currentStage: 3,
        color: '#3b82f6',
        cycleStarted: 2,
      },
      {
        id: 3,
        name: 'Instr 3 (LOAD)',
        type: 'LOAD',
        currentStage: 2,
        color: '#a855f7',
        cycleStarted: 3,
      },
      {
        id: 4,
        name: 'Instr 4 (STORE)',
        type: 'STORE',
        currentStage: 1,
        color: '#ff007f',
        cycleStarted: 4,
      },
      {
        id: 5,
        name: 'Instr 5 (BRANCH)',
        type: 'BRANCH',
        currentStage: 0,
        color: '#10b981',
        cycleStarted: 5,
      },
    ]);

  /* =========================================================
     CACHE HIT / MISS STATE
     ========================================================= */

  const [hitMissMode, setHitMissMode] =
    useState<'hit' | 'miss'>('hit');

  const [isHitMissSimulating, setIsHitMissSimulating] =
    useState(false);

  const [hitMissProgress, setHitMissProgress] =
    useState(0);

  const [hitCount, setHitCount] =
    useState(48);

  const [missCount, setMissCount] =
    useState(3);

  /* =========================================================
     CACHE MAPPING STATE
     ========================================================= */

  const [mappingType, setMappingType] =
    useState<CacheMappingType>('direct');

  const [addressBreakdown, setAddressBreakdown] =
    useState<AddressBreakdown>({
      addressHex: '0x4A8F',
      addressBin: '0100101010001111',
      tagBits: '010010101',
      indexBits: '000',
      offsetBits: '1111',
      calculatedIndex: 0,
      calculatedTagHex: '0x95',
    });

  /* =========================================================
     CACHE REPLACEMENT STATE
     ========================================================= */

  const [replacementPolicy, setReplacementPolicy] =
    useState<ReplacementPolicyType>('lru');

  const [victimIndex, setVictimIndex] =
    useState<number | null>(null);

  const [cacheLines, setCacheLines] =
    useState<CacheLineData[]>([
      {
        index: 0,
        valid: true,
        tag: '0x1F',
        data: 'BLOCK_A',
        lastAccessCycle: 12,
        frequency: 14,
        insertionOrder: 1,
      },
      {
        index: 1,
        valid: true,
        tag: '0x8A',
        data: 'BLOCK_B',
        lastAccessCycle: 45,
        frequency: 3,
        insertionOrder: 2,
      },
      {
        index: 2,
        valid: true,
        tag: '0x4C',
        data: 'BLOCK_C',
        lastAccessCycle: 2,
        frequency: 1,
        insertionOrder: 3,
      },
      {
        index: 3,
        valid: true,
        tag: '0x9E',
        data: 'BLOCK_D',
        lastAccessCycle: 88,
        frequency: 22,
        insertionOrder: 4,
      },
    ]);

  /* =========================================================
     MEMORY SPEED RACE
     ========================================================= */

  const [isRacing, setIsRacing] =
    useState(false);

  /* =========================================================
     PIPELINE SIMULATION
     ========================================================= */

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPlaying) {
      interval = setInterval(() => {
        advancePipelineStep();
      }, 1500 / simSpeed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, simSpeed, activeHazard]);

  /* =========================================================
     CACHE HIT / MISS SIMULATION
     ========================================================= */

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isHitMissSimulating) {
      interval = setInterval(() => {
        setHitMissProgress((prev) => {
          if (prev >= 1) {
            setIsHitMissSimulating(false);

            if (hitMissMode === 'hit') {
              setHitCount((h) => h + 1);
            } else {
              setMissCount((m) => m + 1);
            }

            return 0;
          }

          return prev + 0.05;
        });
      }, 50);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHitMissSimulating, hitMissMode]);

  /* =========================================================
     ADVANCE PIPELINE
     ========================================================= */

  const advancePipelineStep = () => {
    setCycleCount((c) => c + 1);

    setInstructions((prev) => {
      return prev.map((inst) => {
        let nextStage = inst.currentStage + 1;

        /* DATA HAZARD */
        if (
          activeHazard === 'data' &&
          inst.id === 3 &&
          inst.currentStage === 1
        ) {
          return {
            ...inst,
            isStalled: true,
          };
        }

        /* CONTROL HAZARD */
        if (
          activeHazard === 'control' &&
          inst.id === 5 &&
          inst.currentStage === 0
        ) {
          return {
            ...inst,
            type: 'NOP',
            isStalled: true,
            color: '#ff007f',
          };
        }

        if (nextStage > 4) {
          nextStage = 0;
        }

        return {
          ...inst,
          currentStage: nextStage,
          isStalled: false,
        };
      });
    });
  };

  /* =========================================================
     RESET PIPELINE
     ========================================================= */

  const resetPipeline = () => {
    // Stop automatic simulation
    setIsPlaying(false);

    // Reset clock
    setCycleCount(1);

    // Reset hazard and selection
    setActiveHazard('none');
    setSelectedStage(null);

    // Restore the EXACT initial pipeline layout
    setInstructions([
      {
        id: 1,
        name: 'Instr 1 (ADD)',
        type: 'ADD',
        currentStage: 4,
        color: '#00f3ff',
        cycleStarted: 1,
        isStalled: false,
        isForwarded: false,
      },
      {
        id: 2,
        name: 'Instr 2 (SUB)',
        type: 'SUB',
        currentStage: 3,
        color: '#3b82f6',
        cycleStarted: 2,
        isStalled: false,
        isForwarded: false,
      },
      {
        id: 3,
        name: 'Instr 3 (LOAD)',
        type: 'LOAD',
        currentStage: 2,
        color: '#a855f7',
        cycleStarted: 3,
        isStalled: false,
        isForwarded: false,
      },
      {
        id: 4,
        name: 'Instr 4 (STORE)',
        type: 'STORE',
        currentStage: 1,
        color: '#ff007f',
        cycleStarted: 4,
        isStalled: false,
        isForwarded: false,
      },
      {
        id: 5,
        name: 'Instr 5 (BRANCH)',
        type: 'BRANCH',
        currentStage: 0,
        color: '#10b981',
        cycleStarted: 5,
        isStalled: false,
        isForwarded: false,
      },
    ]);
  };

  /* =========================================================
     CACHE EVICTION
     ========================================================= */

  const handleTriggerEviction = () => {
    soundFx.playHazard();

    let victim = 0;

    if (replacementPolicy === 'fifo') {
      victim = cacheLines.reduce(
        (minIdx, item, idx, arr) =>
          item.insertionOrder <
            arr[minIdx].insertionOrder
            ? idx
            : minIdx,
        0
      );
    } else if (replacementPolicy === 'lru') {
      victim = cacheLines.reduce(
        (minIdx, item, idx, arr) =>
          item.lastAccessCycle <
            arr[minIdx].lastAccessCycle
            ? idx
            : minIdx,
        0
      );
    } else if (replacementPolicy === 'lfu') {
      victim = cacheLines.reduce(
        (minIdx, item, idx, arr) =>
          item.frequency <
            arr[minIdx].frequency
            ? idx
            : minIdx,
        0
      );
    } else {
      victim = Math.floor(
        Math.random() * cacheLines.length
      );
    }

    setVictimIndex(victim);

    setTimeout(() => {
      setCacheLines((prev) =>
        prev.map((line, idx) =>
          idx === victim
            ? {
              ...line,
              tag: `0x${Math.floor(
                Math.random() * 255
              )
                .toString(16)
                .toUpperCase()}`,
              lastAccessCycle: cycleCount,
              frequency: 1,
              insertionOrder: cycleCount,
            }
            : line
        )
      );
    }, 1200);
  };

  /* =========================================================
     PIPELINE POPUP
     ========================================================= */

  const handleSelectStagePopup = (
    stageId: string
  ) => {
    const data =
      PIPELINE_STAGE_DATA[stageId];

    if (data) {
      soundFx.playClick();
      setModalData(data);
    }
  };

  /* =========================================================
     CACHE HIERARCHY POPUP
     ========================================================= */

  const handleSelectHierarchyLevelPopup = (
    levelId: string
  ) => {
    const level =
      CACHE_HIERARCHY_DATA[levelId];

    if (level) {
      soundFx.playClick();

      setModalData({
        title: level.name,
        category: 'Cache Memory Hierarchy Level',
        definition: level.description,
        purpose: `High-speed temporary storage buffer. Speed: ${level.speed}`,
        analogy: level.analogy,
        advantages: [
          `Ultra-low latency (${level.latency})`,
          `Associativity: ${level.associativity}`,
        ],
        disadvantages: [
          `Higher power consumption (${level.powerConsumption})`,
          `Limited memory capacity (${level.capacity})`,
        ],
        cycleTiming: level.latency,
        memorySize: level.capacity,
        example: `Access Time: ${level.accessTime} | Power: ${level.powerConsumption}`,
      });
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      className="
        relative
        w-screen
        h-screen
        overflow-hidden
        bg-slate-950
        text-white
        font-sans
        select-none
      "
    >

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <Navbar
        currentSection={currentSection}
        onSelectSection={(section) => {
          setCurrentSection(section);

          if (section === 'hazards') {
            setActiveHazard('data');
          }
        }}
        isExploded={isExploded}
        onToggleExploded={() =>
          setIsExploded(!isExploded)
        }
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;

          setSoundEnabled(next);
          soundFx.setEnabled(next);
        }}
        quizScore={quizScore}
      />

      {/* =====================================================
          3D CANVAS
          ===================================================== */}

      <div className="absolute inset-0 z-0">
        <Canvas
          gl={{
            antialias: true,
            alpha: false,
          }}
          camera={{
            position: [0, 2, 18],
            fov: 65,
          }}
        >
          <OrbitControls
            makeDefault
            enableZoom
            maxDistance={30}
            minDistance={4}
          />

          <ambientLight intensity={0.6} />

          <pointLight
            position={[10, 10, 10]}
            intensity={1.5}
            color="#00f3ff"
          />

          <pointLight
            position={[-10, -10, -10]}
            intensity={1.2}
            color="#a855f7"
          />

          {/* Background */}

          <SceneBackground />

          {/* =================================================
              LANDING
              ================================================= */}

          {currentSection === 'landing' && (
            <CpuChipModel
              isExploded={isExploded}
              onSelectComponent={(name) => {
                soundFx.playClick();

                setModalData({
                  title: name,
                  category:
                    'CPU Hardware Component',
                  definition:
                    'Core silicon processing chip housing billions of transistors.',
                  purpose:
                    'Executes instructions and manages cache memory hierarchy.',
                  analogy:
                    'The central engine of a supercomputer.',
                  advantages: [
                    'Sub-nanosecond clock speed',
                    'Direct silicon interconnects',
                  ],
                  disadvantages: [
                    'High thermal density requiring cooling heatsinks',
                  ],
                  cycleTiming:
                    '0.22 ns @ 4.5 GHz',
                  example:
                    'x86-64 / ARM64 Instruction Execution Engine',
                });
              }}
            />
          )}

          {/* =================================================
              PIPELINE / HAZARDS
              ================================================= */}

          {(currentSection === 'pipeline' ||
            currentSection === 'hazards') && (
              <PipelineScene
                instructions={instructions}
                activeHazard={activeHazard}
                selectedStage={selectedStage}
                onSelectStage={(stageId) => {
                  setSelectedStage(stageId);
                  handleSelectStagePopup(stageId);
                }}
              />
            )}

          {/* =================================================
              CACHE HIERARCHY
              ================================================= */}

          {currentSection === 'hierarchy' && (
            <CacheHierarchyScene
              selectedLevel={null}
              onSelectLevel={
                handleSelectHierarchyLevelPopup
              }
            />
          )}

          {/* =================================================
              CACHE HIT / MISS
              ================================================= */}

          {currentSection === 'hitmiss' && (
            <CacheHitMissScene
              mode={hitMissMode}
              isSimulating={
                isHitMissSimulating
              }
              stepProgress={
                hitMissProgress
              }
            />
          )}

          {/* =================================================
              CACHE MAPPING
              ================================================= */}

          {currentSection === 'mapping' && (
            <CacheMappingScene
              mappingType={mappingType}
              addressInfo={addressBreakdown}
            />
          )}

          {/* =================================================
              CACHE REPLACEMENT
              ================================================= */}

          {currentSection === 'replacement' && (
            <CacheReplacementScene
              policy={replacementPolicy}
              lines={cacheLines}
              victimIndex={victimIndex}
              onSimulateAccess={(idx) => {
                soundFx.playStep();

                setCacheLines((prev) =>
                  prev.map((line, i) =>
                    i === idx
                      ? {
                        ...line,
                        frequency:
                          line.frequency + 1,
                        lastAccessCycle:
                          cycleCount,
                      }
                      : line
                  )
                );
              }}
            />
          )}

          {/* =================================================
              MEMORY SPEED RACE
              ================================================= */}

          {currentSection === 'race' && (
            <MemorySpeedRaceScene
              isRacing={isRacing}
            />
          )}
        </Canvas>
      </div>
      {currentSection === 'process' && (
        <ProcessWorking />
      )}

      {/* =====================================================
          FOREGROUND UI LAYER

          IMPORTANT:
          The parent remains pointer-events-none so the
          3D canvas remains clickable.

          Individual UI controls use pointer-events-auto.
          ===================================================== */}

      <div
        className="
          relative
          z-10
          pointer-events-none
          w-full
          h-full
        "
      >

        {/* ===================================================
            LANDING OVERLAY
            =================================================== */}

        {currentSection === 'landing' && (
          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              p-6
              text-center
              pointer-events-auto
            "
          >
            <div
              className="
                glass-panel-glow
                p-8
                rounded-3xl
                max-w-3xl
                border-cyan-500/40
                shadow-[0_0_60px_rgba(0,243,255,0.25)]
                animate-float-slow
              "
            >
              <span
                className="
                  text-xs
                  font-mono
                  text-cyan-400
                  font-bold
                  uppercase
                  tracking-widest
                  px-3
                  py-1
                  rounded-full
                  bg-cyan-500/10
                  border
                  border-cyan-500/30
                  mb-4
                  inline-block
                "
              >
                ⚡ Interactive 3D Architecture Visualizer
              </span>

              <h1
                className="
                  text-3xl
                  md:text-5xl
                  font-extrabold
                  text-white
                  font-mono
                  tracking-tight
                  mb-4
                  text-glow-cyan
                "
              >
                CPU Pipeline & Cache Memory
              </h1>

              <p
                className="
                  text-slate-300
                  text-sm
                  md:text-base
                  max-w-xl
                  mx-auto
                  mb-8
                  font-sans
                  leading-relaxed
                "
              >
                Understand processor instruction execution,
                pipeline hazards, multi-level cache hits vs
                misses, address decoding, and eviction policies
                through immersive zero-g 3D simulations.
              </p>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setCurrentSection('pipeline');
                }}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-600
                  to-purple-600
                  text-white
                  font-mono
                  font-bold
                  text-sm
                  flex
                  items-center
                  space-x-3
                  mx-auto
                  shadow-[0_0_30px_rgba(0,243,255,0.5)]
                  hover:scale-105
                  transition-all
                  group
                  cursor-pointer
                "
              >
                <span>
                  ENTER SIMULATION LAB
                </span>

                <ArrowRight
                  className="
                    w-5
                    h-5
                    group-hover:translate-x-1
                    transition-transform
                  "
                />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            PIPELINE / HAZARD CONTROLS

            Scrollable UI container.
            =================================================== */}

        {(currentSection === 'pipeline' ||
          currentSection === 'hazards') && (
            <div
              className="
              absolute
              top-20
              left-0
              right-0
              bottom-0
              pointer-events-none
              overflow-hidden
            "
            >
              <div
                className="
                absolute
                bottom-8
                left-1/2
                -translate-x-1/2
                pointer-events-auto
                max-w-[calc(100vw-2rem)]
                max-h-[calc(100vh-7rem)]
                overflow-y-auto
                overflow-x-hidden
                overscroll-contain
                p-2
              "
              >
                <PipelineControls
                  isPlaying={isPlaying}
                  onTogglePlay={() =>
                    setIsPlaying(!isPlaying)
                  }
                  onStepNext={
                    advancePipelineStep
                  }
                  onReset={resetPipeline}
                  speed={simSpeed}
                  onChangeSpeed={setSimSpeed}
                  activeHazard={activeHazard}
                  onSelectHazard={(hazard) =>
                    setActiveHazard(hazard)
                  }
                  cycleCount={cycleCount}
                />
              </div>
            </div>
          )}

        {/* ===================================================
            CACHE HIT / MISS CONTROLS
            =================================================== */}

        {currentSection === 'hitmiss' && (
          <div
            className="
              absolute
              bottom-8
              left-1/2
              -translate-x-1/2
              pointer-events-auto
              flex
              items-center
              space-x-4
              glass-panel-glow
              px-6
              py-4
              rounded-2xl
              border-cyan-500/30
            "
          >
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setHitMissMode('hit');
                setIsHitMissSimulating(true);
                setHitMissProgress(0);
              }}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-emerald-500/20
                text-emerald-300
                border
                border-emerald-500/50
                font-mono
                text-xs
                font-bold
                flex
                items-center
                space-x-2
                hover:bg-emerald-500/30
                cursor-pointer
              "
            >
              <Zap className="w-4 h-4 text-emerald-400" />

              <span>
                SIMULATE CACHE HIT
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setHitMissMode('miss');
                setIsHitMissSimulating(true);
                setHitMissProgress(0);
              }}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-pink-500/20
                text-pink-300
                border
                border-pink-500/50
                font-mono
                text-xs
                font-bold
                flex
                items-center
                space-x-2
                hover:bg-pink-500/30
                cursor-pointer
              "
            >
              <ShieldAlert
                className="
                  w-4
                  h-4
                  text-pink-400
                "
              />

              <span>
                SIMULATE CACHE MISS
              </span>
            </button>
          </div>
        )}

        {/* ===================================================
            CACHE MAPPING CONTROLS
            =================================================== */}

        {currentSection === 'mapping' && (
          <div
            className="
              absolute
              top-20
              left-1/2
              -translate-x-1/2
              pointer-events-auto
              w-full
              max-w-xl
              px-4
              max-h-[calc(100vh-6rem)]
              overflow-y-auto
              overscroll-contain
            "
          >
            <div
              className="
                flex
                justify-center
                space-x-2
                mb-3
                flex-wrap
                gap-2
              "
            >
              {[
                {
                  id: 'direct',
                  label: 'Direct Mapped',
                },
                {
                  id: 'set-associative',
                  label: 'Set Associative',
                },
                {
                  id: 'fully-associative',
                  label: 'Fully Associative',
                },
              ].map((mapping) => (
                <button
                  type="button"
                  key={mapping.id}
                  onClick={() => {
                    soundFx.playClick();

                    setMappingType(
                      mapping.id as CacheMappingType
                    );
                  }}
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    text-xs
                    font-mono
                    transition-all
                    cursor-pointer
                    ${mappingType === mapping.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                      : 'glass-panel text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {mapping.label}
                </button>
              ))}
            </div>

            <CacheAddressDecoder
              mappingType={mappingType}
              onAddressChange={
                setAddressBreakdown
              }
            />
          </div>
        )}

        {/* ===================================================
            CACHE REPLACEMENT CONTROLS
            =================================================== */}

        {currentSection === 'replacement' && (
          <div
            className="
              absolute
              bottom-8
              left-1/2
              -translate-x-1/2
              pointer-events-auto
              flex
              items-center
              space-x-4
              glass-panel-glow
              px-6
              py-4
              rounded-2xl
              border-purple-500/30
              max-w-[calc(100vw-2rem)]
              overflow-x-auto
            "
          >
            <span
              className="
                text-xs
                font-mono
                text-slate-400
              "
            >
              Policy:
            </span>

            {(
              [
                'lru',
                'fifo',
                'lfu',
                'random',
              ] as ReplacementPolicyType[]
            ).map((policy) => (
              <button
                type="button"
                key={policy}
                onClick={() => {
                  soundFx.playClick();
                  setReplacementPolicy(policy);
                  setVictimIndex(null);
                }}
                className={`
                  px-3
                  py-1.5
                  rounded-lg
                  text-xs
                  font-mono
                  uppercase
                  cursor-pointer
                  ${replacementPolicy === policy
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/60'
                    : 'glass-panel text-slate-400'
                  }
                `}
              >
                {policy}
              </button>
            ))}

            <button
              type="button"
              onClick={
                handleTriggerEviction
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-gradient-to-r
                from-pink-500
                to-purple-600
                text-white
                font-mono
                text-xs
                font-bold
                shadow-[0_0_15px_rgba(255,0,127,0.4)]
                cursor-pointer
              "
            >
              TRIGGER EVICTION
            </button>
          </div>
        )}

        {/* ===================================================
            PERFORMANCE DASHBOARD
            =================================================== */}

        {currentSection === 'performance' && (
          <div
            className="
              absolute
              top-20
              left-0
              right-0
              bottom-0
              pointer-events-auto
              max-h-[85vh]
              overflow-y-auto
              overscroll-contain
              px-4
              pb-8
            "
          >
            <HolographicDashboard
              hitCount={hitCount}
              missCount={missCount}
              totalCycles={
                cycleCount * 12
              }
            />
          </div>
        )}

        {/* ===================================================
            SPEED RACE
            =================================================== */}

        {currentSection === 'race' && (
          <div
            className="
              absolute
              bottom-8
              left-1/2
              -translate-x-1/2
              pointer-events-auto
              glass-panel-glow
              px-6
              py-4
              rounded-2xl
              border-cyan-500/30
              text-center
              font-mono
            "
          >
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsRacing(!isRacing);
              }}
              className="
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-bold
                text-xs
                flex
                items-center
                space-x-2
                mx-auto
                shadow-[0_0_20px_rgba(0,243,255,0.4)]
                cursor-pointer
              "
            >
              {isRacing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}

              <span>
                {isRacing
                  ? 'PAUSE SPEED RACE'
                  : 'START MEMORY WALL RACE'}
              </span>
            </button>

            <p
              className="
                text-[11px]
                text-slate-400
                mt-2
              "
            >
              Visualizing latency gap:
              CPU Registers (0.3ns) vs DDR5 RAM
              (70ns) vs NVMe SSD (50,000ns)
            </p>
          </div>
        )}

        {/* ===================================================
            QUIZ
            =================================================== */}

        {currentSection === 'quiz' && (
          <div
            className="
              absolute
              inset-0
              pt-24
              pb-8
              px-4
              pointer-events-auto
              overflow-y-auto
              flex
              items-center
              justify-center
            "
          >
            <QuizModal
              onScoreUpdate={(score) =>
                setQuizScore(score)
              }
            />
          </div>
        )}

        {/* ===================================================
            EDUCATIONAL POPUP
            =================================================== */}

        <EducationalModal
          data={modalData}
          onClose={() =>
            setModalData(null)
          }
        />
      </div>
    </div>
  );
}