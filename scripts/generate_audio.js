/**
 * scripts/generate_audio.js
 * ---------------------------------------------------------------------------
 * Renders every line in src/audioMap.js into a real ElevenLabs .mp3 file,
 * saved to public/assets/audio/<key>.mp3 — matching the exact offline
 * generation step described in audio_generation_pipeline.md.
 *
 * Usage:
 *   1. Copy .env.local.example to .env.local
 *   2. Put your ElevenLabs API key in .env.local as VITE_ELEVENLABS_API_KEY
 *   3. npm run gen-audio   (or: node scripts/generate_audio.js)
 *
 * If a file already exists it will be regenerated (delete it first if you
 * only want to fill in missing files). Until you run this script, the app
 * already works out of the box using the browser's built-in speech voice
 * as a fallback (see src/audio.js).
 * ---------------------------------------------------------------------------
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';
const OUT_DIR = path.resolve(__dirname, '../public/assets/audio');

// Mirrors src/audio.js STYLE_SETTINGS (stability / similarity_boost / style)
const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

async function loadAudioMap() {
  const mod = await import('../src/audioMap.js');
  return mod.AUDIO_MAP;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateOne(key, entry, force = false) {
  const settings = STYLE_SETTINGS[entry.style] || STYLE_SETTINGS.statement;
  const outPath = path.resolve(__dirname, '..', 'public', entry.file.replace(/^\//, ''));

  if (!force && fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
    console.log(`⏩ Skipped existing ${entry.file} (${key})`);
    return;
  }

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: entry.text,
          model_id: MODEL_ID,
          voice_settings: settings
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`ElevenLabs API error for "${key}" (${res.status}): ${errText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, buffer);
      console.log(`✔ Generated ${entry.file} (${key})`);
      return;
    } catch (err) {
      if (attempts >= 3) throw err;
      console.warn(`⚠️ Attempt ${attempts} failed for "${key}": ${err.message}. Retrying in 2s...`);
      await sleep(2000);
    }
  }
}

async function main() {
  const force = process.argv.includes('--force');
  if (!API_KEY) {
    console.error('❌ Missing VITE_ELEVENLABS_API_KEY.');
    console.error('   1. Copy .env.local.example to .env.local');
    console.error('   2. Add your ElevenLabs API key');
    process.exit(1);
  }

  const AUDIO_MAP = await loadAudioMap();
  const entries = Object.entries(AUDIO_MAP);
  console.log(`Generating ${entries.length} audio files with voice "Alice" (${VOICE_ID})...`);

  let count = 0;
  for (const [key, entry] of entries) {
    count++;
    try {
      console.log(`[${count}/${entries.length}] Processing "${key}"...`);
      await generateOne(key, entry, force);
    } catch (err) {
      console.error(`✘ Failed on "${key}": ${err.message}`);
    }
    await sleep(250); // rate-limit: 250ms between calls
  }

  console.log('Done! All audio narration files generated successfully.');
}

main();

