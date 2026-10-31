// Utility to generate a high-resolution PNG image of the 12-pillar Radar/Mandala chart
// for embedding into diagnostic report emails without getting blocked by email clients.

export interface PillarScore {
  name: string;
  score: number;
}

export function generateRadarChartPng(
  scores: number[],
  pillarNames: string[],
  focusAreaTitle: string,
  average: number
): string {
  if (typeof document === 'undefined') return '';

  const size = 700;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Subtle border & background card
  ctx.fillStyle = '#FCF8FA';
  ctx.beginPath();
  ctx.roundRect(14, 14, size - 28, size - 28, 24);
  ctx.fill();
  ctx.strokeStyle = '#F0D5E5';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header Titles
  ctx.textAlign = 'center';
  ctx.fillStyle = '#831843';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('DIAGNÓSTICO DA HARMONIA ENERGÉTICA', size / 2, 48);

  ctx.fillStyle = '#BE185D';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${focusAreaTitle} · Fabiana Berkana`, size / 2, 70);

  // Center & Radar Radius
  const cx = size / 2;
  const cy = size / 2 + 15;
  const maxRadius = 190;
  const totalPillars = 12;

  const getCoords = (index: number, score: number, radiusRatio = maxRadius) => {
    const angle = (Math.PI * 2 * index) / totalPillars - Math.PI / 2;
    const r = (radiusRatio * score) / 9;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // 1. Concentric Grid Polygons (Levels 1, 3, 5, 7, 9)
  const gridLevels = [1, 3, 5, 7, 9];
  gridLevels.forEach((level) => {
    ctx.beginPath();
    for (let i = 0; i < totalPillars; i++) {
      const { x, y } = getCoords(i, level);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = level === 9 ? '#D8B4E2' : '#F2DEF0';
    ctx.lineWidth = level === 5 || level === 9 ? 1.5 : 0.8;
    ctx.stroke();

    // Level indicator numbers
    const topCoord = getCoords(0, level);
    ctx.fillStyle = '#A21CAF';
    ctx.font = '9px sans-serif';
    ctx.fillText(`${level}`, topCoord.x + 10, topCoord.y + 3);
  });

  // 2. Axis lines from center to outer ring
  for (let i = 0; i < totalPillars; i++) {
    const outer = getCoords(i, 9);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(outer.x, outer.y);
    ctx.strokeStyle = '#F2DEF0';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 3. User Score Filled Polygon
  ctx.beginPath();
  for (let i = 0; i < totalPillars; i++) {
    const score = scores[i] ?? 5;
    const { x, y } = getCoords(i, score);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient fill
  const gradient = ctx.createLinearGradient(cx - maxRadius, cy - maxRadius, cx + maxRadius, cy + maxRadius);
  gradient.addColorStop(0, 'rgba(190, 24, 93, 0.45)');
  gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.40)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.35)');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = '#9D174D';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 4. Vertex dots
  for (let i = 0; i < totalPillars; i++) {
    const score = scores[i] ?? 5;
    const { x, y } = getCoords(i, score);
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#9D174D';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 5. Labels around the perimeter
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  for (let i = 0; i < totalPillars; i++) {
    const score = scores[i] ?? 5;
    const name = pillarNames[i] || `Pilar ${i + 1}`;
    const labelRadius = maxRadius + 32;
    const { x: lx, y: ly } = getCoords(i, 9, labelRadius);

    // Split label into 2 lines if needed
    const words = name.split(' ');
    let line1 = name;
    let line2 = '';
    if (words.length > 2) {
      line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4A1D4B';
    if (line2) {
      ctx.fillText(line1, lx, ly - 7);
      ctx.fillText(line2, lx, ly + 6);
      ctx.fillStyle = '#BE185D';
      ctx.fillText(`${score}/9`, lx, ly + 19);
    } else {
      ctx.fillText(line1, lx, ly - 4);
      ctx.fillStyle = '#BE185D';
      ctx.fillText(`${score}/9`, lx, ly + 10);
    }
  }

  // 6. Bottom Average Badge
  const badgeWidth = 240;
  const badgeHeight = 36;
  const badgeX = cx - badgeWidth / 2;
  const badgeY = size - 52;
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 18);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Média Geral: ${average.toFixed(1)} / 9.0`, cx, badgeY + badgeHeight / 2);

  return canvas.toDataURL('image/png');
}
