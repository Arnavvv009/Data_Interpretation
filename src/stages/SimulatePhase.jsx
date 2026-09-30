import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, cheer, stopNarration } from '../audio.js';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/soundEffects.js';

/* =========================================================================
   REAL-WORLD GRADE 7 SIMULATION STATIONS (28 ACTIVITIES TOTAL — 7 PER SECTION)
   Station 1: Graph Reader & Live Data Sandbox (7 Activities)
   Station 2: Spot the Trick & Interactive Distortion Meter (7 Activities)
   Station 3: Graph Doctor Workshop (7 Repair Case Studies)
   Station 4: Misleading Graph Creator Studio (7 Hands-On Design Labs)
   ========================================================================= */

const INITIAL_STATION_DATA = {
  1: [
    {
      id: 1,
      title: "School Fitness Step Challenge",
      subtitle: "Smartwatch Step Log · Grade 7 Wellness Week",
      desc: "Maya and her classmates logged step counts on smartwatches. Read exact values, or switch to Sandbox Mode to drag bar heights and see how mean average steps recalculate live!",
      type: "bar",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      initialData: [3200, 4100, 2800, 5300, 4700, 6100],
      unit: "steps",
      icon: "👟",
      color: "#38bdf8",
      benchmark: 5000,
      contextSource: "Device ID #Fit-7B · Audited by Middle School Physical Ed Dept"
    },
    {
      id: 2,
      title: "Science Club Weather Station",
      subtitle: "Outdoor Digital Sensor · Weekly Temperature Log",
      desc: "The Grade 7 Science Club logged outdoor afternoon temperatures. Inspect daily points along the line, or edit temperature readings to see how slope steepness changes live!",
      type: "line",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      initialData: [18, 21, 19, 25, 23, 27],
      unit: "°C",
      icon: "🌡️",
      color: "#fb923c",
      contextSource: "Sensor Model TX-700 · School Weather Station HQ"
    },
    {
      id: 3,
      title: "Cafeteria Healthy Snack Survey",
      subtitle: "Student Council Poll · Sample Size = 200 Students",
      desc: "200 middle schoolers were surveyed about their favorite healthy lunch snacks. Click slices or adjust percentages to see how actual student counts update live!",
      type: "pie",
      initialData: [
        { label: "Fruit Cups", value: 35, color: "#38bdf8" },
        { label: "Yogurt", value: 25, color: "#4ade80" },
        { label: "Granola Bars", value: 28, color: "#facc15" },
        { label: "Nuts Mix", value: 12, color: "#f472b6" }
      ],
      unit: "%",
      icon: "🍿",
      totalStudents: 200,
      contextSource: "Middle School Nutrition Board · Certified 100% Survey Total"
    },
    {
      id: 4,
      title: "School Library Book Benchmark",
      subtitle: "Monthly Checkout Log · Grade 7 Reading Genres",
      desc: "The school librarian tracked monthly book checkouts across 5 genres. Inspect bar heights and drag values to see total books borrowed and average books per genre!",
      type: "bar",
      labels: ["Fiction", "Sci-Fi", "Mystery", "History", "Comics"],
      initialData: [140, 220, 180, 90, 310],
      unit: "books",
      icon: "📚",
      color: "#a78bfa",
      benchmark: 200,
      contextSource: "Library Circulation Desk · Grade 7 Reading Report"
    },
    {
      id: 5,
      title: "Runner 5K Pace Breakdown",
      subtitle: "Track & Field Team · Lap Times per Kilometer",
      desc: "Ethan tracked his 5K run pace in seconds per kilometer. Inspect point values along the line graph to observe his fastest and slowest kilometers!",
      type: "line",
      labels: ["Km 1", "Km 2", "Km 3", "Km 4", "Km 5"],
      initialData: [320, 305, 340, 315, 290],
      unit: "sec",
      icon: "⏱️",
      color: "#4ade80",
      contextSource: "Track & Field Stopwatch · 5K Championship Qualifier"
    },
    {
      id: 6,
      title: "Cafeteria Milk vs Juice Checkout",
      subtitle: "Lunchroom Drink Monitor · Daily Volume Log",
      desc: "The school cafeteria logged daily juice checkouts across 5 weekdays. Read values or drag bar heights to see total volume recalculate!",
      type: "bar",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      initialData: [240, 310, 280, 350, 410],
      unit: "cartons",
      icon: "🥛",
      color: "#f472b6",
      benchmark: 300,
      contextSource: "Cafeteria Log · Grade 7 Nutrition Record"
    },
    {
      id: 7,
      title: "Grade 7 Math Benchmark Score Trend",
      subtitle: "Term 1 to Term 4 Benchmark Tracker",
      desc: "Track average math test scores across 4 academic terms. Inspect the line points or adjust scores to see the overall average score shift!",
      type: "line",
      labels: ["Term 1", "Term 2", "Term 3", "Term 4"],
      initialData: [68, 74, 82, 91],
      unit: "%",
      icon: "📈",
      color: "#38bdf8",
      contextSource: "Math Department Benchmark Audit"
    }
  ],
  2: [
    {
      id: 1,
      title: "Sneaker Brand Sales War",
      subtitle: "Apex Shoes vs Nova Kicks Q4 Financial Report",
      desc: "Nova Kicks reported sales from 100k to 118k pairs (+18%). In their ad, they drew the y-axis baseline starting at 90k pairs. Drag the Baseline Slider below to control baseline live and watch the Distortion Index change!",
      trick: "truncated",
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [100, 105, 110, 118],
      unit: "k pairs",
      icon: "📈",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Truncated Axis",
      contextSource: "Ad Publication #882 · Graph Detective Distortion Audit #1"
    },
    {
      id: 2,
      title: "Monsoon Rainfall News Report",
      subtitle: "Channel 7 Weather News · Seasonal Rainfall Graphic",
      desc: "A weather broadcast showed rainfall with gridlines visually spaced equally on paper, but labeled 0, 10, 20, 70, 120 mm. Click gridline gaps to analyze step differences and spot the trick!",
      trick: "scale",
      labels: ["Jun", "Jul", "Aug", "Sep"],
      data: [10, 20, 70, 120],
      unit: "mm",
      icon: "🌧️",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Inconsistent Scale",
      contextSource: "TV Broadcast Graphic · Graph Detective Distortion Audit #2"
    },
    {
      id: 3,
      title: "Tech Startup Stock Pitch",
      subtitle: "Viral Social Media Ad · 8-Week Investment Record",
      desc: "A trading app published a viral ad showing stock prices rising continuously from $70 to $190 over Weeks 5–8. However, in Weeks 1–4, the stock crashed from $160 to $30. Toggle between promo snippet and full history!",
      trick: "cherrypick",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      fullData: [160, 120, 40, 30, 70, 120, 140, 190],
      unit: "$",
      icon: "📉",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Cherry-Picked Range",
      contextSource: "Social Media Sponsor Post · Graph Detective Distortion Audit #3"
    },
    {
      id: 4,
      title: "Cereal Sugar Percentage Ad",
      subtitle: "Breakfast Crunch vs Choco Loops Commercial",
      desc: "A cereal ad claims Choco Loops has 'massive extra sugar' compared to Breakfast Crunch. They compared 24g vs 22g of sugar, but drew the baseline starting at 20g! Which trick distorts this comparison?",
      trick: "truncated",
      labels: ["Choco Loops", "Breakfast Crunch"],
      data: [24, 22],
      unit: "g",
      wrongStart: 20,
      icon: "🥣",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Truncated Axis",
      contextSource: "Food Ad Audit #904 · Graph Detective Distortion Audit #4"
    },
    {
      id: 5,
      title: "Social Media Views Spike Ad",
      subtitle: "Influencer Promo Post · 24-Hour Analytics",
      desc: "An influencer ad displayed a line graph showing views exploding from 1k to 10k between 3 PM and 4 PM. They hid the remaining 23 hours of the day where views were near zero (100 views). Spot the trick!",
      trick: "cherrypick",
      labels: ["12AM", "6AM", "12PM", "3PM", "4PM", "6PM", "9PM", "11PM"],
      fullData: [100, 80, 200, 1000, 10000, 400, 150, 90],
      unit: "views",
      icon: "📲",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Cherry-Picked Range",
      contextSource: "Social Media Analytics Audit · Graph Detective Distortion Audit #5"
    },
    {
      id: 6,
      title: "Smartphone Battery Life Advert",
      subtitle: "VoltPhone vs NovaPhone Battery Duration",
      desc: "NovaPhone advertises 19.5 hrs vs VoltPhone 18 hrs (+1.5 hrs). In their ad, they drew the y-axis starting at 17 hrs, making a 1.5 hr difference look 4x longer! Identify the trick.",
      trick: "truncated",
      labels: ["VoltPhone", "NovaPhone"],
      data: [18, 19.5],
      unit: "hrs",
      wrongStart: 17,
      icon: "🔋",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Truncated Axis",
      contextSource: "Tech Ad Audit #102 · Graph Detective Distortion Audit #6"
    },
    {
      id: 7,
      title: "Movie Theater Ticket Sales Graphic",
      subtitle: "Blockbuster News Graphic · Opening Weekend Log",
      desc: "A movie studio graphic showed ticket sales with grid lines labeled 0, 100, 200, 1000, 2000 spaced equally on screen. Spot the trick!",
      trick: "scale",
      labels: ["Fri", "Sat", "Sun", "Mon"],
      data: [100, 200, 1000, 2000],
      unit: "tickets",
      icon: "🎟️",
      options: ["Truncated Axis", "Inconsistent Scale", "Cherry-Picked Range"],
      correctOption: "Inconsistent Scale",
      contextSource: "Studio Broadcast Audit · Graph Detective Distortion Audit #7"
    }
  ],
  3: [
    {
      id: 1,
      title: "Repair the Sneaker Sales Chart",
      subtitle: "Baseline Calibration Workshop · Truncated Axis Repair",
      desc: "Nova Kicks' ad baseline started at 90, stretching an 18-unit gain into a skyscraper jump. Use the Calibrator Wrench slider to drag the baseline down to the fair starting value (0).",
      trick: "truncated",
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [100, 105, 110, 118],
      wrongStart: 90,
      correctAnswer: 0,
      askLabel: "fair y-axis baseline",
      unit: "",
      icon: "🛠️",
      contextSource: "Graph Repair Lab · Rule 1: Always start bar chart y-axis at 0"
    },
    {
      id: 2,
      title: "Repair the Rainfall Scale",
      subtitle: "Grid Step Calibration Workshop · Equal Scale Repair",
      desc: "The news rainfall chart uses uneven steps (0, 10, 20, 70, 120 mm). Over a 0 to 120 mm range with 4 grid steps, use the Step Equalizer Knob to set the equal step size (120 ÷ 4).",
      trick: "scale",
      labels: ["Jun", "Jul", "Aug", "Sep"],
      data: [10, 20, 70, 120],
      correctAnswer: 30,
      askLabel: "equal step size",
      unit: "mm",
      icon: "🛠️",
      contextSource: "Graph Repair Lab · Rule 2: Equal physical gaps must have equal numerical steps"
    },
    {
      id: 3,
      title: "Repair the Tech Stock Timeline",
      subtitle: "Timeline Extension Workshop · Full Range Restoration",
      desc: "The trading ad only displayed Weeks 5 through 8, hiding the earlier crash. Use the Timeline Expander Lever to restore all 8 weeks of historical data.",
      trick: "cherrypick",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      fullData: [160, 120, 40, 30, 70, 120, 140, 190],
      correctAnswer: 8,
      askLabel: "total weeks shown",
      unit: "weeks",
      icon: "🛠️",
      contextSource: "Graph Repair Lab · Rule 3: Always present the complete time range"
    },
    {
      id: 4,
      title: "Repair the Cereal Sugar Comparison",
      subtitle: "Nutrition Baseline Workshop · Baseline Calibration",
      desc: "The cereal ad baseline started at 20g, making a 2g difference look 5 times larger. What baseline value should a fair nutritional bar chart start at?",
      trick: "truncated",
      labels: ["Choco Loops", "Breakfast Crunch"],
      data: [24, 22],
      wrongStart: 20,
      correctAnswer: 0,
      askLabel: "fair baseline value",
      unit: "g",
      icon: "🥣",
      contextSource: "Graph Repair Lab · Rule 1: Always start baseline at 0"
    },
    {
      id: 5,
      title: "Repair the Social Media Views Timeline",
      subtitle: "Full Analytics Extension · 24-Hour Scope Restoration",
      desc: "The influencer ad cropped the timeline to 1 hour (3 PM to 4 PM). How many total hours of data should a fair daily analytics graph display?",
      trick: "cherrypick",
      labels: ["12AM", "6AM", "12PM", "3PM", "4PM", "6PM", "9PM", "11PM"],
      fullData: [100, 80, 200, 1000, 10000, 400, 150, 90],
      correctAnswer: 24,
      askLabel: "total hours shown",
      unit: "hours",
      icon: "📲",
      contextSource: "Graph Repair Lab · Rule 3: Present complete time range"
    },
    {
      id: 6,
      title: "Repair Smartphone Battery Baseline",
      subtitle: "Battery Duration Calibration Workshop",
      desc: "NovaPhone's ad baseline started at 17 hrs, exaggerating a 1.5 hr difference. What starting baseline value makes the bar chart fair?",
      trick: "truncated",
      labels: ["VoltPhone", "NovaPhone"],
      data: [18, 19.5],
      wrongStart: 17,
      correctAnswer: 0,
      askLabel: "fair baseline value",
      unit: "hrs",
      icon: "🔋",
      contextSource: "Graph Repair Lab · Rule 1: Always start baseline at 0"
    },
    {
      id: 7,
      title: "Repair Movie Ticket Scale",
      subtitle: "Theater Grid Step Equalizer",
      desc: "The movie graphic uses uneven steps (0, 100, 200, 1000, 2000). Across a 0 to 2000 ticket range with 4 grid steps, what equal step size should be used (2000 ÷ 4)?",
      trick: "scale",
      labels: ["Fri", "Sat", "Sun", "Mon"],
      data: [100, 200, 1000, 2000],
      correctAnswer: 500,
      askLabel: "equal step size",
      unit: "tickets",
      icon: "🎟️",
      contextSource: "Graph Repair Lab · Rule 2: Equal physical gaps = equal step size"
    }
  ],
  4: [
    {
      id: 1,
      title: "School Fundraiser Baseline Distorter",
      subtitle: "Grade 7 Charity Drive · Create a Misleading Baseline",
      desc: "Class 7A raised $100 and Class 7B raised $110. Drag the Baseline Slider from $0 to $90 and see how a minor $10 difference morphs live into a massive skyscraper jump!",
      trick: "creator_baseline",
      labels: ["Class 7A", "Class 7B"],
      data: [100, 110],
      unit: "$",
      icon: "🎨",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #1"
    },
    {
      id: 2,
      title: "Energy Drink Focus Scale Stretcher",
      subtitle: "Volt Energy Drink Pitch · Create an Uneven Scale",
      desc: "Volt Drink claims to boost focus score from 40 to 45. Toggle gridline steps between Uniform (+10) and Stretched (+2) to see how physical height exaggerates small gains!",
      trick: "creator_scale",
      labels: ["Water", "Volt Drink"],
      data: [40, 45],
      unit: "score",
      icon: "⚡",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #2"
    },
    {
      id: 3,
      title: "Surfboard Sales Cherry-Picker",
      subtitle: "Ocean Breeze Inc · Crop the Timeline Scope",
      desc: "Surfboard sales peak in July ($90k) but crash in January ($10k). Drag the Time Crop Sliders to select only June–August and watch annual sales look 100% booming!",
      trick: "creator_cherrypick",
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      fullData: [10, 25, 45, 90, 30, 15],
      unit: "k $",
      icon: "🏄‍♂️",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #3"
    },
    {
      id: 4,
      title: "3D Soda Bottle Pictogram Multiplier",
      subtitle: "Fizz Soda Commercial · 2D & 3D Visual Area Deception",
      desc: "Soda consumption doubled from 100 to 200 bottles. If you double bottle height AND width, the 2D visual area multiplies by 4x! Drag scale factor to observe visual area distortion.",
      trick: "creator_pictogram",
      labels: ["Year 2020", "Year 2026"],
      data: [100, 200],
      unit: "bottles",
      icon: "🥤",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #4"
    },
    {
      id: 5,
      title: "Master Graph Architect Challenge",
      subtitle: "Middle School Recycling Drive · Honest vs Advertised Build",
      desc: "Paper recycling went from 40kg to 48kg (+20%). Toggle between Honest Mode (Baseline = 0) and Advertised Mode (Baseline = 35) to publish both graphs and earn the Graph Architect Master Badge!",
      trick: "creator_architect",
      labels: ["Week 1", "Week 2"],
      data: [40, 48],
      unit: "kg",
      icon: "🏆",
      contextSource: "Graph Creator Studio · Master Architect Graduation"
    },
    {
      id: 6,
      title: "Burger Calories Distortion Studio",
      subtitle: "Fast Food Burger Comparison · Misleading Baseline Creator",
      desc: "Burger A has 520 kcal and Burger B has 540 kcal. Drag the baseline slider to 500 kcal to see how a minor 20 kcal difference looks like Burger B has double the calories!",
      trick: "creator_baseline",
      labels: ["Burger A", "Burger B"],
      data: [520, 540],
      unit: "kcal",
      icon: "🍔",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #6"
    },
    {
      id: 7,
      title: "Game Viewer Spike Cherry-Picker",
      subtitle: "Esports Tournament Stream · Crop Peak Viewer Window",
      desc: "Viewer counts peaked at 15,000 during the grand final, but averaged 1,200 during the 12-hour stream. Toggle between Full 12-Hour view and Peak 15-Minute view!",
      trick: "creator_cherrypick",
      labels: ["9AM", "12PM", "3PM", "6PM", "9PM"],
      fullData: [1200, 1500, 15000, 2200, 900],
      unit: "viewers",
      icon: "🎮",
      contextSource: "Graph Creator Studio · Hands-On Deception Lab #7"
    }
  ]
};

/* --------------------------- Interactive SVG Charts -------------------------- */
function InteractiveBarChart({ data, labels, selectedIndex, onSelect, color = "#38bdf8", yMin = 0, benchmark = null }) {
  const w = 360, h = 165, padL = 44, padB = 28;
  const maxVal = Math.max(...data, benchmark || 0);
  const scaleTop = maxVal * 1.18 || 10;
  const barW = Math.max(16, (w - padL - 14) / data.length - 12);
  const toY = v => (h - padB) - ((v - yMin) / (scaleTop - yMin)) * (h - padB - 22);

  const gridSteps = 4;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => Math.round(yMin + i * ((scaleTop - yMin) / gridSteps)));

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h + 16}`} preserveAspectRatio="xMidYMid meet" className="w-full h-40 sm:h-48 md:h-52 max-h-[220px] drop-shadow-[0_0_20px_rgba(56,189,248,0.45)] shrink min-h-0">
      {gridValues.map((gv, i) => {
        const gy = toY(gv);
        return (
          <g key={i}>
            <line x1={padL} y1={gy} x2={w - 10} y2={gy} stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.75" />
            <text x={padL - 6} y={gy + 4} fill="#e2e8f0" fontSize="11" fontWeight="900" textAnchor="end">{gv}</text>
          </g>
        );
      })}

      {benchmark && (
        <g>
          <line x1={padL} y1={toY(benchmark)} x2={w - 10} y2={toY(benchmark)} stroke="#facc15" strokeWidth="2" strokeDasharray="6 3" />
          <text x={w - 12} y={toY(benchmark) - 5} fill="#facc15" fontSize="11" fontWeight="900" textAnchor="end">Goal: {benchmark}</text>
        </g>
      )}

      <line x1={padL} y1={h - padB} x2={w - 10} y2={h - padB} stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1={padL} y1="10" x2={padL} y2={h - padB} stroke="#e2e8f0" strokeWidth="2.5" />

      {data.map((v, i) => {
        const x = padL + 8 + i * ((w - padL - 14) / data.length);
        const y = toY(v);
        const barH = Math.max(3, h - padB - y);
        const isSel = i === selectedIndex;
        return (
          <g key={i} onClick={() => onSelect && onSelect(i)} className="cursor-pointer group">
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="5"
              fill={isSel ? "#facc15" : color}
              opacity={isSel ? 1 : 0.9}
              stroke={isSel ? "#ffffff" : "rgba(255,255,255,0.25)"}
              strokeWidth={isSel ? "3" : "1.5"}
              className="transition-all duration-150 group-hover:opacity-100"
            />
            <text x={x + barW / 2} y={y - 6} fill={isSel ? "#facc15" : "#ffffff"} fontSize="13" fontWeight="900" textAnchor="middle">
              {v}
            </text>
            <text x={x + barW / 2} y={h - padB + 18} fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function InteractiveLineChart({ data, labels, selectedIndex, onSelect, color = "#fb923c" }) {
  const w = 360, h = 165, padL = 44, padB = 28;
  const maxVal = Math.max(...data), minVal = Math.min(...data);
  const span = (maxVal - minVal) || 1;
  const stepX = (w - padL - 24) / (data.length - 1);
  const toY = v => (h - padB) - ((v - minVal) / span) * (h - padB - 38) - 10;
  const points = data.map((v, i) => [padL + 12 + i * stepX, toY(v)]);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h + 16}`} preserveAspectRatio="xMidYMid meet" className="w-full h-40 sm:h-48 md:h-52 max-h-[220px] drop-shadow-[0_0_20px_rgba(251,146,60,0.45)] shrink min-h-0">
      {[0, 0.33, 0.66, 1].map((ratio, i) => {
        const val = Math.round(minVal + ratio * span);
        const gy = toY(val);
        return (
          <g key={i}>
            <line x1={padL} y1={gy} x2={w - 10} y2={gy} stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.75" />
            <text x={padL - 6} y={gy + 4} fill="#e2e8f0" fontSize="11" fontWeight="900" textAnchor="end">{val}</text>
          </g>
        );
      })}

      <line x1={padL} y1={h - padB} x2={w - 10} y2={h - padB} stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1={padL} y1="10" x2={padL} y2={h - padB} stroke="#e2e8f0" strokeWidth="2.5" />
      <polyline points={points.map(p => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map(([x, y], i) => {
        const isSel = i === selectedIndex;
        return (
          <g key={i} onClick={() => onSelect && onSelect(i)} className="cursor-pointer group">
            <circle cx={x} cy={y} r={isSel ? 9 : 7} fill={isSel ? "#facc15" : color} stroke="#ffffff" strokeWidth={isSel ? "3" : "2"} className="transition-all duration-150" />
            <text x={x} y={y - 9} fill={isSel ? "#facc15" : "#ffffff"} fontSize="13" fontWeight="900" textAnchor="middle">
              {data[i]}
            </text>
            <text x={x} y={h - padB + 18} fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function InteractivePieChart({ data, selectedIndex, onSelect }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let angleStart = -90;
  const cx = 120, cy = 90, r = 70;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const a0 = (angleStart * Math.PI) / 180;
    const a1 = ((angleStart + angle) * Math.PI) / 180;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
    const midAngle = ((angleStart + angle / 2) * Math.PI) / 180;
    const lx = cx + (r + 24) * Math.cos(midAngle);
    const ly = cy + (r + 24) * Math.sin(midAngle);
    angleStart += angle;
    return { path, ...d, lx, ly };
  });

  return (
    <svg width="100%" height="100%" viewBox="0 0 240 185" preserveAspectRatio="xMidYMid meet" className="w-full h-40 sm:h-48 md:h-52 max-h-[220px] drop-shadow-[0_0_20px_rgba(56,189,248,0.45)] shrink min-h-0">
      {slices.map((s, i) => (
        <g key={i} onClick={() => onSelect && onSelect(i)} className="cursor-pointer group">
          <path
            d={s.path}
            fill={s.color}
            opacity={selectedIndex === i ? 1 : 0.9}
            stroke={selectedIndex === i ? "#ffffff" : "#0c0424"}
            strokeWidth={selectedIndex === i ? 3.5 : 2}
            className="transition-all duration-200"
          />
        </g>
      ))}
      {slices.map((s, i) => (
        <text key={i} x={s.lx} y={s.ly} fill="#ffffff" fontSize="11.5" fontWeight="900" textAnchor="middle">
          {s.label} ({s.value}%)
        </text>
      ))}
    </svg>
  );
}

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  // Dynamic Station 1 Sandbox Data States
  const [sandboxData1, setSandboxData1] = useState(INITIAL_STATION_DATA[1][0].initialData);
  const [sandboxData2, setSandboxData2] = useState(INITIAL_STATION_DATA[1][1].initialData);
  const [sandboxData3, setSandboxData3] = useState(INITIAL_STATION_DATA[1][2].initialData);
  const [sandboxData4, setSandboxData4] = useState(INITIAL_STATION_DATA[1][3].initialData);
  const [sandboxData5, setSandboxData5] = useState(INITIAL_STATION_DATA[1][4].initialData);
  const [sandboxData6, setSandboxData6] = useState(INITIAL_STATION_DATA[1][5].initialData);
  const [sandboxData7, setSandboxData7] = useState(INITIAL_STATION_DATA[1][6].initialData);

  const [selIndex, setSelIndex] = useState(0);
  const [sandboxMode, setSandboxMode] = useState(false);

  // Station 2 Interactive Distortion State
  const [interactiveBaseline, setInteractiveBaseline] = useState(90);
  const [showHonest, setShowHonest] = useState(false);
  const [pickedTrick, setPickedTrick] = useState(null);
  const [activeGridGap, setActiveGridGap] = useState(null);
  const [cropRange, setCropRange] = useState([4, 8]);

  // Station 3 Graph Doctor Workshop State
  const [repairBaseline, setRepairBaseline] = useState(90);
  const [repairStepSize, setRepairStepSize] = useState(15);
  const [repairWeeksCount, setRepairWeeksCount] = useState(4);
  const [fixAnswer, setFixAnswer] = useState('');
  const [fixFeedback, setFixFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Station 4 Misleading Graph Creator State
  const [creatorBaseline, setCreatorBaseline] = useState(0);
  const [creatorScaleType, setCreatorScaleType] = useState('uniform');
  const [creatorCropSummer, setCreatorCropSummer] = useState(false);
  const [pictogramScale, setPictogramScale] = useState(1);
  const [architectMode, setArchitectMode] = useState('honest');
  const [architectBadge, setArchitectBadge] = useState(false);

  const currentActivity = INITIAL_STATION_DATA[station][actIdx];
  const totalActivitiesInStation = INITIAL_STATION_DATA[station].length;

  useEffect(() => {
    stopNarration();
    setSelIndex(0);
    setShowHonest(false);
    setPickedTrick(null);
    setActiveGridGap(null);
    setFixAnswer('');
    setFixFeedback(null);
    setShowHint(false);
    setInteractiveBaseline(currentActivity.wrongStart || 90);
    setCropRange([4, 8]);
    setRepairBaseline(currentActivity.wrongStart || 90);
    setRepairStepSize(15);
    setRepairWeeksCount(4);
    setCreatorBaseline(0);
    setCreatorScaleType('uniform');
    setCreatorCropSummer(false);
    setPictogramScale(1);
    setArchitectMode('honest');

    const key = `sim_${station}`;
    if (AUDIO_MAP[key]) narrate(AUDIO_MAP[key], !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const handlePickTrick = (opt) => {
    stopNarration();
    setPickedTrick(opt);
    if (opt === currentActivity.correctOption) {
      playSuccessSound(muted);
      cheer("Nice catch, detective!");
    } else {
      playErrorSound(muted);
    }
  };

  const handleFixCheck = () => {
    stopNarration();
    const num = parseFloat(fixAnswer);
    if (num === currentActivity.correctAnswer) {
      playSuccessSound(muted);
      if (currentActivity.trick === 'truncated') setRepairBaseline(0);
      if (currentActivity.trick === 'scale') setRepairStepSize(currentActivity.correctAnswer);
      if (currentActivity.trick === 'cherrypick') setRepairWeeksCount(currentActivity.correctAnswer);
      setFixFeedback({
        success: true,
        text: `🎉 Exactly right! ${currentActivity.askLabel} = ${currentActivity.correctAnswer} ${currentActivity.unit}. Rule Mastered!`
      });
      cheer("Awesome repair job!");
    } else {
      playErrorSound(muted);
      setFixFeedback({
        success: false,
        text: `Not quite! Hint: ${currentActivity.askLabel} = ${currentActivity.correctAnswer} ${currentActivity.unit}. ${currentActivity.hint || ''}`
      });
    }
  };

  const nextActivity = () => {
    stopNarration();
    playClickSound(muted);
    if (actIdx < totalActivitiesInStation - 1) {
      setActIdx(i => i + 1);
    } else if (station < 4) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    stopNarration();
    playClickSound(muted);
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(INITIAL_STATION_DATA[station - 1].length - 1);
    }
  };

  // Helper stats for Station 1
  const getS1Data = () => {
    if (actIdx === 0) return sandboxData1;
    if (actIdx === 1) return sandboxData2;
    if (actIdx === 2) return sandboxData3;
    if (actIdx === 3) return sandboxData4;
    if (actIdx === 4) return sandboxData5;
    if (actIdx === 5) return sandboxData6;
    return sandboxData7;
  };

  const currentS1Data = getS1Data();

  const getS1Stats = () => {
    if (actIdx === 2) return {};
    const sum = currentS1Data.reduce((a, b) => a + b, 0);
    const mean = Math.round(sum / currentS1Data.length);
    const max = Math.max(...currentS1Data);
    const min = Math.min(...currentS1Data);
    return { mean, range: max - min, sum };
  };

  const s1Stats = getS1Stats();

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-6xl max-h-[96vh] h-full bg-[#160b36]/95 border-2 border-purple-400/40 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Decorative Pill */}
        <div className="w-20 h-1.5 bg-cyan-400 rounded-full mb-1.5 shadow-[0_0_14px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🧪</span>
            <div>
              <h2 className="font-display font-900 text-lg sm:text-2xl text-white leading-tight">
                Graph Detective Simulation Lab
              </h2>
              <p className="text-[11px] sm:text-xs font-extrabold text-cyan-300">
                28 Real-World Case Studies · Live Interactive Controls
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#10072b]/90 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-black text-amber-300">
            <span>🕵️ Detective Nova Active</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-1.5 sm:gap-2 shrink-0">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <button
                onClick={() => { playClickSound(muted); setStation(1); setActIdx(0); }}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 1
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.01]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    station === 1 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    🔎
                  </div>
                  <div>
                    <p className="font-display font-900 text-xs sm:text-sm leading-tight">Station 1: Reader & Sandbox</p>
                    <p className="text-[10px] sm:text-xs font-extrabold text-slate-300 mt-0.5">7 Interactive Data Labs</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-black text-emerald-300">7/7</span>
              </button>

              <button
                onClick={() => { playClickSound(muted); setStation(2); setActIdx(0); }}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 2
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.01]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    station === 2 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    🕵️
                  </div>
                  <div>
                    <p className="font-display font-900 text-xs sm:text-sm leading-tight">Station 2: Spot the Trick</p>
                    <p className="text-[10px] sm:text-xs font-extrabold text-slate-300 mt-0.5">7 Distortion Audits</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-black text-emerald-300">7/7</span>
              </button>

              <button
                onClick={() => { playClickSound(muted); setStation(3); setActIdx(0); }}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 3
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.01]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    station === 3 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    🧩
                  </div>
                  <div>
                    <p className="font-display font-900 text-xs sm:text-sm leading-tight">Station 3: Graph Doctor</p>
                    <p className="text-[10px] sm:text-xs font-extrabold text-slate-300 mt-0.5">7 Repair Workshops</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-black text-emerald-300">7/7</span>
              </button>

              <button
                onClick={() => { playClickSound(muted); setStation(4); setActIdx(0); }}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 4
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.01]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    station === 4 ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white'
                  }`}>
                    🎨
                  </div>
                  <div>
                    <p className="font-display font-900 text-xs sm:text-sm leading-tight">Station 4: Creator Studio</p>
                    <p className="text-[10px] sm:text-xs font-extrabold text-slate-300 mt-0.5">7 Distortion Labs</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-black text-amber-300">7/7</span>
              </button>
            </div>

            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-xs sm:text-sm py-2 sm:py-2.5 px-4 shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-[1.02] transition mt-1 w-full flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Main Interactive Work Area */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
              {/* Activity Header */}
              <div className="border-b border-white/15 pb-1.5 mb-1.5 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-900 text-base sm:text-lg text-cyan-300 flex items-center gap-2 truncate">
                    <span className="text-xl sm:text-2xl shrink-0">{currentActivity.icon}</span>
                    <span className="truncate">{currentActivity.title}</span>
                  </h3>
                  <span className="font-display font-900 text-[10px] sm:text-xs text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 shrink-0">
                    Activity {actIdx + 1} of {totalActivitiesInStation}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-purple-300 font-extrabold mt-0.5 truncate">
                  📌 {currentActivity.subtitle}
                </p>
              </div>

              <p className="text-slate-100 text-[11px] sm:text-xs leading-snug font-bold mb-1.5 shrink-0 line-clamp-2">
                {currentActivity.desc}
              </p>

              {/* STATION 1: GRAPH READER & LIVE DATA SANDBOX */}
              {station === 1 && (
                <div className="flex flex-col items-center justify-between gap-1.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-xl p-2.5 sm:p-3 shadow-xl flex-1 min-h-0">
                  <div className="w-full flex items-center justify-between border-b border-white/10 pb-1 shrink-0">
                    <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-wider">
                      Interactive Visual Chart & Live Readout
                    </span>
                    <button
                      onClick={() => { playClickSound(muted); setSandboxMode(m => !m); }}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-display font-900 transition ${
                        sandboxMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/10 text-cyan-300 border border-cyan-400/40'
                      }`}
                    >
                      {sandboxMode ? "✏️ Sandbox Mode" : "🔍 Read Mode"}
                    </button>
                  </div>

                  {(actIdx === 0 || actIdx === 3 || actIdx === 5) && (
                    <>
                      <InteractiveBarChart
                        data={currentS1Data}
                        labels={currentActivity.labels}
                        selectedIndex={selIndex}
                        onSelect={setSelIndex}
                        color={currentActivity.color}
                        benchmark={currentActivity.benchmark}
                      />
                      <div className="w-full flex flex-col gap-1 bg-[#14082c] p-2 rounded-lg border border-white/10 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-300">
                          <span>Modify {currentActivity.labels[selIndex]}:</span>
                          <span className="text-cyan-300 font-mono font-black">{currentS1Data[selIndex]} {currentActivity.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={actIdx === 0 ? "1000" : actIdx === 3 ? "50" : "100"}
                          max={actIdx === 0 ? "9000" : actIdx === 3 ? "500" : "600"}
                          step={actIdx === 0 ? "100" : "10"}
                          value={currentS1Data[selIndex]}
                          onChange={e => {
                            playClickSound(muted);
                            const val = Number(e.target.value);
                            const updateFn = actIdx === 0 ? setSandboxData1 : actIdx === 3 ? setSandboxData4 : setSandboxData6;
                            updateFn(prev => {
                              const next = [...prev];
                              next[selIndex] = val;
                              return next;
                            });
                          }}
                          className="w-full accent-cyan-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </>
                  )}

                  {(actIdx === 1 || actIdx === 4 || actIdx === 6) && (
                    <>
                      <InteractiveLineChart
                        data={currentS1Data}
                        labels={currentActivity.labels}
                        selectedIndex={selIndex}
                        onSelect={setSelIndex}
                        color={currentActivity.color}
                      />
                      <div className="w-full flex flex-col gap-1 bg-[#14082c] p-2 rounded-lg border border-white/10 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-300">
                          <span>Modify {currentActivity.labels[selIndex]}:</span>
                          <span className="text-orange-300 font-mono font-black">{currentS1Data[selIndex]} {currentActivity.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={actIdx === 1 ? "10" : actIdx === 4 ? "250" : "50"}
                          max={actIdx === 1 ? "35" : actIdx === 4 ? "400" : "100"}
                          step="1"
                          value={currentS1Data[selIndex]}
                          onChange={e => {
                            playClickSound(muted);
                            const val = Number(e.target.value);
                            const updateFn = actIdx === 1 ? setSandboxData2 : actIdx === 4 ? setSandboxData5 : setSandboxData7;
                            updateFn(prev => {
                              const next = [...prev];
                              next[selIndex] = val;
                              return next;
                            });
                          }}
                          className="w-full accent-orange-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </>
                  )}

                  {actIdx === 2 && (
                    <>
                      <InteractivePieChart
                        data={sandboxData3}
                        selectedIndex={selIndex}
                        onSelect={setSelIndex}
                      />
                      <div className="w-full flex items-center justify-between bg-[#14082c] p-1.5 sm:p-2 rounded-lg border border-white/10 shrink-0">
                        <span className="text-[11px] font-bold text-slate-300">Select Snack:</span>
                        <div className="flex items-center gap-1.5">
                          {sandboxData3.map((s, idx) => (
                            <button
                              key={s.label}
                              onClick={() => { playClickSound(muted); setSelIndex(idx); }}
                              className={`px-2 py-0.5 rounded text-[11px] font-black transition ${
                                selIndex === idx ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Dynamic Math Readout Box */}
                  <div className="w-full bg-[#14082c]/95 border border-amber-400/40 p-1.5 sm:p-2 rounded-lg shadow-inner text-center shrink-0">
                    {actIdx === 2 ? (
                      <p className="text-amber-300 font-display font-900 text-xs">
                        {sandboxData3[selIndex].label}: <span className="text-white font-black">{sandboxData3[selIndex].value}%</span> of 200 students = <span className="text-emerald-300 font-black">{Math.round((sandboxData3[selIndex].value / 100) * 200)} students</span>
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5 text-xs font-display font-900">
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[9px]">SELECTED</span>
                          <span className="text-white text-xs">{currentS1Data[selIndex]} {currentActivity.unit}</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[9px]">MEAN AVERAGE</span>
                          <span className="text-cyan-300 text-xs">{s1Stats.mean} {currentActivity.unit}</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[9px]">RANGE (MAX - MIN)</span>
                          <span className="text-amber-300 text-xs">{s1Stats.range} {currentActivity.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STATION 2: SPOT THE TRICK & DISTORTION METER */}
              {station === 2 && (
                <div className="flex flex-col items-center justify-between gap-1.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-xl p-2.5 sm:p-3 shadow-xl flex-1 min-h-0">
                  {currentActivity.trick === 'truncated' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={interactiveBaseline === 0 ? "#4ade80" : "#f43f5e"}
                        yMin={interactiveBaseline}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-rose-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Baseline Slider:</span>
                          <span className={interactiveBaseline === 0 ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>
                            Starts at {interactiveBaseline} (Honest = 0)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={currentActivity.wrongStart || 90}
                          step="5"
                          value={interactiveBaseline}
                          onChange={e => {
                            playClickSound(muted);
                            setInteractiveBaseline(Number(e.target.value));
                          }}
                          className="w-full accent-rose-500 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {currentActivity.trick === 'scale' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={showHonest ? "#4ade80" : "#facc15"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 shrink-0">
                        <span className="text-[11px] font-black text-amber-300 text-center">
                          Click Gridline Gaps to Audit Step Differences:
                        </span>
                        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                          {(actIdx === 1 ? [
                            { label: "0 → 10", step: "+10" },
                            { label: "10 → 20", step: "+10" },
                            { label: "20 → 70", step: "+50!" },
                            { label: "70 → 120", step: "+50!" }
                          ] : [
                            { label: "0 → 100", step: "+100" },
                            { label: "100 → 200", step: "+100" },
                            { label: "200 → 1k", step: "+800!" },
                            { label: "1k → 2k", step: "+1000!" }
                          ]).map((g, idx) => (
                            <button
                              key={idx}
                              onClick={() => { playClickSound(muted); setActiveGridGap(idx); }}
                              className={`p-1 rounded border font-mono font-black transition ${
                                activeGridGap === idx ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-white/5 border-white/10 text-slate-200'
                              }`}
                            >
                              <span className="block text-[9px] opacity-80">{g.label}</span>
                              <span className="text-xs">{g.step}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentActivity.trick === 'cherrypick' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveLineChart
                        data={showHonest ? currentActivity.fullData : currentActivity.fullData.slice(Math.floor(currentActivity.fullData.length / 2))}
                        labels={showHonest ? currentActivity.labels : currentActivity.labels.slice(Math.floor(currentActivity.labels.length / 2))}
                        color={showHonest ? "#4ade80" : "#fb923c"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-orange-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] font-black text-slate-300">
                          <span>Timeline View:</span>
                          <span className="text-orange-300 font-mono">
                            {showHonest ? "Full History View" : "Promo Snippet View"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { playClickSound(muted); setShowHonest(false); }}
                            className={`px-2.5 py-1 rounded text-xs font-black flex-1 transition ${!showHonest ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Promo Snippet
                          </button>
                          <button
                            onClick={() => { playClickSound(muted); setShowHonest(true); }}
                            className={`px-2.5 py-1 rounded text-xs font-black flex-1 transition ${showHonest ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Full History
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1.5 w-full shrink-0">
                    {currentActivity.options.map(opt => {
                      let cls = "bg-[#0e0626] border-2 border-purple-400/30 text-white hover:border-cyan-400";
                      if (pickedTrick) {
                        if (opt === currentActivity.correctOption) cls = "bg-emerald-600 border-2 border-emerald-300 text-white";
                        else if (opt === pickedTrick) cls = "bg-rose-600 border-2 border-rose-300 text-white";
                        else cls = "bg-[#0e0626] border-2 border-white/10 text-slate-400 opacity-40";
                      }
                      return (
                        <button
                          key={opt}
                          onClick={() => handlePickTrick(opt)}
                          className={`px-2 py-1.5 rounded-lg font-display font-900 text-[11px] sm:text-xs transition cursor-pointer truncate ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {pickedTrick && (
                    <div className={`p-1.5 rounded-lg text-xs font-900 w-full text-center shadow-md shrink-0 ${
                      pickedTrick === currentActivity.correctOption ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border border-rose-400/60'
                    }`}>
                      {pickedTrick === currentActivity.correctOption
                        ? `✅ Correct! This case uses a ${currentActivity.correctOption}.`
                        : `Not quite — it's actually a ${currentActivity.correctOption}.`}
                    </div>
                  )}
                </div>
              )}

              {/* STATION 3: GRAPH DOCTOR WORKSHOP */}
              {station === 3 && (
                <div className="flex flex-col items-center justify-between gap-1.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-xl p-2.5 sm:p-3 shadow-xl flex-1 min-h-0">
                  {currentActivity.trick === 'truncated' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={repairBaseline === 0 ? "#4ade80" : "#f43f5e"}
                        yMin={repairBaseline}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-cyan-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Baseline Calibrator:</span>
                          <span className={repairBaseline === 0 ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>
                            {repairBaseline === 0 ? "CALIBRATED (0)" : `UNFAIR (${repairBaseline})`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={currentActivity.wrongStart || 90}
                          step="10"
                          value={repairBaseline}
                          onChange={e => {
                            playClickSound(muted);
                            const val = Number(e.target.value);
                            setRepairBaseline(val);
                            if (val === 0) playSuccessSound(muted);
                          }}
                          className="w-full accent-cyan-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {currentActivity.trick === 'scale' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={repairStepSize === currentActivity.correctAnswer ? "#4ade80" : "#facc15"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Step Equalizer:</span>
                          <span className={repairStepSize === currentActivity.correctAnswer ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"}>
                            {repairStepSize === currentActivity.correctAnswer ? `EQUAL (${currentActivity.correctAnswer} ${currentActivity.unit})` : `Uneven (${repairStepSize} ${currentActivity.unit})`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max={currentActivity.correctAnswer * 1.5}
                          step="10"
                          value={repairStepSize}
                          onChange={e => {
                            playClickSound(muted);
                            const val = Number(e.target.value);
                            setRepairStepSize(val);
                            if (val === currentActivity.correctAnswer) playSuccessSound(muted);
                          }}
                          className="w-full accent-amber-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {currentActivity.trick === 'cherrypick' && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveLineChart
                        data={repairWeeksCount === currentActivity.correctAnswer ? currentActivity.fullData : currentActivity.fullData.slice(4)}
                        labels={repairWeeksCount === currentActivity.correctAnswer ? currentActivity.labels : currentActivity.labels.slice(4)}
                        color={repairWeeksCount === currentActivity.correctAnswer ? "#4ade80" : "#fb923c"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-emerald-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Timeline Scope:</span>
                          <span className={repairWeeksCount === currentActivity.correctAnswer ? "text-emerald-400 font-mono" : "text-orange-400 font-mono"}>
                            {repairWeeksCount === currentActivity.correctAnswer ? `FULL (${currentActivity.correctAnswer} units)` : `Cropped Scope`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max={currentActivity.correctAnswer}
                          step={currentActivity.correctAnswer === 24 ? 20 : 4}
                          value={repairWeeksCount}
                          onChange={e => {
                            playClickSound(muted);
                            const val = Number(e.target.value);
                            setRepairWeeksCount(val);
                            if (val === currentActivity.correctAnswer) playSuccessSound(muted);
                          }}
                          className="w-full accent-emerald-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 w-full justify-center shrink-0">
                    <input
                      type="number"
                      placeholder={`Enter ${currentActivity.askLabel}`}
                      value={fixAnswer}
                      onChange={e => setFixAnswer(e.target.value)}
                      className="bg-[#14082c] border-2 border-cyan-400/70 rounded-lg px-3 py-1.5 text-white font-display font-900 text-xs text-center outline-none focus:border-amber-400 w-40 sm:w-48 shadow-inner"
                    />
                    <button
                      onClick={handleFixCheck}
                      className="btn-gold text-xs font-900 px-4 py-1.5 shadow-md hover:scale-105 transition cursor-pointer"
                    >
                      Repair ✨
                    </button>
                    <button
                      onClick={() => { playClickSound(muted); setShowHint(h => !h); }}
                      className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      💡 Hint
                    </button>
                  </div>

                  {showHint && (
                    <div className="p-1.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-lg text-[11px] font-bold w-full text-center fade-in-up shrink-0">
                      💡 {currentActivity.hint || "Analyze the baseline or step intervals!"}
                    </div>
                  )}

                  {fixFeedback && (
                    <div className={`p-1.5 rounded-lg text-xs font-900 w-full text-center shadow-md shrink-0 ${
                      fixFeedback.success ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border border-rose-400/60'
                    }`}>
                      {fixFeedback.text}
                    </div>
                  )}
                </div>
              )}

              {/* STATION 4: MISLEADING GRAPH CREATOR STUDIO */}
              {station === 4 && (
                <div className="flex flex-col items-center justify-between gap-1.5 bg-[#1e1342]/95 border-2 border-amber-400/40 rounded-xl p-2.5 sm:p-3 shadow-xl flex-1 min-h-0">
                  {/* Creator Activity 1, 6: Baseline Distorter */}
                  {(actIdx === 0 || actIdx === 5) && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={creatorBaseline === 0 ? "#4ade80" : "#f43f5e"}
                        yMin={creatorBaseline}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Creator Baseline:</span>
                          <span className={creatorBaseline === 0 ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"}>
                            Baseline = {creatorBaseline} ({creatorBaseline === 0 ? "Fair ratio" : `Distorted`})
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={actIdx === 0 ? 90 : 500}
                          step={actIdx === 0 ? 10 : 20}
                          value={creatorBaseline}
                          onChange={e => {
                            playClickSound(muted);
                            setCreatorBaseline(Number(e.target.value));
                          }}
                          className="w-full accent-amber-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Creator Activity 2: Scale Stretcher */}
                  {actIdx === 1 && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={creatorScaleType === 'uniform' ? "#4ade80" : "#fb923c"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 text-center shrink-0">
                        <span className="text-[11px] font-black text-amber-300">Scale Mode:</span>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => { playClickSound(muted); setCreatorScaleType('uniform'); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${creatorScaleType === 'uniform' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Uniform Scale (+10)
                          </button>
                          <button
                            onClick={() => { playClickSound(muted); setCreatorScaleType('stretched'); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${creatorScaleType === 'stretched' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'}`}
                          >
                            Stretched Scale (+2)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Creator Activity 3, 7: Time Scope Crop */}
                  {(actIdx === 2 || actIdx === 6) && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveLineChart
                        data={creatorCropSummer ? (actIdx === 2 ? [45, 90, 30] : [15000]) : currentActivity.fullData}
                        labels={creatorCropSummer ? (actIdx === 2 ? ["May", "Jul", "Sep"] : ["3PM Peak"]) : currentActivity.labels}
                        color={creatorCropSummer ? "#f43f5e" : "#4ade80"}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 text-center shrink-0">
                        <span className="text-[11px] font-black text-amber-300">Timeline Scope:</span>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => { playClickSound(muted); setCreatorCropSummer(false); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${!creatorCropSummer ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Full Timeline (Honest)
                          </button>
                          <button
                            onClick={() => { playClickSound(muted); setCreatorCropSummer(true); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${creatorCropSummer ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Cropped Peak (Deceptive)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Creator Activity 4: 3D Soda Bottle Pictogram Multiplier */}
                  {actIdx === 3 && (
                    <div className="w-full flex flex-col items-center justify-between gap-2 flex-1 min-h-0">
                      <div className="flex items-end justify-center gap-6 h-24 shrink-0">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-3xl sm:text-4xl">🥤</span>
                          <span className="text-[10px] font-black text-slate-300">2020: 100 Bottles</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 transition-all duration-300" style={{ transform: `scale(${pictogramScale})` }}>
                          <span className="text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]">🥤</span>
                          <span className="text-[10px] font-black text-amber-300">2026: 200 Bottles</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                          <span className="text-slate-300">Scale Factor:</span>
                          <span className="text-amber-300 font-mono">{pictogramScale}x Height = {(pictogramScale * pictogramScale).toFixed(1)}x Visual Area!</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          step="0.1"
                          value={pictogramScale}
                          onChange={e => {
                            playClickSound(muted);
                            setPictogramScale(Number(e.target.value));
                          }}
                          className="w-full accent-amber-400 cursor-pointer h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Creator Activity 5: Master Graph Architect Challenge */}
                  {actIdx === 4 && (
                    <div className="w-full flex flex-col items-center gap-1.5 flex-1 min-h-0 justify-between">
                      <InteractiveBarChart
                        data={currentActivity.data}
                        labels={currentActivity.labels}
                        color={architectMode === 'honest' ? "#4ade80" : "#f43f5e"}
                        yMin={architectMode === 'honest' ? 0 : 35}
                      />
                      <div className="w-full bg-[#14082c] p-2 rounded-lg border border-amber-400/40 flex flex-col gap-1.5 text-center shrink-0">
                        <span className="text-[11px] font-black text-amber-300">Architect Mode:</span>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => { playClickSound(muted); setArchitectMode('honest'); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${architectMode === 'honest' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Honest (Baseline 0)
                          </button>
                          <button
                            onClick={() => { playClickSound(muted); setArchitectMode('advertised'); }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition ${architectMode === 'advertised' ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-300'}`}
                          >
                            Advertised (Baseline 35)
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            playSuccessSound(muted);
                            cheer("Master Graph Architect Badge Unlocked!");
                            setArchitectBadge(true);
                          }}
                          className="btn-gold text-xs font-900 py-1.5 px-5 shadow-md hover:scale-105 transition self-center cursor-pointer"
                        >
                          Publish Architect Report 🏆
                        </button>

                        {architectBadge && (
                          <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-900 rounded-lg text-xs shadow-md">
                            🏆 Badge Unlocked: 28/28 Case Studies Mastered!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation Row */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-1.5 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-xs px-4 py-1.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-xs font-900 px-5 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 4 && actIdx === totalActivitiesInStation - 1 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

