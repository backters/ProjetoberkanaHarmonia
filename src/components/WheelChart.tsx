import React, { useRef, useState } from 'react';
import { LIFE_AREAS, PILLARS } from '../data/wheelData';
import { ScoresMap } from '../types/wheel';
import { Download, Eye } from 'lucide-react';

interface WheelChartProps {
  scores: ScoresMap;
  onSelectArea?: (areaId: string) => void;
  selectedAreaId?: string;
  size?: number;
  showDownload?: boolean;
}

export const WheelChart: React.FC<WheelChartProps> = ({
  scores,
  onSelectArea,
  selectedAreaId,
  size = 460,
  showDownload = true,
}) => {
  const [viewMode, setViewMode] = useState<'sectors' | 'radar'>('sectors');
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const radius = size / 2;
  const padding = 50;
  const maxRadius = radius - padding;
  const center = radius;
  const totalAreas = LIFE_AREAS.length;
  const angleStep = (2 * Math.PI) / totalAreas;
  // Offset so the first segment starts at 12 o'clock (-PI / 2)
  const angleOffset = -Math.PI / 2;

  // Concentric circle steps
  const gridSteps = [2, 4, 6, 8, 10];

  // Helper to convert polar to cartesian
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInRad: number) => {
    return {
      x: centerX + r * Math.cos(angleInRad),
      y: centerY + r * Math.sin(angleInRad),
    };
  };

  // Build sector path (wedge)
  const createSectorPath = (index: number, score: number) => {
    const startAngle = angleOffset + index * angleStep;
    const endAngle = startAngle + angleStep;
    const r = Math.max(12, (score / 10) * maxRadius);

    const startOuter = polarToCartesian(center, center, r, startAngle);
    const endOuter = polarToCartesian(center, center, r, endAngle);

    // Minor inner radius so center isn't an ugly zero pinch
    const innerRadius = 14;
    const startInner = polarToCartesian(center, center, innerRadius, startAngle);
    const endInner = polarToCartesian(center, center, innerRadius, endAngle);

    return [
      `M ${startInner.x} ${startInner.y}`,
      `L ${startOuter.x} ${startOuter.y}`,
      `A ${r} ${r} 0 0 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 0 0 ${startInner.x} ${startInner.y}`,
      'Z',
    ].join(' ');
  };

  // Build radar polygon points
  const radarPoints = LIFE_AREAS.map((area, i) => {
    const score = scores[area.id] ?? 5;
    const angle = angleOffset + i * angleStep + angleStep / 2;
    const r = Math.max(14, (score / 10) * maxRadius);
    const pt = polarToCartesian(center, center, r, angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Download wheel as PNG
  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = `roda-da-vida-berkana-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  const activeHoveredArea = LIFE_AREAS.find(a => a.id === (hoveredAreaId || selectedAreaId));

  return (
    <div className="flex flex-col items-center select-none">
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setViewMode('sectors')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              viewMode === 'sectors' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Fatias da Vida
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              viewMode === 'radar' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Radar Contínuo
          </button>
        </div>

        {showDownload && (
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:border-slate-300 transition-colors whitespace-nowrap"
            title="Baixar imagem em alta resolução"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salvar Roda (PNG)</span>
          </button>
        )}
      </div>

      <div className="relative inline-flex items-center justify-center p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <radialGradient id="wheelRadarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.75" />
            </radialGradient>
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Concentric grid circles */}
          {gridSteps.map(step => {
            const r = (step / 10) * maxRadius;
            return (
              <g key={`grid-${step}`}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={step === 10 ? '1.5' : '1'}
                  strokeDasharray={step === 10 ? undefined : '2 3'}
                />
                <text
                  x={center + 3}
                  y={center - r + 11}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {step}
                </text>
              </g>
            );
          })}

          {/* Radial divider lines */}
          {LIFE_AREAS.map((_, i) => {
            const angle = angleOffset + i * angleStep;
            const endPt = polarToCartesian(center, center, maxRadius, angle);
            return (
              <line
                key={`line-${i}`}
                x1={center}
                y1={center}
                x2={endPt.x}
                y2={endPt.y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Slices / Sectors mode */}
          {viewMode === 'sectors' && (
            <g>
              {LIFE_AREAS.map((area, i) => {
                const score = scores[area.id] ?? 5;
                const pathData = createSectorPath(i, score);
                const isSelected = selectedAreaId === area.id;
                const isHovered = hoveredAreaId === area.id;

                return (
                  <path
                    key={`sector-${area.id}`}
                    d={pathData}
                    fill={area.color}
                    fillOpacity={isSelected || isHovered ? 0.95 : 0.72}
                    stroke={isSelected || isHovered ? '#0F172A' : '#FFFFFF'}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    onClick={() => onSelectArea?.(area.id)}
                  >
                    <title>{`${area.name}: ${score}/10`}</title>
                  </path>
                );
              })}
            </g>
          )}

          {/* Radar Mode */}
          {viewMode === 'radar' && (
            <g>
              <polygon
                points={radarPoints}
                fill="url(#wheelRadarGradient)"
                stroke="#0D9488"
                strokeWidth="2.5"
                filter="url(#subtleGlow)"
                className="transition-all duration-300"
              />
              {LIFE_AREAS.map((area, i) => {
                const score = scores[area.id] ?? 5;
                const angle = angleOffset + i * angleStep + angleStep / 2;
                const r = Math.max(14, (score / 10) * maxRadius);
                const pt = polarToCartesian(center, center, r, angle);
                const isHovered = hoveredAreaId === area.id || selectedAreaId === area.id;

                return (
                  <circle
                    key={`radar-point-${area.id}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill={area.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    onClick={() => onSelectArea?.(area.id)}
                  />
                );
              })}
            </g>
          )}

          {/* Outer Area Labels and Numeric Badges */}
          {LIFE_AREAS.map((area, i) => {
            const angle = angleOffset + i * angleStep + angleStep / 2;
            const labelRadius = maxRadius + 22;
            const pt = polarToCartesian(center, center, labelRadius, angle);
            const score = scores[area.id] ?? 5;
            const isSelected = selectedAreaId === area.id;
            const isHovered = hoveredAreaId === area.id;

            // Compute text anchor based on angle
            const cos = Math.cos(angle);
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (cos > 0.3) textAnchor = 'start';
            else if (cos < -0.3) textAnchor = 'end';

            return (
              <g
                key={`label-${area.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredAreaId(area.id)}
                onMouseLeave={() => setHoveredAreaId(null)}
                onClick={() => onSelectArea?.(area.id)}
              >
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  fontSize="11"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight={isSelected || isHovered ? '700' : '500'}
                  fill={isSelected || isHovered ? area.color : '#334155'}
                  className="transition-colors duration-150"
                >
                  {area.name}
                </text>
                {/* Score badge indicator */}
                <text
                  x={pt.x}
                  y={pt.y + 12}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  fontSize="9.5"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="700"
                  fill={area.color}
                >
                  {score}/10
                </text>
              </g>
            );
          })}

          {/* Center Hub */}
          <circle cx={center} cy={center} r={18} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={6} fill="#0D9488" />
        </svg>

        {/* Hover / Selected Area Info Floating Pill */}
        {activeHoveredArea && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none transition-all duration-200">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeHoveredArea.color }} />
            <span className="font-semibold">{activeHoveredArea.name}</span>
            <span className="text-slate-300">·</span>
            <span className="font-bold text-teal-300">
              {scores[activeHoveredArea.id] ?? 5}/10
            </span>
            <span className="text-slate-400">({activeHoveredArea.pillarName})</span>
          </div>
        )}
      </div>

      {/* 4 Pillars Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 w-full text-xs text-slate-600">
        {PILLARS.map(p => (
          <div
            key={p.id}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <span className="font-medium text-slate-700 truncate">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
