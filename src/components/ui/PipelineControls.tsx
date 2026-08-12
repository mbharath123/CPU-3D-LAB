import { Play, Pause, SkipForward, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { HazardType } from '../../types';
import { soundFx } from '../../utils/soundEffects';

interface PipelineControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepNext: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  activeHazard: HazardType;
  onSelectHazard: (hazard: HazardType) => void;
  cycleCount: number;
}

export function PipelineControls({
  isPlaying,
  onTogglePlay,
  onStepNext,
  onReset,
  speed,
  onChangeSpeed,
  activeHazard,
  onSelectHazard,
  cycleCount,
}: PipelineControlsProps) {
  const handlePlayPause = () => {
    soundFx.playClick();
    onTogglePlay();
  };

  const handleStep = () => {
    soundFx.playStep();
    onStepNext();
  };

  const handleReset = () => {
    soundFx.playClick();
    onReset();
  };

  const handleHazard = (hazard: HazardType) => {
    soundFx.playClick();
    onSelectHazard(hazard);
  };

  return (
    <div
      className="
        relative
        z-[200]
        w-fit
        min-w-[420px]
        max-w-[calc(100vw-32px)]
        rounded-2xl
        border
        border-cyan-500/40
        bg-slate-950/95
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(0,243,255,0.25)]
        px-6
        py-5
        text-white
        pointer-events-auto
      "
    >
      {/* =====================================================
          TOP CONTROL ROW
          ===================================================== */}

      <div className="flex items-center gap-3">
        {/* PLAY / PAUSE */}

        <button
          type="button"
          onClick={handlePlayPause}
          className="
            flex
            items-center
            justify-center
            gap-2
            min-w-[100px]
            px-4
            py-3
            rounded-xl
            bg-cyan-500
            text-slate-950
            font-mono
            text-xs
            font-bold
            border
            border-cyan-300
            shadow-[0_0_20px_rgba(0,243,255,0.45)]
            hover:bg-cyan-300
            hover:scale-105
            active:scale-95
            transition-all
            cursor-pointer
          "
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>RUN</span>
            </>
          )}
        </button>

        {/* STEP */}

        <button
          type="button"
          onClick={handleStep}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-slate-900
            text-cyan-300
            font-mono
            text-xs
            font-bold
            border
            border-cyan-500/40
            hover:bg-cyan-500/10
            hover:border-cyan-400
            hover:scale-105
            active:scale-95
            transition-all
            cursor-pointer
          "
        >
          <SkipForward className="w-4 h-4" />
          <span>NEXT</span>
        </button>

        {/* RESET */}

        <button
          type="button"
          onClick={handleReset}
          className="
            flex
            items-center
            justify-center
            p-3
            rounded-xl
            bg-slate-900
            text-slate-400
            border
            border-slate-700
            hover:text-white
            hover:border-cyan-400
            hover:bg-slate-800
            hover:scale-105
            active:scale-95
            transition-all
            cursor-pointer
          "
          aria-label="Reset pipeline"
          title="Reset pipeline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* =====================================================
          CYCLE + SPEED
          ===================================================== */}

      <div className="flex items-center gap-5 mt-4">
        {/* CYCLE */}

        <div
          className="
            px-4
            py-2.5
            rounded-xl
            bg-slate-900/90
            border
            border-cyan-500/30
            font-mono
            text-xs
            whitespace-nowrap
          "
        >
          <span className="text-slate-400">
            Clock Cycle:
          </span>

          <span className="ml-2 text-cyan-300 font-bold">
            {cycleCount}
          </span>
        </div>

        {/* SPEED */}

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Speed
          </span>

          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={(event) => {
              onChangeSpeed(
                Number(event.target.value)
              );
            }}
            className="
              w-28
              accent-cyan-400
              cursor-pointer
            "
          />

          <span className="text-xs text-cyan-300 font-mono min-w-[28px]">
            {speed}x
          </span>
        </div>
      </div>

      {/* =====================================================
          HAZARD CONTROLS
          ===================================================== */}

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <div className="flex items-center gap-1 mr-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />

          <span className="text-xs text-slate-400 font-mono">
            Hazard:
          </span>
        </div>

        {/* CLEAN */}

        <button
          type="button"
          onClick={() => handleHazard('none')}
          className={`
            px-3
            py-2
            rounded-lg
            text-[10px]
            font-mono
            font-bold
            border
            transition-all
            cursor-pointer
            ${activeHazard === 'none'
              ? `
                  bg-emerald-500/20
                  text-emerald-300
                  border-emerald-500/60
                  shadow-[0_0_12px_rgba(16,185,129,0.25)]
                `
              : `
                  bg-slate-900
                  text-slate-400
                  border-slate-700
                  hover:text-white
                `
            }
          `}
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            CLEAN
          </span>
        </button>

        {/* DATA */}

        <button
          type="button"
          onClick={() => handleHazard('data')}
          className={`
            px-3
            py-2
            rounded-lg
            text-[10px]
            font-mono
            font-bold
            border
            transition-all
            cursor-pointer
            ${activeHazard === 'data'
              ? `
                  bg-cyan-500/20
                  text-cyan-300
                  border-cyan-500/60
                `
              : `
                  bg-slate-900
                  text-slate-400
                  border-slate-700
                  hover:text-white
                `
            }
          `}
        >
          RAW Data
        </button>

        {/* CONTROL */}

        <button
          type="button"
          onClick={() =>
            handleHazard('control')
          }
          className={`
            px-3
            py-2
            rounded-lg
            text-[10px]
            font-mono
            font-bold
            border
            transition-all
            cursor-pointer
            ${activeHazard === 'control'
              ? `
                  bg-pink-500/20
                  text-pink-300
                  border-pink-500/60
                `
              : `
                  bg-slate-900
                  text-slate-400
                  border-slate-700
                  hover:text-white
                `
            }
          `}
        >
          Branch
        </button>

        {/* STRUCTURAL */}

        <button
          type="button"
          onClick={() =>
            handleHazard('structural')
          }
          className={`
            px-3
            py-2
            rounded-lg
            text-[10px]
            font-mono
            font-bold
            border
            transition-all
            cursor-pointer
            ${activeHazard === 'structural'
              ? `
                  bg-purple-500/20
                  text-purple-300
                  border-purple-500/60
                `
              : `
                  bg-slate-900
                  text-slate-400
                  border-slate-700
                  hover:text-white
                `
            }
          `}
        >
          Structural
        </button>
      </div>
    </div>
  );
}