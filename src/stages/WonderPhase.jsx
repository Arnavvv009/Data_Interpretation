import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';
import { playClickSound } from '../utils/soundEffects.js';

export function WonderPhase({ muted, onNext }) {
  const [wonderBaseline, setWonderBaseline] = useState(0);

  useEffect(() => {
    stopNarration();
    narrate(AUDIO_MAP.wonder_1, !muted);
    return () => stopNarration();
  }, [muted]);

  // Dynamic bar height calculation based on baseline
  // Data: Brand A = 100, Brand B = 118
  const hA = Math.max(8, Math.round(((100 - wonderBaseline) / (130 - wonderBaseline)) * 75));
  const hB = Math.max(8, Math.round(((118 - wonderBaseline) / (130 - wonderBaseline)) * 75));
  const yA = 85 - hA;
  const yB = 85 - hB;
  const ratio = ((118 - wonderBaseline) / Math.max(1, (100 - wonderBaseline))).toFixed(1);

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 py-6 overflow-y-auto select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-2xl glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto p-4 sm:p-7">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder mb-2" />

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-2xl sm:text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="font-display font-900 text-xl sm:text-2xl md:text-3xl text-purple-200 mb-3 max-w-xl leading-snug">
          Same Numbers, Two Totally Different Charts?
        </h2>

        {/* Live Interactive Graph Illusion Sandbox */}
        <div className="w-full bg-[#1e143c]/90 border-2 border-purple-400/40 rounded-2xl p-3.5 sm:p-5 mb-3.5 flex flex-col items-center shadow-xl">
          <div className="w-full flex flex-wrap items-center justify-between gap-1 border-b border-white/10 pb-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black text-amber-300 uppercase tracking-wider">
              ✦ Live Optical Graph Illusion Sandbox
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
              Visual Ratio: {ratio}x
            </span>
          </div>

          <div className="flex items-center justify-center my-1 w-full">
            {/* Interactive SVG Chart */}
            <svg width="220" height="110" viewBox="0 0 220 110" className="w-full max-w-[240px] h-auto drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]">
              <line x1="25" y1="85" x2="200" y2="85" stroke="#64748b" strokeWidth="2" />
              <line x1="25" y1="10" x2="25" y2="85" stroke="#64748b" strokeWidth="2" />

              {/* Y Axis Baseline Indicator */}
              <text x="20" y="88" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="end">{wonderBaseline}</text>
              <text x="20" y="15" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="end">130</text>

              {/* Bar A */}
              <rect x="50" y={yA} width="35" height={hA} fill="#38bdf8" rx="3" />
              <text x="67" y={yA - 4} fill="#e2e8f0" fontSize="9" fontWeight="900" textAnchor="middle">100</text>
              <text x="67" y="98" fill="#cbd5e1" fontSize="9" fontWeight="800" textAnchor="middle">Q1</text>

              {/* Bar B */}
              <rect x="120" y={yB} width="35" height={hB} fill={wonderBaseline > 0 ? "#f43f5e" : "#4ade80"} rx="3" />
              <text x="137" y={yB - 4} fill="#e2e8f0" fontSize="9" fontWeight="900" textAnchor="middle">118</text>
              <text x="137" y="98" fill="#cbd5e1" fontSize="9" fontWeight="800" textAnchor="middle">Q4</text>
            </svg>
          </div>

          {/* Interactive Baseline Slider */}
          <div className="w-full bg-[#12082b] p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col gap-1.5 mt-2">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs font-black text-slate-300">
              <span>y-Axis Baseline Slider:</span>
              <span className={wonderBaseline === 0 ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>
                Starts at {wonderBaseline} {wonderBaseline === 0 ? "(Fair Start at 0)" : "(Truncated Start!)"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={wonderBaseline}
              onChange={e => {
                playClickSound(muted);
                setWonderBaseline(Number(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer h-2"
            />
          </div>

          <p className="text-[11px] sm:text-xs text-slate-200 mt-2 font-bold leading-relaxed">
            At baseline 0, sales grew by <span className="text-emerald-300 font-black">+18%</span>. Dragging baseline to 90 makes Q4 look <span className="text-amber-300 font-black">nearly 2x taller</span>!
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-2.5 sm:gap-3 bg-[#14082c]/80 border border-purple-500/30 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2 mb-4 w-full sm:w-auto text-left">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
            🤖
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold leading-snug">
            How can the same data look so different — and how do you catch the trick?
          </p>
        </div>

        <button onClick={onNext} className="btn-gold flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
