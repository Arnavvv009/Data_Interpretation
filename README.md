# Graph Detective Quest — Data Interpretation & Misleading Graphs (Grade 7)

Built on the exact same architecture, layout, UI/UX, viewport rules, and
ElevenLabs "Alice" audio pipeline as your Circumference module — only the
topic content, questions, station activities, and illustrations are new.

## ⚠️ About the ElevenLabs API key you shared

You pasted a live ElevenLabs API key in plain text in chat. That key is now
exposed in this conversation and should be treated as compromised. Before
using it:

1. Go to your ElevenLabs dashboard → Profile → API Keys.
2. **Revoke/rotate that key** and generate a new one.
3. Put the *new* key only in your local `.env.local` file (never in chat,
   code, or anywhere that gets committed/shared).

This sandbox has no internet access, so the real ElevenLabs API could not be
called from here — no key was stored or used anywhere in this project. The
app runs perfectly without it: `src/audio.js` automatically falls back to
the browser's built-in speech voice for narration until you generate the
real ElevenLabs files yourself (see below).

## Getting started

```bash
npm install
npm run dev
```

## Generating real ElevenLabs "Alice" narration (optional)

The app sounds great immediately using the browser voice fallback. To swap
in real ElevenLabs audio (same voice, same per-style settings as your
original module):

```bash
cp .env.local.example .env.local
# edit .env.local and paste your NEW (rotated) ElevenLabs key
npm run gen-audio      # generates public/assets/audio/*.mp3 from src/audioMap.js
npm run clean-audio    # optional — removes any orphaned .mp3 files
```

## What changed vs. what stayed the same

**Same as your Circumference module:**
- Exact 5-phase architecture: Wonder → Story → Simulate → Practice → Reflect
- Same glass-card / cosmic-purple design system, fonts, colors, buttons, nav
- Same `TopNav`, phase progress bar, story slide navigation
- Same 3-station simulation layout, 10-world practice grid, hearts/streak
  quiz mechanics, star-rating unlock system, reflection + celebration screens
- Same ElevenLabs "Alice" voice pipeline architecture (`audio.js`,
  `audioMap.js`, `scripts/generate_audio.js`, `scripts/clean_audio.js`) with
  browser-speech automatic fallback

**New for this topic (Data Interpretation & Misleading Graphs):**
- All new narration script, story beats, and quiz questions
- Custom inline SVG illustrations for every story slide (bar/line/pie scenes
  and "honest vs. misleading" comparisons) instead of photographic images —
  this keeps the app 100% self-contained with zero external image API calls
  or asset downloads, and matches the zero-latency, offline-first spirit of
  the original pipeline
- 3 new simulation stations: **Graph Reader Lab** (read exact chart values),
  **Spot the Trick** (identify truncated axis / inconsistent scale /
  cherry-picked range), **Fix the Graph** (repair a misleading chart)
- 10 new procedurally-generated "Data Detective" practice worlds covering
  bar/line/pie reading, mean, range, and all three misleading-graph tricks
