CPU 3D Lab
Interactive 3D CPU Pipelining & Cache Architecture Visualization

CPU 3D Lab is an interactive educational web application designed to visualize CPU pipeline execution, pipeline hazards, cache architecture, cache hit/miss behavior, cache mapping, cache replacement, memory hierarchy, and memory access speed using interactive 3D visualizations.

The project combines React, TypeScript, Three.js, React Three Fiber, and Vite to create a visual environment where computer architecture concepts can be explored rather than only read as theory.

📌 Project Overview

Computer architecture concepts such as CPU pipelining and cache memory can be difficult to understand through diagrams and static textbook explanations.

CPU 3D Lab provides an interactive visualization environment where users can observe how instructions move through CPU pipeline stages and how memory requests travel through different levels of the cache hierarchy.

The application represents important architecture concepts using:

3D CPU pipeline stages
Animated instruction packets
Cache hierarchy structures
Cache hit and cache miss animations
Cache address decomposition
Cache mapping visualization
Cache replacement visualization
Memory-speed comparisons
Pipeline hazard visualization
Interactive educational explanations
Quiz and scoring features

🎯 Objectives

The main objectives of CPU 3D Lab are:

Visualize CPU pipeline execution in 3D.
Demonstrate the five major pipeline stages.
Explain how instructions move between pipeline stages.
Demonstrate pipeline hazards.
Visualize cache hierarchy.
Demonstrate cache hit and cache miss operations.
Explain cache address fields such as:
Tag
Index
Offset
Demonstrate different cache mapping techniques.
Visualize cache replacement and eviction.
Compare memory access speeds.
Provide interactive educational explanations.
Make computer architecture concepts easier to understand through visualization.

🧠 CPU Pipeline

The project models the classical five-stage instruction pipeline:

IF → ID → EX → MEM → WB

Where:

Stage	Name	Description
IF	Instruction Fetch	Fetches the instruction from memory
ID	Instruction Decode	Decodes the instruction and identifies required operands
EX	Execute	Performs arithmetic, logical, or control operations
MEM	Memory Access	Performs memory read/write operations
WB	Write Back	Writes the result back to the register file
Example

The visualization can represent instructions such as:

Instr 1 → ADD
Instr 2 → SUB
Instr 3 → LOAD
Instr 4 → STORE
Instr 5 → BRANCH

Instructions are displayed as animated 3D objects moving through the pipeline.

⚙️ Pipeline Simulation

The pipeline simulator provides controls for stepping through CPU cycles.

Available controls
PLAY
PAUSE
NEXT / STEP
RESET
SPEED
PLAY

Starts automatic pipeline execution.

PAUSE

Stops automatic execution while preserving the current state.

NEXT

Advances the pipeline by one clock cycle.

RESET

Restores the pipeline to its initial state.

The reset operation restores:

Clock Cycle → 1
Hazard → Clean
Selected Stage → None
Pipeline Instructions → Initial State

🚨 Pipeline Hazards

The project provides visualization for common pipeline hazards.

1. Data Hazard

A data hazard occurs when an instruction depends on the result of an earlier instruction that has not completed.

The visualization can demonstrate a data forwarding path between pipeline stages.

Conceptually:

Instruction A
      ↓
   produces
     data
      ↓
Instruction B
      ↑
  forwarding

The interface displays a forwarding path when the data hazard is active.

2. Control Hazard

A control hazard can occur when the CPU encounters a branch instruction and the next instruction is uncertain.

The project visualizes:

BRANCH
   ↓
Branch Misprediction
   ↓
Pipeline Flush

The visualization displays a branch-misprediction indicator and pipeline-flush effect.

3. Structural Hazard

A structural hazard occurs when multiple instructions require the same hardware resource at the same time.

The project provides a structural hazard mode for demonstrating this situation.

💾 Cache Architecture

CPU 3D Lab also provides interactive cache visualizations.

The basic hierarchy is:

CPU
 ↓
L1 Cache
 ↓
L2 Cache
 ↓
L3 Cache
 ↓
RAM

The visualization represents the increasing distance and access latency between the CPU and memory.

⚡ Cache Hit

A cache hit occurs when the requested data is already present in the required cache level.

Example:

CPU
 ↓
L1 Cache
 ↓
DATA FOUND
 ↓
CPU

The project visually demonstrates the request travelling from the CPU to the cache and returning with the requested data.

A successful hit is represented using a positive visual indication.

❌ Cache Miss

A cache miss occurs when the requested data cannot be found at the required cache level.

The request may travel deeper into the memory hierarchy:

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
Data returned
 ↓
CPU

The project uses animation to demonstrate this additional memory traversal and its higher latency.

🧩 Cache Address Translation

The project contains an interactive cache address decoder.

A hexadecimal address can be entered, for example:

4A8F

The address is converted into binary:

0100101010001111

The binary address is then divided into fields depending on the selected cache mapping technique.

🔢 Address Fields

A cache address can contain:

TAG | INDEX | OFFSET
Tag

The tag identifies the memory block associated with the cache entry.

Index

The index identifies the cache line or set where the block can be located.

Offset

The offset identifies the specific byte/location within the selected block.

The application visually displays these fields to help users understand cache address decomposition.

🗂️ Cache Mapping

The project provides visualization for different cache mapping techniques.

Direct Mapping

In direct mapping, each memory block can map to exactly one cache location.

Conceptually:

Memory Block
     ↓
 Index
     ↓
Cache Line
Set-Associative Mapping

In set-associative mapping, a memory block maps to a particular set but can occupy one of multiple lines within that set.

Memory Block
     ↓
    Set
     ↓
 ┌───────┐
 │ Line 1│
 │ Line 2│
 └───────┘
Fully Associative Mapping

In fully associative mapping, a memory block can be placed in any available cache line.

Memory Block
      ↓
Any Cache Line
🔄 Cache Replacement

When a cache is full and new data needs to be inserted, an existing cache entry may need to be replaced.

The project contains a cache replacement visualization to demonstrate this process.

The visualization helps explain:

Cache Full
    ↓
Replacement Decision
    ↓
Old Block Evicted
    ↓
New Block Inserted
🏎️ Memory Speed Visualization

The project also contains a memory-speed visualization that demonstrates the difference between different memory levels.

Conceptually:

CPU Registers
     ↓
L1 Cache
     ↓
L2 Cache
     ↓
L3 Cache
     ↓
RAM

As the distance from the CPU increases, memory access generally becomes slower.

This visualization helps users understand why caches are important for CPU performance.

🧱 3D Visualization

The application uses WebGL-based 3D rendering.

Major 3D components include:

PipelineScene
CacheHitMissScene
CacheMappingScene
CacheHierarchyScene
CacheReplacementScene
MemorySpeedRaceScene
SceneBackground

These components are responsible for rendering the different computer architecture concepts.

🛠️ Technologies Used
Frontend
React
TypeScript
Vite
3D Visualization
Three.js
React Three Fiber
React Three Drei
UI
Tailwind CSS
Lucide React
Framer Motion
Development
Node.js
npm
Git
GitHub
Deployment
Vercel
📁 Project Structure
CPU-3D-LAB/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   │
│   │   ├── 3d/
│   │   │   ├── CacheHierarchyScene.tsx
│   │   │   ├── CacheHitMissScene.tsx
│   │   │   ├── CacheMappingScene.tsx
│   │   │   ├── CacheReplacementScene.tsx
│   │   │   ├── CpuChipModel.tsx
│   │   │   ├── MemorySpeedRaceScene.tsx
│   │   │   ├── PipelineScene.tsx
│   │   │   └── SceneBackground.tsx
│   │   │
│   │   └── ui/
│   │       ├── CacheAddressDecoder.tsx
│   │       ├── EducationalModal.tsx
│   │       ├── HolographicDashboard.tsx
│   │       ├── Navbar.tsx
│   │       ├── PipelineControls.tsx
│   │       └── QuizModal.tsx
│   │
│   ├── data/
│   │
│   ├── utils/
│   │   └── soundEffects.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .gitignore
└── README.md
🔄 Application Workflow

The general workflow of the application is:

                 CPU 3D LAB
                     │
          ┌──────────┴──────────┐
          │                     │
     CPU Pipeline          Cache System
          │                     │
     ┌────┴────┐         ┌──────┴──────┐
     │         │         │             │
 Pipeline   Hazards    Hit/Miss     Cache Types
     │         │         │             │
 IF → ID → EX → MEM → WB       Mapping / Replacement
     │
     ↓
 Interactive 3D Visualization
🖥️ Installation
Prerequisites

Install the following before running the project:

Node.js
npm
Git

Check Node.js:

node --version

Check npm:

npm --version
📥 Clone the Repository

Clone the project from GitHub:

git clone https://github.com/mbharath123/CPU-3D-LAB.git

Enter the project directory:

cd CPU-3D-LAB
📦 Install Dependencies

Run:

npm install

This installs the dependencies specified in:

package.json
▶️ Run the Development Server

Start the Vite development server:

npm run dev

The terminal will provide a local URL similar to:

http://localhost:5173/

Open the URL in a browser.

🏗️ Build for Production

To create a production build:

npm run build

The production files are generated in:

dist/
👀 Preview Production Build

After building:

npm run preview
🌐 Deployment

The project can be deployed using Vercel.

Deployment Process
Local Project
     ↓
Git
     ↓
GitHub
     ↓
Vercel
     ↓
Production Website
1. Commit changes
git add .
2. Create a commit
git commit -m "Update CPU 3D Lab"
3. Push to GitHub
git push
4. Vercel

Connect the GitHub repository to Vercel.

Vercel automatically builds and deploys the application after changes are pushed to the repository.

🧪 Testing the Application

After starting the application, test the following features.

CPU Pipeline
Open CPU Pipeline.
Check the five pipeline stages.
Click different stages.
Click NEXT.
Check clock-cycle progression.
Click PLAY.
Click PAUSE.
Change simulation speed.
Select different hazards.
Click RESET.

Expected pipeline stages:

IF → ID → EX → MEM → WB
Cache Hit/Miss

Test:

Cache Hit
Cache Miss

Verify that the request packet moves through the expected cache hierarchy.

Cache Mapping

Test:

Direct Mapping
Set-Associative Mapping
Fully Associative Mapping

Enter different hexadecimal addresses and observe the address decomposition.

Cache Replacement

Check the replacement visualization and verify that cache entries change according to the selected replacement behavior.

Memory Speed

Check the visualization of memory hierarchy and relative access speed.

🎮 User Controls
Control	Purpose
Play	Starts automatic simulation
Pause	Stops simulation
Next	Advances one clock cycle
Reset	Restores initial state
Speed	Changes simulation speed
Clean	Clears active hazard
RAW Data	Demonstrates data hazard
Branch	Demonstrates control hazard
Structural	Demonstrates structural hazard
Stage Selection	Displays stage information
Cache Hit	Demonstrates successful cache lookup
Cache Miss	Demonstrates memory traversal
🎓 Educational Purpose

CPU 3D Lab is designed primarily as an educational visualization tool.

It helps learners understand:

Instruction pipelining
CPU pipeline stages
Clock cycles
Pipeline hazards
Data forwarding
Branch misprediction
Pipeline flushing
Cache hierarchy
Cache hit
Cache miss
Cache mapping
Cache address decomposition
Cache replacement
Memory hierarchy
Memory access latency

Instead of relying only on static diagrams, the application provides an interactive environment where users can observe the concepts dynamically.

🧮 Example Pipeline Execution

Suppose the processor has:

ADD
SUB
LOAD
STORE
BRANCH

The instructions pass through:

IF → ID → EX → MEM → WB

A simplified pipeline schedule can be represented as:

Cycle     IF       ID       EX       MEM      WB

1         ADD
2         SUB      ADD
3         LOAD     SUB      ADD
4         STORE    LOAD     SUB      ADD
5         BRANCH   STORE    LOAD     SUB      ADD

This demonstrates the fundamental advantage of pipelining: multiple instructions can occupy different stages simultaneously.

🚨 Hazard Demonstration Flow
Data Hazard
Instruction 1
      ↓
 produces result
      ↓
Instruction 2 requires result
      ↓
Forwarding / Stall
Control Hazard
Branch Instruction
       ↓
Branch Prediction
       ↓
Prediction Incorrect
       ↓
Flush Pipeline
       ↓
Continue Correct Path
Structural Hazard
Instruction A ──┐
                ├── Same Hardware Resource
Instruction B ──┘
                ↓
        Structural Hazard
        
💡 Why 3D Visualization?

Traditional architecture diagrams are usually static.

CPU 3D Lab uses animation and 3D objects to show:

Movement
   +
Timing
   +
Pipeline Stages
   +
Memory Hierarchy
   +
Hazards

This makes it easier to understand how computer architecture concepts behave over time.

🔊 Interactive Features

The application also supports interactive UI feedback and sound effects for selected simulation events.

The project uses a utility module for sound-related interactions:

src/utils/soundEffects.ts
📚 Learning Outcomes

After using CPU 3D Lab, a learner should be able to explain:

What CPU pipelining is.
The purpose of IF, ID, EX, MEM, and WB.
How instructions overlap during execution.
What a clock cycle represents.
What pipeline hazards are.
How data forwarding helps resolve data hazards.
Why branch misprediction causes pipeline flushing.
What cache memory is.
Why L1, L2, and L3 caches exist.
The difference between cache hit and cache miss.
How cache addresses are divided into tag, index, and offset.
How direct mapping works.
How set-associative mapping works.
How fully associative mapping works.
Why cache replacement is required.
Why cache access is faster than RAM access.
🔮 Future Enhancements

Possible future improvements include:

More realistic CPU instruction scheduling
Additional instruction types
Advanced branch prediction algorithms
More cache replacement algorithms
LRU visualization
FIFO visualization
Random replacement visualization
Detailed cache statistics
Pipeline performance graphs
CPI calculation
Throughput calculation
Execution-time comparison
Interactive architecture quizzes
Mobile-responsive 3D controls
More detailed CPU datapath visualization
Persistent simulation history
Performance analytics dashboard
🐛 Known Development Considerations

The project uses WebGL-based 3D rendering, so performance may depend on the user's GPU and browser.

For development:

npm run build

should be run before deployment to catch TypeScript or production-build problems.

External 3D fonts/resources should also be tested in the deployment environment rather than relying only on local development behavior.

👨‍💻 Development Workflow

The recommended development workflow is:

1. Modify code
       ↓
2. Run application
       ↓
3. Test feature
       ↓
4. Check browser console
       ↓
5. Run production build
       ↓
6. git add .
       ↓
7. git commit
       ↓
8. git push
       ↓
9. Vercel deployment
       ↓
10. Test production website

Local development
 npm run dev
Production validation
 npm run build
Git workflow
git add .
git commit -m "Describe your change"
git push
📄 License

This project is intended for educational and academic purposes.

Add your preferred license here if your institution requires one.

⭐ Project

CPU 3D Lab

Interactive 3D visualization of CPU pipelining and cache architecture.

Built with React + TypeScript + Three.js + React Three Fiber + Vite.
