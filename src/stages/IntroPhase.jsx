import React from 'react';
import { BgSymbols } from '../components/TopNav.jsx';

export function IntroModal({ onBegin }) {
  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 py-6 sm:py-8 relative overflow-y-auto select-none z-10">
      <BgSymbols />

      {/* Main Intro Content Card with Fluid Viewport Constraints */}
      <div className="relative w-full max-w-4xl flex flex-col items-center text-center fade-in-up z-20 my-auto gap-2.5 sm:gap-3.5">
        {/* Pill Badge */}
        <div className="bg-[#1c0d38] border-2 border-amber-400/50 text-amber-300 text-xs sm:text-sm font-900 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full shadow-lg tracking-wide shrink-0">
          ✨ Data & Statistics · Grade 7
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-2xl sm:text-4xl md:text-5xl text-white text-center leading-tight tracking-tight shrink-0 px-2">
          Data Interpretation &{" "}
          <span className="text-[#facc15] font-900 block drop-shadow-[0_0_28px_rgba(250,204,21,0.7)]">
            Misleading Graphs
          </span>
        </h1>

        {/* Mascot Avatar & Speech Pill */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 shrink-0 px-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#facc15] p-0.5 shadow-[0_0_22px_rgba(250,204,21,0.8)] flex items-center justify-center text-xl sm:text-2xl shrink-0">
            🕵️
          </div>
          <div className="bg-white rounded-full px-4 sm:px-7 py-1.5 sm:py-2 text-[#0c031d] font-display font-900 text-xs sm:text-sm md:text-base shadow-lg">
            Ready to crack the case of the tricky graph? 🔎
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-slate-100 text-xs sm:text-sm md:text-base max-w-2xl text-center leading-relaxed font-bold drop-shadow-sm shrink-0 px-3">
          Join Nova on a mission to read bar, line, and pie graphs like a pro — and unmask the tricks that make honest numbers look bigger, smaller, or scarier than they really are!
        </p>

        {/* YOUR LEARNING JOURNEY Flow Card */}
        <div className="w-full max-w-2xl bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center shrink-0">
          <p className="text-[#facc15] text-xs sm:text-sm font-display font-900 tracking-wider text-center mb-2 sm:mb-3">
            YOUR LEARNING JOURNEY
          </p>

          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-6 w-full mb-2.5">
            {/* Wonder */}
            <div className="flex flex-col items-center text-center flex-1 sm:flex-initial">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-purple-400 bg-purple-950/90 text-purple-200 flex items-center justify-center text-base sm:text-lg shadow-[0_0_16px_rgba(192,132,252,0.65)] mb-1">
                🔍
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Wonder</p>
              <p className="text-slate-300 text-[10px] sm:text-xs font-bold hidden xs:block">Spark curiosity</p>
            </div>
            <span className="text-amber-400 font-black text-sm sm:text-base mb-2">→</span>

            {/* Story */}
            <div className="flex flex-col items-center text-center flex-1 sm:flex-initial">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 bg-amber-950/90 text-amber-200 flex items-center justify-center text-base sm:text-lg shadow-[0_0_16px_rgba(251,191,36,0.65)] mb-1">
                📖
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Story</p>
              <p className="text-slate-300 text-[10px] sm:text-xs font-bold hidden xs:block">Hear the tale</p>
            </div>
            <span className="text-amber-400 font-black text-sm sm:text-base mb-2">→</span>

            {/* Simulate */}
            <div className="flex flex-col items-center text-center flex-1 sm:flex-initial">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-teal-400 bg-teal-950/90 text-teal-200 flex items-center justify-center text-base sm:text-lg shadow-[0_0_16px_rgba(45,212,191,0.65)] mb-1">
                🧪
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Simulate</p>
              <p className="text-slate-300 text-[10px] sm:text-xs font-bold hidden xs:block">Interactive labs</p>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="flex items-center justify-center gap-4 sm:gap-10 w-full pt-1 border-t border-white/10">
            {/* Practice */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-emerald-400 bg-emerald-950/90 text-emerald-200 flex items-center justify-center text-base sm:text-lg shadow-[0_0_16px_rgba(52,211,153,0.65)] mb-1">
                🎮
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Practice</p>
              <p className="text-slate-300 text-[10px] sm:text-xs font-bold">10 Game Worlds</p>
            </div>
            <span className="text-amber-400 font-black text-sm sm:text-base mb-2">→</span>

            {/* Reflect */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-indigo-400 bg-indigo-950/90 text-indigo-200 flex items-center justify-center text-base sm:text-lg shadow-[0_0_16px_rgba(129,140,248,0.65)] mb-1">
                📝
              </div>
              <p className="font-display font-900 text-white text-xs sm:text-sm leading-tight">Reflect</p>
              <p className="text-slate-300 text-[10px] sm:text-xs font-bold">Score & Trophy</p>
            </div>
          </div>
        </div>

        {/* Begin Button */}
        <button
          onClick={onBegin}
          className="btn-gold text-base sm:text-lg md:text-xl font-900 py-3 sm:py-3.5 px-8 sm:px-12 w-full sm:w-auto max-w-md shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105 transition cursor-pointer shrink-0"
        >
          🚀 Begin Your Investigation!
        </button>

        {/* 3 Bottom Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-2xl shrink-0">
          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-2.5 sm:p-3 flex items-center sm:flex-col justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-0.5 hover:border-purple-300 transition">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
              📊
            </div>
            <div>
              <span className="font-display font-900 text-white text-xs sm:text-sm block">Graph Types</span>
              <span className="text-slate-300 text-[11px] sm:text-xs font-bold">Bar, line & pie</span>
            </div>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-2.5 sm:p-3 flex items-center sm:flex-col justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-0.5 hover:border-purple-300 transition">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-500/30 text-rose-300 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
              🧪
            </div>
            <div>
              <span className="font-display font-900 text-white text-xs sm:text-sm block">Simulations</span>
              <span className="text-slate-300 text-[11px] sm:text-xs font-bold">Interactive labs</span>
            </div>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-2.5 sm:p-3 flex items-center sm:flex-col justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-0.5 hover:border-purple-300 transition">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
              🏆
            </div>
            <div>
              <span className="font-display font-900 text-white text-xs sm:text-sm block">10 Game Worlds</span>
              <span className="text-slate-300 text-[11px] sm:text-xs font-bold">XP & awards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
