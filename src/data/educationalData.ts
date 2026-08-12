import type { EducationalComponentData, QuizQuestion, CacheLevelInfo } from '../types';

export const CACHE_HIERARCHY_DATA: Record<string, CacheLevelInfo> = {
  cpu: {
    id: 'cpu',
    name: 'CPU Core Registers',
    capacity: '1 KB (64 - 128 Registers)',
    latency: '0.3 ns (0.5 - 1 Clock Cycle)',
    speed: '4.5 GHz+ (Direct Silicon Speed)',
    associativity: 'Direct Register File',
    accessTime: '< 0.5 ns',
    powerConsumption: '0.05 W',
    color: '#00f3ff',
    description: 'Ultra-fast memory locations inside the CPU core used directly by the ALU during arithmetic & logical execution.',
    analogy: 'The workbench surface right in front of your hands.'
  },
  l1: {
    id: 'l1',
    name: 'L1 Cache (Instruction & Data)',
    capacity: '64 KB - 128 KB per core',
    latency: '1.0 ns (3 - 4 Clock Cycles)',
    speed: '3.5 TB/s',
    associativity: '8-Way Set Associative',
    accessTime: '1.2 ns',
    powerConsumption: '0.8 W',
    color: '#3b82f6',
    description: 'Extremely fast SRAM built directly into each processor core. Split into L1i (Instruction) and L1d (Data).',
    analogy: 'The desk drawer under your workstation.'
  },
  l2: {
    id: 'l2',
    name: 'L2 Cache',
    capacity: '1 MB - 2 MB per core',
    latency: '3.5 ns (12 - 14 Clock Cycles)',
    speed: '1.8 TB/s',
    associativity: '16-Way Set Associative',
    accessTime: '3.8 ns',
    powerConsumption: '2.5 W',
    color: '#a855f7',
    description: 'Dedicated SRAM for each core with larger capacity to hold instructions and data missed by L1.',
    analogy: 'A bookshelf right next to your workstation.'
  },
  l3: {
    id: 'l3',
    name: 'L3 Cache (Last Level Cache)',
    capacity: '32 MB - 256 MB (Shared)',
    latency: '12 ns (40 - 50 Clock Cycles)',
    speed: '800 GB/s',
    associativity: '16-Way to 24-Way Set Associative',
    accessTime: '12.5 ns',
    powerConsumption: '8.0 W',
    color: '#ff007f',
    description: 'Massive shared SRAM pooled across all CPU cores on the chip die. Acts as the final buffer before off-chip RAM access.',
    analogy: 'The office filing cabinet down the hallway.'
  },
  ram: {
    id: 'ram',
    name: 'Main Memory (DDR5 RAM)',
    capacity: '16 GB - 128 GB',
    latency: '60 - 80 ns (200+ Clock Cycles)',
    speed: '64 GB/s (Dual Channel)',
    associativity: 'Directly Addressed Blocks',
    accessTime: '70 ns',
    powerConsumption: '15 W',
    color: '#10b981',
    description: 'High-density volatile Dynamic RAM (DRAM) stored on motherboard DIMMs requiring periodic refresh cycles.',
    analogy: 'The central library across the street.'
  },
  ssd: {
    id: 'ssd',
    name: 'NVMe Solid State Drive',
    capacity: '512 GB - 4 TB',
    latency: '50,000 ns (50 µs / 100,000+ Cycles)',
    speed: '7.5 GB/s (PCIe Gen4/Gen5)',
    associativity: 'Block Storage (NVMe Flash)',
    accessTime: '50 µs',
    powerConsumption: '6 W',
    color: '#f59e0b',
    description: 'Non-volatile NAND Flash memory storing long-term persistent files, OS binaries, and virtual memory swap space.',
    analogy: 'A national warehouse archive in another city.'
  }
};

export const PIPELINE_STAGE_DATA: Record<string, EducationalComponentData> = {
  IF: {
    title: 'Instruction Fetch (IF)',
    category: 'Pipeline Stage 1',
    definition: 'The first stage of instruction execution where the CPU fetches the next instruction binary from L1 Instruction Cache using the Program Counter (PC).',
    purpose: 'Retrieve the 32-bit or 64-bit opcode from memory and increment the PC for the next clock cycle.',
    analogy: 'A chef picking the next recipe card from the order queue.',
    advantages: [
      'Pipelining allows fetching next instruction while current instruction is executing',
      'Uses L1 Instruction Cache to achieve sub-nanosecond fetch speeds'
    ],
    disadvantages: [
      'Branch mispredictions stall the fetch stage',
      'Instruction cache misses delay the entire pipeline'
    ],
    cycleTiming: '1 Clock Cycle (0.22 ns @ 4.5 GHz)',
    example: 'PC = 0x00400004 ➔ Fetch Instruction Word 0x8D090008 (LOAD R1, [R2 + 8])',
    formula: 'Next PC = Current PC + 4 (for 32-bit fixed length instructions)'
  },
  ID: {
    title: 'Instruction Decode (ID) & Register Read',
    category: 'Pipeline Stage 2',
    definition: 'The hardware decoder parses the instruction opcode, identifies source/destination registers, and reads values from the Register File.',
    purpose: 'Translate raw binary opcodes into control signals (ALU operation, Memory Read/Write flag, Register Write back flag).',
    analogy: 'A translator reading the recipe card and getting ingredients ready.',
    advantages: [
      'Allows early hazard detection (RAW data dependencies)',
      'Performs branch address calculation early in 5-stage architectures'
    ],
    disadvantages: [
      'Requires multi-ported register files (2 reads + 1 write simultaneously)',
      'Complex variable-length instruction ISAs (like x86) require heavy decoder silicon'
    ],
    cycleTiming: '1 Clock Cycle (0.22 ns)',
    example: 'Decode Opcode 0x8D ➔ Control Signals: ALU_ADD, RegWrite=1, MemRead=1. Read R2 value = 0x1000.',
    formula: 'Control Signals = Decoder Matrix(Opcode)'
  },
  EX: {
    title: 'Execute / ALU Operation (EX)',
    category: 'Pipeline Stage 3',
    definition: 'The Arithmetic Logic Unit (ALU) performs mathematical calculations, logical operations, or memory address computations.',
    purpose: 'Compute results for ADD/SUB/MUL or calculate effective address for LOAD/STORE instructions.',
    analogy: 'The chef cooking the meal on the stove.',
    advantages: [
      'Dedicated ALU circuits for floating point (FPU) and vector SIMD instructions',
      'Supports Data Forwarding bypass paths directly to ALU input multiplexers'
    ],
    disadvantages: [
      'Complex operations (DIV, Floating-point SQRT) may take multiple execution cycles',
      'High power density and heat dissipation in ALU core'
    ],
    cycleTiming: '1 Clock Cycle (or multi-cycle for FPU)',
    example: 'ALU Operation: Effective Address = R2 (0x1000) + Offset (8) = 0x1008',
    formula: 'Result = ALU_Function(Operand_A, Operand_B)'
  },
  MEM: {
    title: 'Memory Access (MEM)',
    category: 'Pipeline Stage 4',
    definition: 'The stage where instructions that access memory (LOAD and STORE) read or write data to the L1 Data Cache.',
    purpose: 'Interface with memory hierarchy. Non-memory instructions simply pass their ALU result through without delay.',
    analogy: 'Grabbing fresh spices from the pantry shelf.',
    advantages: [
      'Dedicated L1 Data Cache avoids pipeline stalls for cached memory items',
      'Store buffers allow asynchronous write-backs'
    ],
    disadvantages: [
      'Cache misses cause major pipeline stalls (Load Miss Hazard)',
      'Memory bus contention if both IF and MEM access main memory concurrently'
    ],
    cycleTiming: '1 Clock Cycle (L1 Hit) to 200+ Cycles (RAM Miss)',
    example: 'LOAD R1, [0x1008] ➔ Read 64-bit value 0x000000FF from L1 Cache location 0x1008',
    formula: 'ReadData = L1d_Cache[EffectiveAddress]'
  },
  WB: {
    title: 'Write Back (WB)',
    category: 'Pipeline Stage 5',
    definition: 'The final stage of the 5-stage classic RISC pipeline. Writes computed ALU results or memory load data back into the target destination register.',
    purpose: 'Complete instruction execution and update architectural state in the CPU register file.',
    analogy: 'Plating the finished dish on the serving counter for the customer.',
    advantages: [
      'Ensures in-order instruction completion and precise exception handling',
      'Frees pipeline registers for the next instruction stream'
    ],
    disadvantages: [
      'Register file write port write contention if multiple functional units finish simultaneously',
      'Requires strict timing synchronization with ID stage reads'
    ],
    cycleTiming: '1 Clock Cycle (0.22 ns)',
    example: 'Write loaded value 0x000000FF into Register R1',
    formula: 'RegisterFile[DestReg] = WriteBackData'
  }
};

export const EDUCATIONAL_CONCEPTS: Record<string, EducationalComponentData> = {
  dataHazard: {
    title: 'Data Hazards (Read-After-Write / RAW)',
    category: 'Pipeline Hazard',
    definition: 'Occurs when an instruction depends on the result of a previous instruction that has not yet completed its Write-Back stage.',
    purpose: 'Prevent reading stale or incorrect data from registers before updating.',
    analogy: 'Trying to frost a cake before it has finished baking in the oven.',
    advantages: [
      'Resolved efficiently with Data Forwarding (Bypass paths) without stalling',
      'Compiler scheduling (reordering instructions) eliminates raw stalls'
    ],
    disadvantages: [
      'Load-Use hazards cannot be bypassed completely and require a 1-cycle stall bubble',
      'Adds multiplexers and bypass wire complexity to the ALU inputs'
    ],
    cycleTiming: '0 - 1 Stall Bubble Cycle',
    example: 'Instr 1: ADD R1, R2, R3 (R1 ready in EX/MEM) \nInstr 2: SUB R4, R1, R5 (Needs R1 in ID stage)',
    formula: 'Stall Required if (ID_SourceReg == EX_DestReg && EX_MemRead)'
  },
  controlHazard: {
    title: 'Control Hazards (Branch Misprediction)',
    category: 'Pipeline Hazard',
    definition: 'Occurs when the CPU fetches the next instruction before knowing whether a conditional branch instruction will be taken or not.',
    purpose: 'Maintain correct program execution flow during conditional jumps (IF/ELSE, loops).',
    analogy: 'Driving through an intersection before knowing if the signal light turns green or red.',
    advantages: [
      'Branch Predictors (2-bit saturating counter, TAGE predictor) reach >95% accuracy',
      'Branch Target Buffers (BTB) provide zero-cycle branch target fetch'
    ],
    disadvantages: [
      'Mispredictions require flushing 3-4 fetched instructions from the pipeline (Flush Penalty)',
      'Wastes execution power on speculatively executed instructions that get discarded'
    ],
    cycleTiming: '3 - 5 Flush Penalty Cycles',
    example: 'BEQ R1, R2, TargetLocation ➔ Speculatively fetched fallback branch instead of target location',
    formula: 'Flush Penalty = Stages between IF and Branch Resolution'
  },
  structuralHazard: {
    title: 'Structural Hazards (Resource Conflict)',
    category: 'Pipeline Hazard',
    definition: 'Occurs when two separate instructions in different pipeline stages attempt to access the exact same physical hardware resource simultaneously.',
    purpose: 'Avoid hardware bus collision or single-ported memory/ALU conflicts.',
    analogy: 'Two chefs trying to use the only blender in the kitchen at the exact same second.',
    advantages: [
      'Eliminated by hardware duplication (e.g., separate L1 Instruction & L1 Data Caches)',
      'Multi-ported register files allow concurrent reads and writes'
    ],
    disadvantages: [
      'Increases chip die area and transistor count',
      'Occurs in superscalar processors when multiple execution units share buses'
    ],
    cycleTiming: '1 Cycle Resource Lock Stall',
    example: 'IF stage reads L1 Cache while MEM stage reads the same single-ported Cache RAM',
    formula: 'Conflict = (IF_Request && MEM_Request) on Single Bus'
  },
  amat: {
    title: 'Average Memory Access Time (AMAT)',
    category: 'Cache Performance Metric',
    definition: 'The average time required for the CPU to access a memory location, accounting for hits and misses across all cache hierarchy levels.',
    purpose: 'Measure effective memory system speed and evaluate cache architecture efficiency.',
    analogy: 'Calculating your average commute time considering normal traffic vs unexpected highway delays.',
    advantages: [
      'Considers multi-level cache hit rates and miss penalties holistically',
      'Directly correlates with processor CPI (Cycles Per Instruction)'
    ],
    disadvantages: [
      'Does not account for out-of-order execution memory latency hiding',
      'Varies dynamically based on workload spatial and temporal locality'
    ],
    cycleTiming: 'Typical Modern AMAT = 1.2 ns - 3.5 ns',
    example: 'Hit Time L1 = 1ns, Hit Rate L1 = 95%, Miss Penalty RAM = 100ns \nAMAT = 1ns + (0.05 * 100ns) = 6.0 ns',
    formula: 'AMAT = Hit Time + (Miss Rate × Miss Penalty)'
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    section: 'CPU Pipeline',
    question: 'In a standard 5-stage RISC CPU pipeline, in which stage does data forwarding bypass the register file to feed the ALU?',
    options: [
      'Instruction Fetch (IF)',
      'Instruction Decode (ID)',
      'Execute (EX)',
      'Memory Access (MEM)'
    ],
    correctIndex: 2,
    explanation: 'Data forwarding (bypassing) routes the computed result directly from the EX/MEM pipeline register back into the input multiplexer of the ALU in the EX stage, eliminating RAW stalls.'
  },
  {
    id: 2,
    section: 'Pipeline Hazards',
    question: 'What is a "bubble" in a processor pipeline visualizer?',
    options: [
      'A hardware error that crashes the processor core',
      'A NOP (No Operation) inserted to delay instructions and resolve a hazard stall',
      'A floating point operation running in parallel',
      'A cache line replacement request'
    ],
    correctIndex: 1,
    explanation: 'A bubble is a NOP instruction injected into pipeline control registers to stall dependent instructions for one or more clock cycles while waiting for data or branch target resolution.'
  },
  {
    id: 3,
    section: 'Cache Memory',
    question: 'Which level of cache memory is typically shared across ALL CPU cores on a modern processor chip?',
    options: [
      'L1 Instruction Cache',
      'L1 Data Cache',
      'L2 Cache',
      'L3 Cache (Last Level Cache)'
    ],
    correctIndex: 3,
    explanation: 'L3 Cache (LLC) is a massive shared pool of SRAM shared across all CPU cores on the silicon die, serving as the final buffer before accessing off-chip main memory (DRAM).'
  },
  {
    id: 4,
    section: 'Cache Hit & Miss',
    question: 'What is the primary formula for calculating Average Memory Access Time (AMAT)?',
    options: [
      'AMAT = Hit Time + (Miss Rate × Miss Penalty)',
      'AMAT = Hit Rate × Miss Rate × Clock Speed',
      'AMAT = Cache Size / Latency',
      'AMAT = Clock Cycles × Bus Width'
    ],
    correctIndex: 0,
    explanation: 'AMAT = Hit Time + (Miss Rate × Miss Penalty). This formula calculates the average access latency considering both immediate cache hits and the penalty incurred during cache misses.'
  },
  {
    id: 5,
    section: 'Cache Types',
    question: 'In a Direct-Mapped cache, how many possible cache lines can a specific memory address be mapped to?',
    options: [
      'Exactly 1 specific cache line',
      '2 lines (2-way set)',
      'Any available cache line in the entire cache',
      'It depends on the replacement policy'
    ],
    correctIndex: 0,
    explanation: 'In Direct-Mapped cache, each memory block maps to exactly ONE cache line determined by the modulo index calculation: Index = Block Address % Number of Cache Lines.'
  },
  {
    id: 6,
    section: 'Cache Replacement',
    question: 'Which cache replacement policy evicts the block that has not been accessed for the longest period of time?',
    options: [
      'FIFO (First-In, First-Out)',
      'LRU (Least Recently Used)',
      'LFU (Least Frequently Used)',
      'Random Eviction'
    ],
    correctIndex: 1,
    explanation: 'LRU (Least Recently Used) keeps track of read/write access timestamps and evicts the cache block whose last access time is oldest.'
  }
];
