import React from 'react';

/* =========================================================================
   CHART DIAGRAM — renders the SVG visual inside each practice question,
   mirroring the role CircleDiagram played in the circumference module.
   Supports: bar, line, pie, and side-by-side "compare" (two mini bar charts)
   ========================================================================= */
export function ChartDiagram({ diagramData, size = 210 }) {
  const { kind } = diagramData;
  const w = size, h = size * 0.78;

  if (kind === 'bar') {
    const { labels, data, unit = '', highlightIndex, yMin = 0 } = diagramData;
    const pad = 30;
    const maxVal = Math.max(...data);
    const scaleTop = maxVal * 1.15;
    const barW = (w - pad * 2) / data.length - 10;
    const toY = v => h - pad - ((v - yMin) / (scaleTop - yMin)) * (h - pad * 1.5);

    return (
      <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="max-w-full h-auto drop-shadow-md">
        <line x1={pad} y1={h - pad} x2={w - 8} y2={h - pad} stroke="#94a3b8" strokeWidth="2" />
        <line x1={pad} y1="8" x2={pad} y2={h - pad} stroke="#94a3b8" strokeWidth="2" />
        {data.map((v, i) => {
          const x = pad + 8 + i * ((w - pad * 2) / data.length);
          const y = toY(v);
          const isHi = i === highlightIndex;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h - pad - y} rx="4" fill={isHi ? "#facc15" : "#38bdf8"} opacity={isHi ? 1 : 0.8} />
              <text x={x + barW / 2} y={h - pad + 15} fill="#cbd5e1" fontSize="11" textAnchor="middle">{labels[i]}</text>
            </g>
          );
        })}
        {unit && <text x={w - 6} y="18" fill="#94a3b8" fontSize="10" textAnchor="end">({unit})</text>}
      </svg>
    );
  }

  if (kind === 'line') {
    const { labels, data, unit = '', highlightIndex } = diagramData;
    const pad = 30;
    const maxVal = Math.max(...data), minVal = Math.min(...data);
    const span = (maxVal - minVal) || 1;
    const stepX = (w - pad * 2) / (data.length - 1);
    const toY = v => (h - pad) - ((v - minVal) / span) * (h - pad * 1.7) - 8;
    const points = data.map((v, i) => [pad + i * stepX, toY(v)]);

    return (
      <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="max-w-full h-auto drop-shadow-md">
        <line x1={pad} y1={h - pad} x2={w - 8} y2={h - pad} stroke="#94a3b8" strokeWidth="2" />
        <line x1={pad} y1="8" x2={pad} y2={h - pad} stroke="#94a3b8" strokeWidth="2" />
        <polyline points={points.map(p => p.join(',')).join(' ')} fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" />
        {points.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === highlightIndex ? 7 : 5} fill={i === highlightIndex ? "#facc15" : "#fb923c"} stroke="#0c0424" strokeWidth="1.5" />
            <text x={x} y={h - pad + 15} fill="#cbd5e1" fontSize="11" textAnchor="middle">{labels[i]}</text>
          </g>
        ))}
        {unit && <text x={w - 6} y="18" fill="#94a3b8" fontSize="10" textAnchor="end">({unit})</text>}
      </svg>
    );
  }

  if (kind === 'pie') {
    const { data } = diagramData; // [{label, value, color}]
    const total = data.reduce((a, b) => a + b.value, 0);
    let angleStart = -90;
    const cx = w / 2, cy = h / 2 + 8, r = Math.min(w, h) * 0.4;

    const slices = data.map(d => {
      const angle = (d.value / total) * 360;
      const a0 = (angleStart * Math.PI) / 180, a1 = ((angleStart + angle) * Math.PI) / 180;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const largeArc = angle > 180 ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
      const midAngle = ((angleStart + angle / 2) * Math.PI) / 180;
      const lx = cx + (r + 20) * Math.cos(midAngle), ly = cy + (r + 20) * Math.sin(midAngle);
      angleStart += angle;
      return { path, lx, ly, ...d };
    });

    return (
      <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="max-w-full h-auto drop-shadow-md">
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#0c0424" strokeWidth="1.5" />)}
        {slices.map((s, i) => (
          <text key={i} x={s.lx} y={s.ly} fill="#e2e8f0" fontSize="10" fontWeight="900" textAnchor="middle">{s.label}</text>
        ))}
      </svg>
    );
  }

  if (kind === 'compare') {
    const { labels, dataA, dataB, yMinA = 0, yMinB = 0, labelA = 'Graph A', labelB = 'Graph B' } = diagramData;
    const miniW = w / 2 - 14, miniH = h;
    const pad = 22;

    const renderMini = (data, yMin, color, offsetX, title) => {
      const maxVal = Math.max(...data);
      const scaleTop = maxVal * 1.15;
      const barW = (miniW - pad * 1.5) / data.length - 6;
      const toY = v => miniH - pad - ((v - yMin) / (scaleTop - yMin)) * (miniH - pad * 1.5);
      return (
        <g transform={`translate(${offsetX},0)`}>
          <line x1={pad} y1={miniH - pad} x2={miniW - 4} y2={miniH - pad} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad} y1="6" x2={pad} y2={miniH - pad} stroke="#94a3b8" strokeWidth="1.5" />
          {data.map((v, i) => {
            const x = pad + 6 + i * ((miniW - pad * 1.5) / data.length);
            const y = toY(v);
            return <rect key={i} x={x} y={y} width={barW} height={miniH - pad - y} rx="3" fill={color} opacity="0.9" />;
          })}
          <text x={miniW / 2} y={miniH + 16} fill={color} fontSize="11" fontWeight="900" textAnchor="middle">{title}</text>
        </g>
      );
    };

    return (
      <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="max-w-full h-auto drop-shadow-md">
        {renderMini(dataA, yMinA, "#4ade80", 0, labelA)}
        {renderMini(dataB, yMinB, "#f43f5e", w / 2 + 6, labelB)}
      </svg>
    );
  }

  return null;
}
