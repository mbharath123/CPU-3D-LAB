export type SectionId = 
  | 'landing' 
  | 'pipeline' 
  | 'hazards' 
  | 'hierarchy' 
  | 'hitmiss' 
  | 'mapping' 
  | 'replacement' 
  | 'performance' 
  | 'race' 
  | 'quiz'
  | 'process';

export interface PipelineStageInfo {
  id: string;
  name: string;
  shortName: string;
  purpose: string;
  inputs: string;
  outputs: string;
  registers: string[];
  color: string;
  iconName: string;
}

export interface PipelineInstruction {
  id: number;
  name: string;
  type: 'ADD' | 'SUB' | 'LOAD' | 'STORE' | 'BRANCH' | 'NOP';
  currentStage: number; // 0: IF, 1: ID, 2: EX, 3: MEM, 4: WB, -1: Not fetched, 5: Completed
  color: string;
  isStalled?: boolean;
  isForwarded?: boolean;
  cycleStarted: number;
}

export type HazardType = 'none' | 'data' | 'control' | 'structural';

export interface CacheLevelInfo {
  id: string;
  name: string;
  capacity: string;
  latency: string;
  speed: string;
  associativity: string;
  accessTime: string;
  powerConsumption: string;
  color: string;
  description: string;
  analogy: string;
}

export type CacheMappingType = 'direct' | 'set-associative' | 'fully-associative';

export type ReplacementPolicyType = 'fifo' | 'lru' | 'lfu' | 'random';

export interface CacheLineData {
  index: number;
  valid: boolean;
  tag: string;
  data: string;
  lastAccessCycle: number;
  frequency: number;
  insertionOrder: number;
  isVictim?: boolean;
}

export interface AddressBreakdown {
  addressHex: string;
  addressBin: string;
  tagBits: string;
  indexBits: string;
  offsetBits: string;
  calculatedIndex: number;
  calculatedTagHex: string;
}

export interface QuizQuestion {
  id: number;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationalComponentData {
  title: string;
  category: string;
  definition: string;
  purpose: string;
  analogy: string;
  advantages: string[];
  disadvantages: string[];
  cycleTiming: string;
  memorySize?: string;
  speedComparison?: string;
  formula?: string;
  example: string;
}
