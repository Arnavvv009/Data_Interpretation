/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2
   Mirrors the numberbound / Circumference-quest audio pipeline exactly:
   pre-generated .mp3 files are tried first (via seg.file), and the browser's
   speechSynthesis voice is used as an automatic fallback if a file is
   missing or fails to load — so the app always has sound, even before
   `npm run gen-audio` has been run.
   ========================================================================= */
export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";

export const STYLE_SETTINGS = {
  celebration: {
    stability: 0.12,
    similarity_boost: 0.45,
    style: 0.75,
    rate: 1.06,
    pitch: 1.2
  },
  encouragement: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.65,
    rate: 1.0,
    pitch: 1.1
  },
  question: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.55,
    rate: 0.98,
    pitch: 1.08
  },
  emphasis: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.60,
    rate: 0.95,
    pitch: 1.05
  },
  thinking: {
    stability: 0.24,
    similarity_boost: 0.60,
    style: 0.35,
    rate: 0.90,
    pitch: 0.95
  },
  statement: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.50,
    rate: 1.0,
    pitch: 1.0
  }
};

export let audioMuted = false;
let ttsVoice = null;
let currentAudioElement = null;

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    ttsVoice = pickVoice();
  };
  ttsVoice = pickVoice();
}

let currentQueue = 0;

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch (e) {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export function speakSegment(seg, myQueue = currentQueue) {
  return new Promise((resolve) => {
    if (audioMuted || !seg || !seg.text || myQueue !== currentQueue) return resolve();

    // Kill any existing audio before playing next
    if (currentAudioElement) {
      try {
        currentAudioElement.pause();
        currentAudioElement.currentTime = 0;
        currentAudioElement.src = '';
      } catch (e) {}
      currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    if (myQueue !== currentQueue) return resolve();

    // Check if seg has an audio file associated and try HTML5 Audio
    if (seg.file) {
      try {
        const audio = new Audio(seg.file);
        currentAudioElement = audio;

        audio.onended = () => {
          if (currentAudioElement === audio) currentAudioElement = null;
          resolve();
        };

        audio.onerror = () => {
          if (currentAudioElement === audio) currentAudioElement = null;
          if (myQueue === currentQueue) {
            fallbackSpeech(seg, myQueue).then(resolve);
          } else {
            resolve();
          }
        };

        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(() => {
            if (currentAudioElement === audio) currentAudioElement = null;
            if (myQueue === currentQueue) {
              fallbackSpeech(seg, myQueue).then(resolve);
            } else {
              resolve();
            }
          });
        }
        return;
      } catch (e) {
        // Fallback to speech synthesis
      }
    }

    fallbackSpeech(seg, myQueue).then(resolve);
  });
}

function fallbackSpeech(seg, myQueue = currentQueue) {
  return new Promise((resolve) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text || myQueue !== currentQueue) {
      return resolve();
    }
    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = currentQueue;
  const segList = Array.isArray(segments) ? segments : [segments];
  for (const seg of segList) {
    if (myQueue !== currentQueue || audioMuted) return;
    await speakSegment(seg, myQueue);
  }
}

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'encouragement' });
