import fs from 'fs';
import path from 'path';

const questions = JSON.parse(fs.readFileSync('./src/utils/questionsData.json', 'utf8'));

// 1. Build src/utils/topicData.js
const topicDataContent = `/* =========================================================================
   DATA & GRAPH QUESTION DATA
   Deterministic Grade 7 "Data Interpretation & Misleading Graphs" questions
   across 10 themed worlds (10 questions per world = 100 total questions).
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Lunchbox Bar Charts", icon: "🍱", range: "Q1–10", difficulty: 1, archetypes: ["bar_read"] },
  { id: 1, name: "Weather Line Graphs", icon: "🌦️", range: "Q11–20", difficulty: 1, archetypes: ["line_read"] },
  { id: 2, name: "Favorite Color Pie Charts", icon: "🎨", range: "Q21–30", difficulty: 2, archetypes: ["pie_read", "pie_percent_to_count"] },
  { id: 3, name: "Sports Stats Arena", icon: "🏀", range: "Q31–40", difficulty: 2, archetypes: ["mean"] },
  { id: 4, name: "Game Score Range", icon: "🎯", range: "Q41–50", difficulty: 2, archetypes: ["range"] },
  { id: 5, name: "Truncated Tower", icon: "🏗️", range: "Q51–60", difficulty: 3, archetypes: ["trick_truncated"] },
  { id: 6, name: "Scale Scramble Lab", icon: "🧪", range: "Q61–70", difficulty: 3, archetypes: ["trick_scale"] },
  { id: 7, name: "Timeline Trickster", icon: "🕰️", range: "Q71–80", difficulty: 3, archetypes: ["trick_cherry"] },
  { id: 8, name: "Compare-o-Matic", icon: "⚖️", range: "Q81–90", difficulty: 4, archetypes: ["compare_misleading"] },
  { id: 9, name: "Graph Detective HQ", icon: "🕵️", range: "Q91–100", difficulty: 4, archetypes: ["bar_read", "line_read", "pie_read", "mean", "range", "trick_truncated", "trick_scale", "trick_cherry", "compare_misleading"] }
];

export const DETERMINISTIC_QUESTIONS = ${JSON.stringify(questions, null, 2)};

export function getQuestion(worldIndex = 0, questionIndex = 0) {
  const worldQuestions = DETERMINISTIC_QUESTIONS.filter(q => q.worldIndex === worldIndex);
  if (!worldQuestions.length) return DETERMINISTIC_QUESTIONS[0];
  const q = worldQuestions[questionIndex % worldQuestions.length];
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const audioKey = \`practice_w\${worldIndex}_q\${(questionIndex % worldQuestions.length) + 1}\`;
  const hintAudioKey = \`practice_w\${worldIndex}_q\${(questionIndex % worldQuestions.length) + 1}_hint\`;
  return {
    ...q,
    world,
    audioKey,
    hintAudioKey
  };
}

export function makeQuestion(worldIndex = 0, questionIndex = 0) {
  return getQuestion(worldIndex, questionIndex);
}
`;

fs.writeFileSync('./src/utils/topicData.js', topicDataContent);
console.log("Updated src/utils/topicData.js successfully!");

// 2. Build src/audioMap.js
const baseAudioMap = {
  "wonder_1": {
    text: "Two companies show you the exact same sales numbers. One chart makes growth look small. The other makes it look enormous. Same numbers, totally different story. How do graphs do that?",
    style: "question",
    file: "/assets/audio/wonder_1.mp3"
  },
  "story_1": {
    text: "Every day you see graphs in the news, in ads, and on social media. Bar graphs, line graphs, and pie charts all turn piles of numbers into pictures we can understand in seconds. But a picture can be built honestly, or it can be built to trick you.",
    style: "statement",
    file: "/assets/audio/story_1.mp3"
  },
  "story_2": {
    text: "A bar graph uses the height of each bar to show a value. Always check two things first: what does each axis measure, and what is the scale, meaning how much each gridline is worth. Skip that check, and a bar graph can fool you.",
    style: "emphasis",
    file: "/assets/audio/story_2.mp3"
  },
  "story_3": {
    text: "A line graph connects points to show how something changes over time, like temperature, price, or population. The steepness of the line tells you how fast the change is happening. A steep climb means fast growth. A flat line means no change at all.",
    style: "statement",
    file: "/assets/audio/story_3.mp3"
  },
  "story_4": {
    text: "A pie chart shows how a whole is split into parts, using percentages that must add up to 100. It answers 'what share of the total,' not 'how many.' If the slices don't sum to 100 percent, something is wrong with the chart.",
    style: "statement",
    file: "/assets/audio/story_4.mp3"
  },
  "story_5": {
    text: "Trick number one: the truncated axis. When a graph's y-axis starts at 90 instead of 0, tiny differences get stretched into towering bars. Always check where the axis actually begins before you trust what you see.",
    style: "emphasis",
    file: "/assets/audio/story_5.mp3"
  },
  "story_6": {
    text: "Trick number two: inconsistent scale. If the gridlines jump by 10, then suddenly by 50, equal-looking gaps stop meaning equal amounts. A fair graph always uses the same size step every time.",
    style: "emphasis",
    file: "/assets/audio/story_6.mp3"
  },
  "story_7": {
    text: "Trick number three: cherry-picked range. Showing only the days where a value went up, while hiding the days it dropped, tells a one-sided story. A trustworthy graph shows the full timeline, not just the flattering part.",
    style: "encouragement",
    file: "/assets/audio/story_7.mp3"
  },
  "story_8": {
    text: "You're becoming a real Graph Detective! Remember the checklist: check the axis start, check the scale, and check the range. Now step into the Simulation Lab to read real charts and catch these tricks in action!",
    style: "celebration",
    file: "/assets/audio/story_8.mp3"
  },
  "sim_1": {
    text: "Welcome to the Graph Reader Lab. Drag the control to move across the bars, points, or slices, and read the exact value straight off the chart!",
    style: "encouragement",
    file: "/assets/audio/sim_1.mp3"
  },
  "sim_2": {
    text: "Welcome to Spot the Trick. Compare the dressed-up graph with its honest twin, then choose which trick is being used to exaggerate the story!",
    style: "statement",
    file: "/assets/audio/sim_2.mp3"
  },
  "sim_3": {
    text: "Welcome to Fix the Graph. A misleading chart is shown broken. Choose the correct setting to repair it into a fair, honest graph!",
    style: "question",
    file: "/assets/audio/sim_3.mp3"
  },
  "reflect_1": {
    text: "Great work completing the module! In your own words, explain what makes a graph misleading and describe one trick you now know how to catch.",
    style: "thinking",
    file: "/assets/audio/reflect_1.mp3"
  }
};

for (const q of questions) {
  const w = q.worldIndex;
  const qNum = q.qIndex + 1;
  const keyPrompt = `practice_w${w}_q${qNum}`;
  const keyHint = `practice_w${w}_q${qNum}_hint`;

  baseAudioMap[keyPrompt] = {
    text: q.prompt,
    style: "question",
    file: `/assets/audio/${keyPrompt}.mp3`
  };

  baseAudioMap[keyHint] = {
    text: q.explanation,
    style: "thinking",
    file: `/assets/audio/${keyHint}.mp3`
  };
}

const audioMapContent = `/* =========================================================================
   AUDIO MAP — Mapping fixed text keys to audio files or speech text
   Topic: Data Interpretation & Misleading Graphs (Grade 7)
   Includes Simulation Guidance and all 100 Practice Questions + Hints.
   ========================================================================= */
export const AUDIO_MAP = ${JSON.stringify(baseAudioMap, null, 2)};
`;

fs.writeFileSync('./src/audioMap.js', audioMapContent);
console.log(`Updated src/audioMap.js with ${Object.keys(baseAudioMap).length} total audio entries!`);
