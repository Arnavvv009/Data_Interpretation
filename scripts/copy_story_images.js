import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\Arnav\\.gemini\\antigravity-ide\\brain\\ef3a59db-36f0-4373-9de2-dc2cb2607a62';
const targetDir = path.resolve('public/assets/images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

const mapping = {
  1: 'story_slide_1_power_of_data',
  2: 'story_slide_2_bar_graph',
  3: 'story_slide_3_line_graph',
  4: 'story_slide_4_pie_chart',
  5: 'story_slide_5_truncated_axis',
  6: 'story_slide_6_inconsistent_scale',
  7: 'story_slide_7_cherrypicked_range',
  8: 'story_slide_8_graduation'
};

for (const [id, prefix] of Object.entries(mapping)) {
  const match = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
  if (match) {
    const srcPath = path.join(sourceDir, match);
    const destPath = path.join(targetDir, `story_slide_${id}.jpg`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${match} -> story_slide_${id}.jpg`);
  } else {
    console.warn(`No match found for slide ${id} (${prefix})`);
  }
}
