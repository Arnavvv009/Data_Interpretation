import React from 'react';

export function BgSymbols() {
  const symbols = [
    { text: "%", top: "12%", left: "8%", size: "48px" },
    { text: "📊", top: "25%", left: "85%", size: "34px" },
    { text: "x̄", top: "72%", left: "14%", size: "34px" },
    { text: "📈", top: "80%", left: "75%", size: "40px" },
    { text: "Σ", top: "45%", left: "92%", size: "34px" },
    { text: "100%", top: "18%", left: "45%", size: "28px" },
    { text: "🥧", top: "62%", left: "52%", size: "30px" },
    { text: "y-axis", top: "88%", left: "38%", size: "26px" }
  ];

  return (
    <div className="floating-bg-container">
      {symbols.map((s, idx) => (
        <span
          key={idx}
          className="floating-bg-item"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: `${idx * 2.2}s`
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}

export function TopNav({ phase, completed = {}, muted, onToggleMute, onHome, onGoPhase, slideInfo }) {
  const phases = [
    { num: '01', key: 'wonder', label: 'Wonder', icon: '🧙' },
    { num: '02', key: 'story', label: 'Story', icon: '📖' },
    { num: '03', key: 'simulate', label: 'Simulate', icon: '🧪' },
    { num: '04', key: 'practice', label: 'Practice', icon: '🎮' },
    { num: '05', key: 'reflect', label: 'Reflect', icon: '📝' }
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 px-2 sm:px-5 py-2 sm:py-3.5 flex flex-col items-center z-50 pointer-events-none">
      {/* Top Navbar Main Row */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-1 sm:gap-2 pointer-events-none">
        {/* Top Left: Home Button Pill */}
        <button
          onClick={onHome}
          className="pointer-events-auto bg-[#180c3c]/90 hover:bg-[#25145b] border border-white/25 text-white font-display font-800 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0"
        >
          <span className="text-sm sm:text-base">🏠</span>
          <span className="hidden xs:inline">Home</span>
        </button>

        {/* Top Center: Adaptive Capsule Progress Bar */}
        <nav className="pointer-events-auto bg-[#160a36]/90 border border-white/20 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1 sm:gap-2 max-w-[calc(100vw-90px)] sm:max-w-none overflow-x-auto scrollbar-none">
          {phases.map((p, idx) => {
            const isActive = phase === p.key;

            return (
              <React.Fragment key={p.key}>
                {idx > 0 && <span className="hidden sm:block w-2.5 sm:w-4 h-[1.5px] bg-white/25 shrink-0" />}

                <button
                  onClick={() => onGoPhase(p.key)}
                  title={p.label}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-display font-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#3b1c8c] text-white border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.45)] scale-102'
                      : 'bg-transparent text-slate-300 hover:text-white border border-transparent hover:border-white/10'
                  }`}
                >
                  {/* Number Pill Badge (Visible on tablet/desktop) */}
                  <span className={`hidden md:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-black items-center justify-center shrink-0 ${
                    isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/15 text-slate-200'
                  }`}>
                    {p.num}
                  </span>

                  {/* Icon */}
                  <span className="text-xs sm:text-sm">{p.icon}</span>

                  {/* Label: Always visible when active; on desktop visible for all */}
                  <span className={`tracking-tight ${isActive ? 'inline text-xs sm:text-sm' : 'hidden lg:inline text-xs sm:text-sm'}`}>
                    {p.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}

          {/* Separator before Audio Toggle */}
          <span className="w-2 sm:w-4 h-[1.5px] bg-white/25 shrink-0" />

          {/* Audio Mute/Unmute Pill */}
          <button
            onClick={onToggleMute}
            title={muted ? "Unmute Audio" : "Mute Audio"}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-display font-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-all duration-200 cursor-pointer border shrink-0 ${
              muted
                ? 'bg-rose-950/80 border-rose-400/50 text-rose-300'
                : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
            }`}
          >
            <span className="text-xs sm:text-sm">{muted ? "🔇" : "🔊"}</span>
            <span className="hidden sm:inline text-xs sm:text-sm">{muted ? "Muted" : "Unmuted"}</span>
          </button>
        </nav>

        {/* Top Right: Close (X) Button */}
        <button
          onClick={onHome}
          title="Close"
          className="pointer-events-auto w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Centered Slide Progress Track Bar (Appears below Navbar Capsule during Story Phase) */}
      {slideInfo && (
        <div className="pointer-events-auto mt-2 sm:mt-3 w-full max-w-xl px-4 flex items-center gap-2 sm:gap-3 fade-in-up">
          <div className="flex-1 bg-white/15 h-2 sm:h-2.5 rounded-full overflow-hidden shadow-inner border border-white/10">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
              style={{ width: `${(slideInfo.current / slideInfo.total) * 100}%` }}
            />
          </div>
          <span className="font-display font-900 text-xs sm:text-sm text-white shrink-0">
            {slideInfo.current} / {slideInfo.total}
          </span>
        </div>
      )}
    </header>
  );
}
