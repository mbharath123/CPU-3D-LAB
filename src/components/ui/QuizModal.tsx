import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/educationalData';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/soundEffects';

interface QuizModalProps {
  onScoreUpdate: (score: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    soundFx.playClick();
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctIndex) {
      soundFx.playHit();
      const newScore = score + 50;
      setScore(newScore);
      onScoreUpdate(newScore);
    } else {
      soundFx.playMiss();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 glass-panel-glow rounded-3xl border-cyan-500/40 font-mono shadow-[0_0_40px_rgba(0,243,255,0.2)]">
      {!completed ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5">
            <div className="flex items-center space-x-2 text-cyan-400">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> SCORE: {score} PTS
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((opt, i) => {
              let optionStyle = 'glass-panel text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10';
              if (isAnswered) {
                if (i === question.correctIndex) {
                  optionStyle = 'glass-panel-success text-emerald-300 border-emerald-500 font-bold';
                } else if (i === selectedOption) {
                  optionStyle = 'glass-panel-danger text-pink-300 border-pink-500 font-bold';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && i === question.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && i === selectedOption && i !== question.correctIndex && (
                    <XCircle className="w-4 h-4 text-pink-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="glass-panel p-4 rounded-xl border-cyan-500/30 mb-6 bg-slate-900/80 animate-fadeIn">
              <span className="text-cyan-400 font-bold block mb-1">💡 ARCHITECTURAL EXPLANATION:</span>
              <p className="text-slate-300 text-xs leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-[1.02] transition-transform"
            >
              <span>CONTINUE TO NEXT QUESTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        /* Completion Screen */
        <div className="text-center py-8 space-y-4 animate-fadeIn">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-white text-glow-cyan">QUIZ COMPLETED!</h2>
          <p className="text-slate-300 text-sm">
            You scored <span className="text-cyan-400 font-bold text-lg">{score}</span> out of {QUIZ_QUESTIONS.length * 50} possible points.
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold text-xs inline-flex items-center space-x-2 hover:bg-cyan-500/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY QUIZ</span>
          </button>
        </div>
      )}
    </div>
  );
};
