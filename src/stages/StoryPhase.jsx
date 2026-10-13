import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';
import { playClickSound } from '../utils/soundEffects.js';

const STORY_SLIDES = [
  {
    id: 1,
    category: "TERM FOUNDATIONS",
    title: "The Picture Power of Data",
    audioKey: "story_1",
    quote: "A graph turns a table of numbers into a story you can see!",
    bubble: "Let's learn to read that story — and spot when it's been rewritten!",
    icon: "📊",
    image: "/assets/images/story_slide_1.jpg"
  },
  {
    id: 2,
    category: "BAR GRAPH FOUNDATIONS",
    title: "Reading a Bar Graph",
    audioKey: "story_2",
    quote: "Always check the AXIS LABELS and the SCALE before trusting a bar!",
    bubble: "Bar height only means what the scale says it means.",
    icon: "📊",
    image: "/assets/images/story_slide_2.jpg"
  },
  {
    id: 3,
    category: "LINE GRAPH FOUNDATIONS",
    title: "Reading a Line Graph",
    audioKey: "story_3",
    quote: "Steeper line = faster change. Flat line = no change.",
    bubble: "Line graphs are perfect for tracking change over time!",
    icon: "📈",
    image: "/assets/images/story_slide_3.jpg"
  },
  {
    id: 4,
    category: "PIE CHART FOUNDATIONS",
    title: "Reading a Pie Chart",
    audioKey: "story_4",
    quote: "All the slices of a pie chart must add up to 100%.",
    bubble: "Pie charts show share of the whole, not raw counts!",
    icon: "🥧",
    image: "/assets/images/story_slide_4.jpg"
  },
  {
    id: 5,
    category: "MISLEADING GRAPH TRICK #1",
    title: "Trick #1: The Truncated Axis",
    audioKey: "story_5",
    quote: "Starting the y-axis above zero stretches small gaps into big ones.",
    bubble: "Rule 1: Always check where the y-axis actually starts!",
    icon: "⚠️",
    image: "/assets/images/story_slide_5.jpg"
  },
  {
    id: 6,
    category: "MISLEADING GRAPH TRICK #2",
    title: "Trick #2: Inconsistent Scale",
    audioKey: "story_6",
    quote: "Equal-looking gaps should always mean equal amounts.",
    bubble: "Rule 2: Check that every gridline step is the same size!",
    icon: "📏",
    image: "/assets/images/story_slide_6.jpg"
  },
  {
    id: 7,
    category: "MISLEADING GRAPH TRICK #3",
    title: "Trick #3: Cherry-Picked Range",
    audioKey: "story_7",
    quote: "Hiding the down days tells only half the story.",
    bubble: "Rule 3: Look for the FULL timeline, not just the flattering slice!",
    icon: "🔍",
    image: "/assets/images/story_slide_7.jpg"
  },
  {
    id: 8,
    category: "GRAPH DETECTIVE TOOLKIT",
    title: "Become a Graph Detective!",
    audioKey: "story_8",
    quote: "Checklist: Axis start? Equal scale? Full range?",
    bubble: "Time to catch these tricks yourself in the Simulation Lab!",
    icon: "🏆",
    image: "/assets/images/story_slide_8.jpg"
  }
];

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  const onSlideChangeRef = useRef(onSlideChange);
  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  });

  useEffect(() => {
    if (onSlideChangeRef.current) {
      onSlideChangeRef.current(slideIdx + 1, STORY_SLIDES.length);
    }
    stopNarration();
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    stopNarration();
    playClickSound(muted);
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    stopNarration();
    playClickSound(muted);
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-4 md:p-6 py-4 sm:py-6 relative overflow-y-auto select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-4xl flex flex-col items-center justify-between z-20 my-auto">
        {/* Top Progress Bar */}
        <div className="w-full flex items-center justify-between mb-2 sm:mb-2.5 px-1">
          <div className="flex-1 h-2 bg-purple-950/80 rounded-full overflow-hidden mr-3 sm:mr-4 border border-purple-800/40">
            <div
              className="h-full bg-amber-400 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
              style={{ width: `${((slideIdx + 1) / STORY_SLIDES.length) * 100}%` }}
            />
          </div>
          <span className="font-display font-900 text-xs sm:text-sm text-slate-200 shrink-0">
            {slideIdx + 1} / {STORY_SLIDES.length}
          </span>
        </div>

        {/* Main Card */}
        <div className="w-full bg-[#150a33]/95 border-2 border-purple-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-2.5 sm:gap-4">
          {/* Top: Responsive Aspect Ratio Cartoon Image Banner */}
          <div className="w-full aspect-[16/9] sm:aspect-[20/8] max-h-[220px] sm:max-h-[280px] relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-500/30 bg-[#0d0426] shadow-lg group shrink-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-102"
            />

            {/* Holographic Cosmic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0529]/70 via-transparent to-black/20 pointer-events-none" />

            {/* Top Left: Category Badge */}
            <div className="absolute top-2 left-2.5 sm:top-2.5 sm:left-3 bg-[#1e0f45]/90 border border-amber-400/80 backdrop-blur-md px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-md">
              <span className="text-xs text-amber-300">✨</span>
              <span className="font-display font-900 text-[10px] sm:text-xs text-amber-300 tracking-wider uppercase">
                {slide.category}
              </span>
            </div>

            {/* Top Right: Slide Number Badge */}
            <div className="absolute top-2 right-2.5 sm:top-2.5 sm:right-3 bg-black/75 backdrop-blur-md px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full shadow-md">
              <span className="font-display font-900 text-[10px] sm:text-xs text-white">
                Slide {slideIdx + 1} / {STORY_SLIDES.length}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display font-900 text-lg sm:text-2xl md:text-3xl text-amber-400 leading-tight">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
            {AUDIO_MAP[slide.audioKey]?.text}
          </p>

          {/* Bottom Row: 2-Column Boxes (Quote Pill & White Speech Pill) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            {/* Left Box: Gold/Purple Quote Box */}
            <div className="bg-[#1b0d3e]/90 border border-amber-400/60 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-center text-center shadow-md">
              <span className="text-amber-400 text-sm mr-2 shrink-0">✨</span>
              <span className="text-amber-300 font-display font-900 text-xs sm:text-sm leading-tight">
                "{slide.quote}"
              </span>
              <span className="text-amber-400 text-sm ml-2 shrink-0">✨</span>
            </div>

            {/* Right Box: White Bubble Card */}
            <div className="bg-white text-[#0b031c] rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 shadow-xl">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-100 flex items-center justify-center text-base sm:text-xl shrink-0 shadow-inner">
                {slide.icon}
              </div>
              <p className="font-display font-black text-xs sm:text-sm leading-snug text-left flex-1">
                {slide.bubble}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Row */}
        <div className="w-full flex items-center justify-between gap-2 mt-3 sm:mt-4 px-1">
          {/* Back Button */}
          <button
            onClick={goPrev}
            disabled={slideIdx === 0}
            className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border border-white/25 text-white font-display font-900 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full cursor-pointer transition disabled:opacity-25 disabled:cursor-not-allowed shadow-md hover:scale-105 shrink-0"
          >
            ← Back
          </button>

          {/* Dot Pagination (Compact on mobile) */}
          <div className="hidden xs:flex items-center gap-1.5 sm:gap-2">
            {STORY_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  playClickSound(muted);
                  setSlideIdx(i);
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === slideIdx
                    ? 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.9)] scale-110'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Next / Proceed Button */}
          <button
            onClick={goNext}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-900 text-xs sm:text-sm md:text-base px-5 sm:px-8 py-2 sm:py-2.5 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0"
          >
            <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
