import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, cheer, stopNarration } from '../audio.js';
import { PRACTICE_WORLDS } from '../utils/topicData.js';

export function ReflectPhase({ xp, stars, bestStreak, worldResults, muted, onComplete }) {
  const [reflectionText, setReflectionText] = useState('');
  const minLength = 10;

  useEffect(() => {
    stopNarration();
    narrate(AUDIO_MAP.reflect_1, !muted);
    return () => stopNarration();
  }, [muted]);

  const handleSubmit = () => {
    stopNarration();
    cheer("Outstanding reflection! Lesson complete!");
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    onComplete();
  };

  const charCount = reflectionText.trim().length;

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-5 py-4 sm:py-6 relative overflow-y-auto select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-4xl bg-[#160b38]/95 border-2 border-purple-400/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto">

        <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-purple-400 rounded-full mb-2.5 sm:mb-3 shadow-[0_0_18px_rgba(168,85,247,0.85)] shrink-0" />

        <h2 className="font-display font-900 text-2xl sm:text-4xl text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-3xl sm:text-5xl">🏆</span>
          <span>Reflect & Scoreboard</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full mb-3.5 sm:mb-4 shrink-0">
          <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center shadow-lg">
            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">✨</span>
            <span className="font-display font-900 text-xl sm:text-3xl text-amber-400 mb-0.5">{xp}</span>
            <span className="text-[11px] sm:text-xs font-900 text-slate-200">Total XP</span>
          </div>

          <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center shadow-lg">
            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">⭐</span>
            <span className="font-display font-900 text-xl sm:text-3xl text-amber-400 mb-0.5">{stars} / 30</span>
            <span className="text-[11px] sm:text-xs font-900 text-slate-200">Stars</span>
          </div>

          <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center shadow-lg">
            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🧪</span>
            <span className="font-display font-900 text-xl sm:text-3xl text-emerald-400 mb-0.5">28/28</span>
            <span className="text-[11px] sm:text-xs font-900 text-slate-200">Labs Unlocked</span>
          </div>

          <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center shadow-lg">
            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🔥</span>
            <span className="font-display font-900 text-xl sm:text-3xl text-amber-400 mb-0.5">{bestStreak}</span>
            <span className="text-[11px] sm:text-xs font-900 text-slate-200">Best Streak</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center mb-3 sm:mb-4 shrink-0">
          <span className="text-[11px] sm:text-xs font-900 text-amber-400 tracking-wider uppercase mb-1.5">
            WORLD RESULTS
          </span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2.5 w-full">
            {PRACTICE_WORLDS.map((w, idx) => {
              const res = worldResults[idx];
              return (
                <div
                  key={w.id}
                  className="bg-[#1a0e42]/80 border-2 border-purple-400/30 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 flex flex-col items-center justify-between text-center min-h-[50px] sm:min-h-[58px] shadow-sm"
                >
                  <span className="text-[11px] sm:text-sm font-black text-slate-200">W{idx + 1}</span>
                  <span className="text-[11px] sm:text-sm font-900 text-amber-400 mt-0.5 sm:mt-1">
                    {res != null && res > 0 ? `${res}★` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full border-t border-white/15 my-2 shrink-0" />

        <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-4 mb-3 sm:mb-4 shrink-0">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#1e0e4a] border-2 border-cyan-400 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0 mt-0.5">
            🕵️
          </div>

          <div className="flex-1 flex flex-col text-left w-full">
            <h3 className="font-display font-900 text-sm sm:text-lg text-white mb-1.5 leading-snug">
              What makes a graph misleading? Explain it to Nova with one trick you now know how to catch!
            </h3>

            <div className="w-full bg-[#0e0626] border-2 border-purple-400/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col relative shadow-inner">
              <textarea
                rows="3"
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Dear Nova, a graph can be misleading when..."
                className="w-full bg-transparent text-xs sm:text-base font-extrabold text-white placeholder-slate-400 outline-none resize-none font-sans"
              />
              <div className="text-[10px] sm:text-xs font-black text-slate-300 text-right mt-1">
                {charCount} / {minLength} min chars
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={charCount < minLength}
          onClick={handleSubmit}
          className="btn-gold font-display font-900 text-sm sm:text-lg px-7 sm:px-9 py-2.5 sm:py-3 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto"
        >
          Complete Lesson! 🎉
        </button>
      </div>
    </div>
  );
}

export function CelebrationScreen({ xp, stars, onRestart }) {
  useEffect(() => {
    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  }, []);

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-3 sm:p-4 py-6 relative overflow-y-auto select-none z-20 bg-[#0c0424]">
      <BgSymbols />

      <div className="w-full max-w-md glass-card flex flex-col items-center text-center fade-in-up z-30 my-auto py-5 sm:py-6 px-4 sm:px-6">
        <span className="text-4xl sm:text-5xl mb-2 animate-bounce">🕵️🏆</span>

        <div className="bg-[#1c0d38] border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 sm:px-4 py-1 rounded-full mb-2">
          Grade 7 Data Detective Mastered!
        </div>

        <h1 className="font-display font-900 text-xl sm:text-3xl text-white mb-2">
          Graph Detective Quest Complete!
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
          Congratulations! You can now read bar, line, and pie graphs with confidence — and catch truncated axes, inconsistent scales, and cherry-picked ranges every time!
        </p>

        <div className="w-full bg-[#14082c] border border-white/10 rounded-2xl p-3 sm:p-4 flex justify-around items-center mb-4 sm:mb-5">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 font-display font-900 text-base sm:text-lg">{xp} XP</span>
            <span className="text-slate-400 text-[10px]">Total Score</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-amber-300 font-display font-900 text-base sm:text-lg">{stars} ⭐</span>
            <span className="text-slate-400 text-[10px]">Stars Earned</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-emerald-300 font-display font-900 text-base sm:text-lg">28/28 🧪</span>
            <span className="text-slate-400 text-[10px]">Labs Mastered</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-gold text-xs sm:text-sm px-7 sm:px-8 py-2.5 sm:py-3 cursor-pointer w-full sm:w-auto"
        >
          🔄 Play Module Again
        </button>
      </div>
    </div>
  );
}
