import React, { useEffect } from 'react';
import type { EducationalComponentData } from '../../types';
import {
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface EducationalModalProps {
  data: EducationalComponentData | null;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({
  data,
  onClose,
}) => {
  /*
   * Close the popup with the ESC key.
   */
  useEffect(() => {
    if (!data) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [data, onClose]);

  /*
   * Don't render anything when there is no popup data.
   */
  if (!data) {
    return null;
  }

  const handleClose = () => {
    soundFx.playClick();
    onClose();
  };

  return (
    /*
     * Full-screen popup backdrop.
     *
     * pointer-events-auto is important because App.tsx
     * contains a pointer-events-none foreground layer.
     */
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-4
        bg-slate-950/80
        backdrop-blur-md
        animate-fadeIn
        pointer-events-auto
      "
      onClick={handleClose}
    >
      {/*
       * Popup itself.
       *
       * stopPropagation prevents clicking inside the popup
       * from immediately closing it.
       */}
      <div
        className="
          relative
          w-full
          max-w-3xl
          max-h-[85vh]
          overflow-hidden
          rounded-2xl
          border
          border-cyan-500/40
          bg-slate-950/95
          shadow-[0_0_50px_rgba(0,243,255,0.3)]
          pointer-events-auto
          font-mono
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            HEADER
            ===================================================== */}

        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            px-6
            py-4
            border-b
            border-cyan-500/20
            bg-slate-950/95
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <BookOpen className="w-5 h-5" />

            <span className="text-xs tracking-widest uppercase font-bold">
              {data.category}
            </span>
          </div>

          {/* CLOSE X BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            className="
              p-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              text-slate-400
              hover:text-white
              hover:border-cyan-400
              hover:bg-slate-800
              transition-all
              cursor-pointer
            "
            aria-label="Close overview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
            ===================================================== */}

        <div
          className="
            max-h-[calc(85vh-72px)]
            overflow-y-auto
            overscroll-contain
            px-6
            py-6
            space-y-5
          "
        >
          {/* =================================================
              TITLE
              ================================================= */}

          <div>
            <h2 className="text-2xl font-bold text-white text-glow-cyan">
              {data.title}
            </h2>

            <div
              className="
                mt-2
                h-px
                bg-gradient-to-r
                from-cyan-500/60
                via-purple-500/40
                to-transparent
              "
            />
          </div>

          {/* =================================================
              DEFINITION
              ================================================= */}

          <div
            className="
              glass-panel
              p-4
              rounded-xl
              border
              border-cyan-500/20
            "
          >
            <span className="text-cyan-400 font-bold block mb-2">
              📖 Definition
            </span>

            <p className="text-slate-300 leading-relaxed text-sm">
              {data.definition}
            </p>
          </div>

          {/* =================================================
              PURPOSE
              ================================================= */}

          <div
            className="
              glass-panel
              p-4
              rounded-xl
              border
              border-cyan-500/20
            "
          >
            <span className="text-cyan-400 font-bold block mb-2">
              🎯 Purpose
            </span>

            <p className="text-slate-300 leading-relaxed text-sm">
              {data.purpose}
            </p>
          </div>

          {/* =================================================
              REAL WORLD ANALOGY
              ================================================= */}

          <div
            className="
              glass-panel
              p-4
              rounded-xl
              border
              border-amber-500/30
              bg-amber-500/5
            "
          >
            <span
              className="
                text-amber-400
                font-bold
                flex
                items-center
                gap-2
                mb-2
              "
            >
              <Lightbulb className="w-5 h-5" />

              Real-World Analogy
            </span>

            <p className="text-amber-200 italic text-sm leading-relaxed">
              {data.analogy}
            </p>
          </div>

          {/* =================================================
              ADVANTAGES / DISADVANTAGES
              ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ADVANTAGES */}

            <div
              className="
                glass-panel
                p-4
                rounded-xl
                border
                border-emerald-500/30
              "
            >
              <span
                className="
                  text-emerald-400
                  font-bold
                  flex
                  items-center
                  gap-2
                  mb-3
                "
              >
                <CheckCircle2 className="w-5 h-5" />

                Advantages
              </span>

              <ul className="space-y-2 text-sm text-slate-300">
                {data.advantages.map((advantage, index) => (
                  <li
                    key={index}
                    className="flex gap-2"
                  >
                    <span className="text-emerald-400">
                      •
                    </span>

                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DISADVANTAGES */}

            <div
              className="
                glass-panel
                p-4
                rounded-xl
                border
                border-red-500/30
              "
            >
              <span
                className="
                  text-red-400
                  font-bold
                  flex
                  items-center
                  gap-2
                  mb-3
                "
              >
                <XCircle className="w-5 h-5" />

                Disadvantages
              </span>

              <ul className="space-y-2 text-sm text-slate-300">
                {data.disadvantages.map((disadvantage, index) => (
                  <li
                    key={index}
                    className="flex gap-2"
                  >
                    <span className="text-red-400">
                      •
                    </span>

                    <span>{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* =================================================
              TIMING / MEMORY SIZE
              ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.cycleTiming && (
              <div
                className="
                  glass-panel
                  p-4
                  rounded-xl
                  border
                  border-purple-500/20
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-purple-400
                    font-bold
                    mb-2
                  "
                >
                  <Clock className="w-5 h-5" />

                  Timing
                </div>

                <p className="text-slate-300 text-sm">
                  {data.cycleTiming}
                </p>
              </div>
            )}

            {data.memorySize && (
              <div
                className="
                  glass-panel
                  p-4
                  rounded-xl
                  border
                  border-blue-500/20
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-blue-400
                    font-bold
                    mb-2
                  "
                >
                  <Sparkles className="w-5 h-5" />

                  Memory Size
                </div>

                <p className="text-slate-300 text-sm">
                  {data.memorySize}
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              EXAMPLE
              ================================================= */}

          {data.example && (
            <div
              className="
                glass-panel
                p-4
                rounded-xl
                border
                border-cyan-500/20
              "
            >
              <span className="text-cyan-400 font-bold block mb-2">
                💡 Example
              </span>

              <p className="text-slate-300 text-sm leading-relaxed">
                {data.example}
              </p>
            </div>
          )}

          {/* =================================================
              CLOSE BUTTON
              ================================================= */}

          <div className="flex justify-center pt-2 pb-2">
            <button
              type="button"
              onClick={handleClose}
              className="
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-bold
                text-sm
                hover:scale-105
                transition-transform
                shadow-[0_0_25px_rgba(0,243,255,0.35)]
                cursor-pointer
              "
            >
              CLOSE OVERVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};