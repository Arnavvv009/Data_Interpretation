import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { PRACTICE_WORLDS, getQuestion, makeQuestion } from '../utils/topicData.js';
import { ChartDiagram } from '../components/ChartDiagram.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { cheer, instruct, narrate, stopNarration } from '../audio.js';

/* =========================================================================
   PRACTICE WORLD SELECT GRID (ONLY SHOW REFLECT BUTTON WHEN ALL 10 WORLDS COMPLETED)
   ========================================================================= */
export function PracticeWorldSelect({ worldResults, onPlay, onGoReflect }) {
  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allWorldsCompleted = worldResults.length === 10 && worldResults.every(r => r != null && r > 0);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-5xl max-h-[94vh] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto py-5 px-6 overflow-hidden">
        <div className="phase-band phase-band--play mb-2 shrink-0" />

        <div className="w-full flex items-center justify-between mb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🎮</span>
            <div className="text-left">
              <h2 className="text-section-heading text-emerald-200 text-2xl sm:text-3xl font-900">
                Data Detective Worlds
              </h2>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-300">
                10 Themed Worlds · Need 4/10 Correct to Unlock Next World
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#14082c]/90 border-2 border-emerald-400/40 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
              <span className="text-amber-400 text-lg">⭐</span>
              <span className="font-display font-900 text-white text-base sm:text-lg">
                {totalStars} / 30
              </span>
            </div>

            {allWorldsCompleted && (
              <button
                onClick={() => {
                  stopNarration();
                  onGoReflect();
                }}
                className="btn-gold text-base font-900 px-6 py-2.5 shadow-lg cursor-pointer animate-bounce"
              >
                Go to Reflect 📝
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full my-auto flex-1 min-h-0 overflow-y-auto p-1">
          {PRACTICE_WORLDS.map((w, idx) => {
            const isUnlocked = idx === 0 || (worldResults[idx - 1] != null && worldResults[idx - 1] > 0);
            const stars = worldResults[idx];

            return (
              <div
                key={w.id}
                onClick={() => {
                  if (isUnlocked) {
                    stopNarration();
                    onPlay(idx);
                  }
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all duration-300 h-36 sm:h-44 ${
                  isUnlocked
                    ? 'bg-[#14082c]/95 border-emerald-400/50 hover:border-emerald-300 hover:scale-105 cursor-pointer shadow-xl'
                    : 'bg-[#100724]/40 border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-300">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md">W{idx + 1}</span>
                  <span className="text-emerald-300 font-mono font-bold">{w.range}</span>
                </div>

                <span className="text-4xl sm:text-6xl my-1 drop-shadow-md">{isUnlocked ? w.icon : "🔒"}</span>

                <span className="font-display font-900 text-white text-base sm:text-lg leading-tight line-clamp-1">
                  {w.name}
                </span>

                <div className="mt-1">
                  {isUnlocked ? (
                    stars != null && stars > 0 ? (
                      <span className="text-amber-400 text-base tracking-widest font-black">
                        {"★".repeat(stars)}{"☆".repeat(3 - stars)}
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs sm:text-sm font-900">Play →</span>
                    )
                  ) : (
                    <span className="text-slate-400 text-xs font-extrabold">Locked (Need 4/10)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PRACTICE QUIZ COMPONENT — hearts-based, 10 questions per world
   ========================================================================= */
export function PracticeQuiz({ worldIndex, muted, addXp, onFinish }) {
  const world = PRACTICE_WORLDS[worldIndex];
  const [qIndex, setQIndex] = useState(0);
  const [qData, setQData] = useState(() => getQuestion(worldIndex, 0));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [popupState, setPopupState] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    stopNarration();
    const data = getQuestion(worldIndex, qIndex);
    setQData(data);
    setSelectedIdx(null);
    setPopupState(null);

    // Narrate the question prompt
    if (data && data.audioKey && AUDIO_MAP[data.audioKey]) {
      narrate(AUDIO_MAP[data.audioKey], !muted);
    }

    return () => {
      stopNarration();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [qIndex, worldIndex, muted]);

  const restartQuiz = () => {
    stopNarration();
    setQIndex(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setSelectedIdx(null);
    setPopupState(null);
    const data = getQuestion(worldIndex, 0);
    setQData(data);
    if (data && data.audioKey && AUDIO_MAP[data.audioKey]) {
      narrate(AUDIO_MAP[data.audioKey], !muted);
    }
  };

  const handleOptionClick = (idx) => {
    if (selectedIdx != null || lives <= 0 || popupState != null) return;

    stopNarration();
    setSelectedIdx(idx);
    const isCorrect = idx === qData.correctIndex;

    let updatedLives = lives;
    let updatedCorrectCount = correctCount;

    if (isCorrect) {
      updatedCorrectCount = correctCount + 1;
      setCorrectCount(updatedCorrectCount);
      setStreak(s => s + 1);
      addXp(10);
      setPopupState({
        type: 'correct',
        title: 'Correct! 🎉',
        text: qData.explanation
      });
      // Narrate the hint/explanation audio
      if (qData.hintAudioKey && AUDIO_MAP[qData.hintAudioKey]) {
        narrate(AUDIO_MAP[qData.hintAudioKey], !muted);
      }
    } else {
      updatedLives = lives - 1;
      setLives(updatedLives);
      setStreak(0);
      setPopupState({
        type: 'incorrect',
        title: 'Not quite!',
        text: `Solution: ${qData.explanation}`
      });
      // Narrate the hint/explanation audio
      if (qData.hintAudioKey && AUDIO_MAP[qData.hintAudioKey]) {
        narrate(AUDIO_MAP[qData.hintAudioKey], !muted);
      }
    }

    timerRef.current = setTimeout(() => {
      setPopupState(null);
      if (updatedLives > 0) {
        if (qIndex < 9) {
          setQIndex(i => i + 1);
        } else {
          let stars = 0;
          if (updatedCorrectCount >= 8) stars = 3;
          else if (updatedCorrectCount >= 6) stars = 2;
          else if (updatedCorrectCount >= 4) stars = 1;
          stopNarration();
          onFinish(worldIndex, stars);
        }
      }
    }, 4500);
  };

  const isGameOver = lives <= 0;
  const progressPercent = Math.round(((qIndex + 1) / 10) * 100);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {popupState && !isGameOver && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in-up">
          <div className={`w-88 sm:w-[420px] rounded-3xl p-7 sm:p-8 shadow-2xl flex flex-col items-center text-center border-4 border-white/20 scale-105 transition-all duration-300 ${
            popupState.type === 'correct'
              ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-emerald-700 text-white shadow-[0_0_50px_rgba(52,211,153,0.7)]'
              : 'bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 text-white shadow-[0_0_50px_rgba(244,63,94,0.7)]'
          }`}>
            <span className="text-7xl sm:text-8xl mb-3 drop-shadow-lg animate-bounce">
              {popupState.type === 'correct' ? '🎉' : '🥺'}
            </span>
            <h3 className="font-display font-900 text-3xl sm:text-4xl text-white mb-2 leading-tight">
              {popupState.title}
            </h3>
            <p className="font-extrabold text-base sm:text-lg text-slate-100 leading-relaxed max-w-sm">
              {popupState.text}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl max-h-[94vh] flex flex-col items-center text-center fade-in-up z-20 my-auto overflow-hidden">
        <div className="w-full flex items-center justify-start mb-2 shrink-0">
          <button
            onClick={() => {
              stopNarration();
              onFinish(worldIndex, null);
            }}
            className="bg-[#1c0e3a]/90 hover:bg-[#2e175c] border border-purple-400/40 text-slate-200 font-display font-900 text-sm sm:text-base px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition"
          >
            <span>← Worlds</span>
          </button>
        </div>

        <div className="w-full bg-[#150a36]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-display font-900 text-lg sm:text-xl px-7 py-2 rounded-full shadow-[0_0_25px_rgba(244,63,94,0.75)] mb-4 flex items-center gap-2 shrink-0">
            <span>⭐</span>
            <span>{world.name}</span>
          </div>

          <div className="w-full flex items-center justify-between px-4 sm:px-12 mb-3 shrink-0">
            <div className="bg-[#10072a] border border-purple-400/30 rounded-full px-5 py-2 flex items-center gap-2 shadow-inner">
              <span className="text-amber-400 text-base">⭐</span>
              <span className="font-display font-900 text-white text-sm sm:text-base">{correctCount * 10}</span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map(h => (
                <span key={h} className="text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(239,68,68,0.75)]">
                  {h <= lives ? "❤️" : "🖤"}
                </span>
              ))}
            </div>

            <div className="bg-[#10072a] border border-purple-400/30 rounded-full px-5 py-2 flex items-center gap-2 shadow-inner">
              <span className="text-amber-400 text-base">🔥</span>
              <span className="font-display font-900 text-amber-300 text-sm sm:text-base">{streak}x</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-between text-xs sm:text-sm font-display font-900 text-slate-300 px-1 mb-1.5 shrink-0">
            <span>Question {qIndex + 1}/10</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-purple-950/80 rounded-full mb-5 overflow-hidden border border-purple-500/20 shrink-0">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(56,189,248,0.85)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isGameOver ? (
            <div className="w-full my-auto flex flex-col items-center justify-center gap-5 py-8 shrink-0 fade-in-up">
              <span className="text-6xl sm:text-7xl drop-shadow-lg">🥺</span>
              <h3 className="font-display font-900 text-rose-500 text-3xl sm:text-4xl">Out of Hearts!</h3>
              <p className="font-extrabold text-slate-200 text-sm sm:text-base max-w-lg text-center leading-relaxed">
                Nova says: "No worries, detective! Let's investigate this world again."
              </p>

              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={restartQuiz}
                  className="btn-gold font-display font-900 text-sm sm:text-base px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <span>🔁</span>
                  <span>Retry World</span>
                </button>
                <button
                  onClick={() => onFinish(worldIndex, 0)}
                  className="bg-[#1c0d3a] hover:bg-[#2e175c] border border-purple-400/40 text-slate-200 font-display font-900 text-sm sm:text-base px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md cursor-pointer transition"
                >
                  <span>🚪</span>
                  <span>Quit World</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4 flex-1 min-h-0">
              <div className="w-full bg-[#0c0520] border-2 border-purple-400/30 rounded-3xl p-5 sm:p-6 flex flex-col items-center relative shadow-inner">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-display font-900 text-xs sm:text-sm px-6 py-1.5 rounded-full shadow-[0_0_18px_rgba(250,204,21,0.7)] absolute -top-4 tracking-wider uppercase">
                  ✦ GRAPH RULE
                </div>

                <div className="my-2 shrink-0">
                  <ChartDiagram diagramData={qData.diagramData} size={220} />
                </div>

                <p className="font-display font-900 text-white text-xl sm:text-2xl max-w-3xl text-center leading-snug mt-2">
                  {qData.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-1">
                {qData.options.map((opt, idx) => {
                  let btnStyle = "bg-[#14082e]/95 border-2 border-purple-400/30 text-white hover:border-cyan-400 hover:bg-[#1f0f45]";
                  if (selectedIdx != null) {
                    if (idx === qData.correctIndex) {
                      btnStyle = "bg-emerald-600 text-white border-2 border-emerald-300 font-900 shadow-[0_0_20px_rgba(52,211,153,0.65)] scale-[1.02]";
                    } else if (idx === selectedIdx) {
                      btnStyle = "bg-rose-600 text-white border-2 border-rose-300 font-900 animate-shake";
                    } else {
                      btnStyle = "bg-[#100724]/40 border-2 border-white/10 text-slate-400 opacity-40";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedIdx != null}
                      onClick={() => handleOptionClick(idx)}
                      className={`py-4 sm:py-5 px-6 rounded-2xl font-display font-900 text-lg sm:text-xl transition-all duration-200 cursor-pointer text-center shadow-lg ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
