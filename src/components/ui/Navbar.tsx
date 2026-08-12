import React from 'react';
import type { SectionId } from '../../types';
import {
  Cpu,
  Layers,
  AlertTriangle,
  Database,
  Zap,
  Grid,
  RefreshCw,
  Activity,
  Gauge,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface NavbarProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  isExploded: boolean;
  onToggleExploded: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  quizScore: number;
}

const NAV_ITEMS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'landing', label: 'Overview', icon: <Cpu className="w-4 h-4" /> },
  { id: 'pipeline', label: 'CPU Pipeline', icon: <Layers className="w-4 h-4" /> },
  { id: 'hazards', label: 'Hazards', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'hierarchy', label: 'Hierarchy', icon: <Database className="w-4 h-4" /> },
  { id: 'hitmiss', label: 'Hit/Miss', icon: <Zap className="w-4 h-4" /> },
  { id: 'mapping', label: 'Cache Types', icon: <Grid className="w-4 h-4" /> },
  { id: 'replacement', label: 'Eviction', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'performance', label: 'AMAT Stats', icon: <Activity className="w-4 h-4" /> },
  { id: 'race', label: 'Speed Race', icon: <Gauge className="w-4 h-4" /> },
  { id: 'quiz', label: 'Quizzes', icon: <HelpCircle className="w-4 h-4" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  isExploded,
  onToggleExploded,
  soundEnabled,
  onToggleSound,
  quizScore,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 glass-panel border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          onClick={() => { soundFx.playClick(); onSelectSection('landing'); }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="font-mono text-sm tracking-wider text-white font-bold flex items-center gap-2 whitespace-nowrap">
              CPU 3D LAB <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">v2.5</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono whitespace-nowrap">Pipelining & Cache Architecture</p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto space-x-1 glass-panel px-2 py-1.5 rounded-xl border-cyan-500/20 max-w-[55vw] scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { soundFx.playClick(); onSelectSection(item.id); }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* HUD Controls */}
        <div className="flex items-center space-x-3">
          {/* Quiz Score Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-panel-glow text-xs font-mono text-cyan-300">
            <span className="text-amber-400 font-bold">🏆 Score:</span>
            <span>{quizScore} pts</span>
          </div>

          {/* 3D Explode View Toggle */}
          <button
            onClick={() => { soundFx.playClick(); onToggleExploded(); }}
            className={`p-2 rounded-lg font-mono text-xs flex items-center space-x-1 transition-all ${isExploded
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'glass-panel text-slate-300 hover:text-cyan-400'
              }`}
            title="Toggle 3D Exploded Layer View"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden md:inline">{isExploded ? 'Collapsed' : 'Explode 3D'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => { soundFx.playClick(); onToggleSound(); }}
            className="p-2 rounded-lg glass-panel text-slate-300 hover:text-cyan-400 font-mono text-xs"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
