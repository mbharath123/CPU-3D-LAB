import React from 'react';
import { Activity, Zap, Clock, ShieldAlert, BarChart3 } from 'lucide-react';

interface HolographicDashboardProps {
  hitCount: number;
  missCount: number;
  totalCycles: number;
}

export const HolographicDashboard: React.FC<HolographicDashboardProps> = ({
  hitCount,
  missCount,
  totalCycles,
}) => {
  const totalRequests = hitCount + missCount || 1;
  const hitRate = ((hitCount / totalRequests) * 100).toFixed(1);
  const missRate = ((missCount / totalRequests) * 100).toFixed(1);

  // AMAT calculation: Hit Time (1.0ns) + Miss Rate * Miss Penalty (70ns)
  const missRateDecimal = missCount / totalRequests;
  const amat = (1.0 + missRateDecimal * 70.0).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 font-mono">
      {/* Formula Banner */}
      <div className="glass-panel-glow p-4 rounded-2xl border-cyan-500/40 flex items-center justify-between text-cyan-300">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-xs text-slate-400">AMAT FORMULA:</span>
            <div className="text-sm font-bold text-white">AMAT = Hit Time + (Miss Rate × Miss Penalty)</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">CURRENT AMAT:</span>
          <div className="text-lg font-bold text-cyan-400">{amat} ns</div>
        </div>
      </div>

      {/* Holographic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hit Ratio */}
        <div className="glass-panel-success p-5 rounded-2xl border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold">CACHE HIT RATIO</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{hitRate}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${hitRate}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">{hitCount} Successful Hits</span>
        </div>

        {/* Miss Ratio */}
        <div className="glass-panel-danger p-5 rounded-2xl border-pink-500/30">
          <div className="flex items-center justify-between text-pink-400 mb-2">
            <span className="text-xs font-bold">CACHE MISS RATIO</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{missRate}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full transition-all duration-500" style={{ width: `${missRate}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">{missCount} Cache Misses</span>
        </div>

        {/* Bandwidth */}
        <div className="glass-panel p-5 rounded-2xl border-blue-500/30">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-bold">MEMORY BANDWIDTH</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">3.4 TB/s</div>
          <span className="text-[10px] text-slate-400 mt-2 block">L1 Cache Interconnect Speed</span>
        </div>

        {/* Total Cycles */}
        <div className="glass-panel-glow p-5 rounded-2xl border-purple-500/30">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-bold">EXECUTION CYCLES</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalCycles}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Total Clock Pulses</span>
        </div>
      </div>
    </div>
  );
};
