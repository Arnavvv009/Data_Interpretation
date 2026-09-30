/**
 * scripts/clean_audio.js
 * ---------------------------------------------------------------------------
 * Removes any .mp3 file in public/assets/audio/ that is no longer
 * referenced by src/audioMap.js — keeps the repo tidy after editing
 * narration text. Mirrors the cleanup step in audio_generation_pipeline.md.
 *
 * Usage: npm run clean-audio
 * ---------------------------------------------------------------------------
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.resolve(__dirname, '../public/assets/audio');

async function main() {
  const mod = await import('../src/audioMap.js');
  const AUDIO_MAP = mod.AUDIO_MAP;

  const validFiles = new Set(
    Object.values(AUDIO_MAP).map(entry => path.basename(entry.file))
  );

  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('No audio directory found — nothing to clean.');
    return;
  }

  const existingFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  let removed = 0;

  for (const file of existingFiles) {
    if (!validFiles.has(file)) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      console.log(`🗑  Removed orphaned file: ${file}`);
      removed++;
    }
  }

  console.log(removed > 0 ? `Cleaned up ${removed} orphaned file(s).` : 'Nothing to clean — all files are referenced.');
}

main();
