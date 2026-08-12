import React, { useState } from 'react';
import {
  Cpu,
  Workflow,
  Database,
  AlertTriangle,
  Zap,
  RefreshCw,
  Code2,
  Rocket,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProcessCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cyan-500/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            {icon}
          </div>

          <span className="font-mono text-sm font-bold text-white">
            {title}
          </span>
        </div>

        {open ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-cyan-500/10">
          {children}
        </div>
      )}
    </div>
  );
};

const FlowStep: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center text-center min-w-[150px]">
      <div className="w-full rounded-xl border border-cyan-500/30 bg-slate-900/70 px-4 py-4">
        <div className="text-cyan-400 font-mono font-bold text-xs">
          {title}
        </div>

        <div className="text-slate-400 text-[11px] mt-2 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};

export const ProcessWorking: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-y-auto pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs mb-4">
            <Workflow className="w-4 h-4" />
            PROJECT PROCESS & WORKING
          </div>

          <h1 className="text-3xl md:text-5xl font-mono font-bold text-white">
            How CPU 3D Lab Works
          </h1>

          <p className="max-w-3xl mx-auto mt-4 text-sm text-slate-400 leading-relaxed">
            Explore how the application converts computer architecture concepts
            into interactive simulations using React, TypeScript and Three.js.
          </p>
        </div>

        {/* Development Process */}
        <ProcessCard
          title="01 — DEVELOPMENT PROCESS"
          icon={<Code2 className="w-5 h-5" />}
          defaultOpen
        >
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

            <FlowStep
              title="Problem Identification"
              description="Identify difficult CPU and cache concepts."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="Architecture Design"
              description="Plan the pipeline, cache and interaction models."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="React Development"
              description="Build the interface using React and TypeScript."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="3D Development"
              description="Create interactive scenes using Three.js."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="Testing"
              description="Test controls, animations and simulations."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="Deployment"
              description="Push the project to GitHub and deploy using Vercel."
            />

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* CPU Pipeline */}
        <ProcessCard
          title="02 — CPU PIPELINE WORKING"
          icon={<Cpu className="w-5 h-5" />}
          defaultOpen
        >
          <div className="mt-5">

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Instructions move through five major pipeline stages. The
              simulation updates the instruction state for every clock cycle
              and the 3D scene displays the corresponding stage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

              <FlowStep
                title="IF"
                description="Instruction Fetch — obtains the instruction."
              />

              <FlowStep
                title="ID"
                description="Instruction Decode — interprets the instruction."
              />

              <FlowStep
                title="EX"
                description="Execute — performs the required operation."
              />

              <FlowStep
                title="MEM"
                description="Memory — performs required memory access."
              />

              <FlowStep
                title="WB"
                description="Write Back — stores the result."
              />

            </div>

            <div className="mt-6 rounded-xl bg-slate-950/80 border border-cyan-500/20 p-5">

              <div className="font-mono text-xs text-cyan-400 mb-3">
                PIPELINE EXECUTION FLOW
              </div>

              <div className="text-center text-white font-mono text-lg">
                IF → ID → EX → MEM → WB → COMPLETED
              </div>

              <p className="text-slate-500 text-xs text-center mt-3">
                Each NEXT operation advances the simulation by one clock cycle.
              </p>

            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Pipeline Controls */}
        <ProcessCard
          title="03 — SIMULATION CONTROLS"
          icon={<Workflow className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">

            <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 p-4">
              <div className="text-cyan-400 font-mono text-xs font-bold">
                PLAY
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Starts automatic clock-cycle progression.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 p-4">
              <div className="text-cyan-400 font-mono text-xs font-bold">
                PAUSE
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Stops the automatic simulation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 p-4">
              <div className="text-cyan-400 font-mono text-xs font-bold">
                NEXT
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Advances the pipeline by one clock cycle.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 p-4">
              <div className="text-cyan-400 font-mono text-xs font-bold">
                RESET
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Restores the initial pipeline state.
              </p>
            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Hazards */}
        <ProcessCard
          title="04 — PIPELINE HAZARDS"
          icon={<AlertTriangle className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <h3 className="text-yellow-400 font-mono text-sm font-bold">
                RAW / DATA HAZARD
              </h3>

              <div className="font-mono text-xs text-slate-300 mt-4">
                Instruction A
                <br />
                ↓
                <br />
                Produces Data
                <br />
                ↓
                <br />
                Instruction B Needs Data
                <br />
                ↓
                <br />
                Forwarding / Stall
              </div>
            </div>

            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
              <h3 className="text-pink-400 font-mono text-sm font-bold">
                BRANCH HAZARD
              </h3>

              <div className="font-mono text-xs text-slate-300 mt-4">
                Branch
                <br />
                ↓
                <br />
                Prediction
                <br />
                ↓
                <br />
                Misprediction
                <br />
                ↓
                <br />
                Pipeline Flush
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
              <h3 className="text-purple-400 font-mono text-sm font-bold">
                STRUCTURAL HAZARD
              </h3>

              <div className="font-mono text-xs text-slate-300 mt-4">
                Instruction A
                <br />
                +
                <br />
                Instruction B
                <br />
                ↓
                <br />
                Shared Resource
                <br />
                ↓
                <br />
                Conflict
              </div>
            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Cache */}
        <ProcessCard
          title="05 — CACHE HIT / MISS WORKING"
          icon={<Zap className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">

              <h3 className="text-emerald-400 font-mono font-bold">
                CACHE HIT
              </h3>

              <div className="font-mono text-xs text-slate-300 mt-4 leading-7">
                CPU Request
                <br />
                ↓
                <br />
                L1 Cache
                <br />
                ↓
                <br />
                DATA FOUND
                <br />
                ↓
                <br />
                Data Returned to CPU
              </div>

              <p className="text-slate-400 text-xs mt-4">
                A cache hit occurs when the requested data is found in the
                searched cache level.
              </p>

            </div>

            <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-5">

              <h3 className="text-pink-400 font-mono font-bold">
                CACHE MISS
              </h3>

              <div className="font-mono text-xs text-slate-300 mt-4 leading-7">
                CPU Request
                <br />
                ↓
                <br />
                L1 → MISS
                <br />
                ↓
                <br />
                L2 → MISS
                <br />
                ↓
                <br />
                L3 → MISS
                <br />
                ↓
                <br />
                RAM
                <br />
                ↓
                <br />
                Data Returned
              </div>

              <p className="text-slate-400 text-xs mt-4">
                A cache miss requires searching a deeper memory level, which
                increases access latency.
              </p>

            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Cache Mapping */}
        <ProcessCard
          title="06 — CACHE ADDRESS MAPPING"
          icon={<Database className="w-5 h-5" />}
        >
          <div className="mt-5">

            <div className="rounded-xl bg-slate-950/80 border border-cyan-500/20 p-5">

              <div className="text-cyan-400 font-mono text-xs mb-4">
                MEMORY ADDRESS
              </div>

              <div className="text-center font-mono text-white text-lg">
                TAG&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;INDEX&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;OFFSET
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

              <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5">
                <h3 className="text-blue-400 font-mono font-bold">
                  DIRECT MAPPING
                </h3>
                <p className="text-slate-400 text-xs mt-3">
                  Each memory block maps to one specific cache line.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5">
                <h3 className="text-purple-400 font-mono font-bold">
                  SET-ASSOCIATIVE
                </h3>
                <p className="text-slate-400 text-xs mt-3">
                  A memory block maps to a set and can occupy one of multiple
                  lines in that set.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-pink-500/30 bg-pink-500/5">
                <h3 className="text-pink-400 font-mono font-bold">
                  FULLY ASSOCIATIVE
                </h3>
                <p className="text-slate-400 text-xs mt-3">
                  A memory block can be placed in any available cache line.
                </p>
              </div>

            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Replacement */}
        <ProcessCard
          title="07 — CACHE REPLACEMENT"
          icon={<RefreshCw className="w-5 h-5" />}
        >
          <div className="mt-5">

            <div className="flex flex-wrap items-center justify-center gap-3">

              <FlowStep
                title="CACHE FULL"
                description="No free cache line remains."
              />

              <span className="text-cyan-400 text-xl">→</span>

              <FlowStep
                title="NEW BLOCK"
                description="A new memory block arrives."
              />

              <span className="text-cyan-400 text-xl">→</span>

              <FlowStep
                title="POLICY"
                description="Replacement policy selects a victim."
              />

              <span className="text-cyan-400 text-xl">→</span>

              <FlowStep
                title="EVICTION"
                description="Old block is removed."
              />

              <span className="text-cyan-400 text-xl">→</span>

              <FlowStep
                title="INSERT"
                description="New block enters the cache."
              />

            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Technology Architecture */}
        <ProcessCard
          title="08 — SOFTWARE ARCHITECTURE"
          icon={<Code2 className="w-5 h-5" />}
        >
          <div className="mt-5">

            <div className="flex flex-col items-center gap-3 font-mono">

              <div className="px-8 py-4 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                React + TypeScript
              </div>

              <div className="text-cyan-400">↓</div>

              <div className="px-8 py-4 rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
                Application State
              </div>

              <div className="text-cyan-400">↓</div>

              <div className="px-8 py-4 rounded-xl border border-purple-400/30 bg-purple-500/10 text-purple-300">
                Simulation Logic
              </div>

              <div className="text-cyan-400">↓</div>

              <div className="px-8 py-4 rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-300">
                React Three Fiber
              </div>

              <div className="text-cyan-400">↓</div>

              <div className="px-8 py-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                Three.js / WebGL
              </div>

              <div className="text-cyan-400">↓</div>

              <div className="px-8 py-4 rounded-xl border border-slate-500/30 bg-slate-900 text-white">
                Browser 3D Visualization
              </div>

            </div>

          </div>
        </ProcessCard>

        <div className="h-4" />

        {/* Deployment */}
        <ProcessCard
          title="09 — DEVELOPMENT & DEPLOYMENT"
          icon={<Rocket className="w-5 h-5" />}
        >
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

            <FlowStep
              title="VS CODE"
              description="Development environment."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="LOCAL TEST"
              description="Run using Vite."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="GIT"
              description="Version control."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="GITHUB"
              description="Source code repository."
            />

            <span className="text-cyan-400 text-xl">→</span>

            <FlowStep
              title="VERCEL"
              description="Production deployment."
            />

          </div>

          <div className="mt-6 text-center text-slate-400 text-xs">
            Every GitHub push can trigger a new Vercel deployment.
          </div>
        </ProcessCard>

        {/* Footer */}
        <div className="text-center mt-10 mb-4">
          <div className="text-cyan-400 font-mono text-xs">
            CPU 3D LAB
          </div>

          <div className="text-slate-600 font-mono text-[10px] mt-2">
            Interactive Computer Architecture Visualization
          </div>
        </div>

      </div>
    </div>
  );
};