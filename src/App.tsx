import React, { useState, useMemo, useEffect } from 'react';
import { Download, Sparkles, MessageCircle } from 'lucide-react';
import { generateRadarChartPng } from './utils/chartGenerator';

export type LifeFocusArea = 'Pessoal' | 'Profissional' | 'Relacionamento' | 'Familiar' | 'Outro';

export interface PillarDescription {
  id: number;
  name: string;
  summary: string;
}

const PILLARS: PillarDescription[] = [
  {
    id: 1,
    name: 'Plenitude e Felicidade',
    summary:
      'O quanto você se sente realizada, alegre e em paz com a área que está analisando?',
  },
  {
    id: 2,
    name: 'Equilíbrio Emocional',
    summary:
      'Como você lida com os desafios e os momentos de pressão nesta área, sem perder a sua centralidade?',
  },
  {
    id: 3,
    name: 'Desenvolvimento Intelectual',
    summary:
      'O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?',
  },
  {
    id: 4,
    name: 'Contribuição Social',
    summary:
      'Qual é a sensação de pertencimento, valor e impacto positivo que você percebe nesta área da sua vida?',
  },
  {
    id: 5,
    name: 'Saúde e Disposição',
    summary:
      'Como está a sua vitalidade, a sua energia física e a leveza ao lidar com esta questão?',
  },
  {
    id: 6,
    name: 'Vida Social',
    summary:
      'De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?',
  },
  {
    id: 7,
    name: 'Espiritualidade',
    summary:
      'O quanto você sente que este aspecto da sua vida está alinhado com o seu propósito maior e com a sua verdade?',
  },
  {
    id: 8,
    name: 'Relacionamento Familiar',
    summary:
      'Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?',
  },
  {
    id: 9,
    name: 'Relacionamento Amoroso',
    summary:
      'Como você avalia a troca de afeto, a cumplicidade e o equilíbrio entre dar e receber nesta área?',
  },
  {
    id: 10,
    name: 'Recursos Financeiros',
    summary:
      'Como você se sente em relação à estabilidade, à prosperidade e ao fluxo de recursos ligados a este tema?',
  },
  {
    id: 11,
    name: 'Hobbies e Diversão',
    summary:
      'Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?',
  },
  {
    id: 12,
    name: 'Realização Profissional',
    summary:
      'O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?',
  },
];

const FREQUENCIES = [
  { name: 'Vergonha', hz: 20 },
  { name: 'Culpa', hz: 30 },
  { name: 'Apatia', hz: 50 },
  { name: 'Medo', hz: 100 },
  { name: 'Raiva', hz: 150 },
  { name: 'Coragem', hz: 200 },
  { name: 'Neutralidade', hz: 250 },
  { name: 'Aceitação', hz: 350 },
  { name: 'Amor', hz: 500 },
  { name: 'Alegria', hz: 540 },
  { name: 'Paz', hz: 600 },
  { name: 'Iluminação', hz: 700 },
];

const WHATSAPP_PHONE = '5511930057499';

// Returns dynamic title according to selected life focus area
export function getAppTitle(focusArea: LifeFocusArea): { main: string; complement: string; full: string } {
  const base = 'Diagnóstico da Harmonia Energética';
  if (focusArea === 'Outro') {
    return { main: base, complement: '', full: base };
  }
  const prefix = focusArea === 'Relacionamento' ? ' de ' : ' ';
  const complement = `${prefix}${focusArea}`;
  return { main: base, complement, full: `${base}${complement}` };
}

// Sacred Geometry Mandala
function Mandala({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden={true}>
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        {Array.from({ length: 12 }).map((_, t) => (
          <ellipse
            key={t}
            cx="100"
            cy="100"
            rx="22"
            ry="80"
            transform={`rotate(${t * 15} 100 100)`}
          />
        ))}
        {[20, 45, 70, 95].map((e) => (
          <circle key={e} cx="100" cy="100" r={e} />
        ))}
        {Array.from({ length: 24 }).map((_, t) => (
          <circle
            key={`p${t}`}
            cx={100 + 95 * Math.cos((t * Math.PI) / 12)}
            cy={100 + 95 * Math.sin((t * Math.PI) / 12)}
            r="4"
          />
        ))}
      </g>
    </svg>
  );
}

// Button Component
function ActionButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer';

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// Energy Reading Text (calculated for 1-9 scale, average between 1 and 9)
function getReadingText(avg: number): string {
  if (avg < 3.5) {
    return 'Sua roda revela um momento de energia contraída. Isso não é um julgamento — é um convite amoroso para olhar para dentro, acolher o que pesa e reconectar-se com sua força essencial. Pequenos movimentos de cuidado já começam a elevar sua vibração.';
  }
  if (avg < 5.5) {
    return 'Você vive um ponto de transição: há coragem e consciência despertando, mas alguns pilares ainda drenam sua energia. Harmonizar essas áreas pode liberar um fluxo poderoso de clareza e realização.';
  }
  if (avg < 7.5) {
    return 'Sua energia flui em boa sintonia, com bases sólidas de aceitação e propósito. O próximo passo é refinar as áreas que destoam para que sua roda gire de forma ainda mais harmônica e abundante.';
  }
  return 'Que linda vibração! Sua roda irradia equilíbrio, amor e expansão. Continue nutrindo sua consciência e compartilhando essa luz — e esteja atenta às sutilezas que mantêm essa harmonia viva.';
}

// SVG Radar Chart adjusted for 1 to 9 scale
function RadarWheelChart({ scores }: { scores: number[] }) {
  const getCoords = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / 12 - Math.PI / 2;
    return [
      180 + ((120 * score) / 9) * Math.cos(angle),
      180 + ((120 * score) / 9) * Math.sin(angle),
    ];
  };

  const polygonPoints = scores
    .map((score, index) => getCoords(index, score).join(','))
    .join(' ');

  // Levels for 1-9 scale: 1, 3, 5, 7, 9
  const gridLevels = [1, 3, 5, 7, 9];

  return (
    <svg viewBox="0 0 360 360" className="w-full">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--pink)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--green)" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Concentric Polygons */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={PILLARS.map((_, i) => getCoords(i, level).join(',')).join(' ')}
          fill="none"
          stroke="var(--border)"
        />
      ))}

      {/* Axis Lines */}
      {PILLARS.map((_, i) => {
        const [x, y] = getCoords(i, 9);
        return <line key={i} x1={180} y1={180} x2={x} y2={y} stroke="var(--border)" />;
      })}

      {/* User Data Polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#fill)"
        stroke="var(--primary)"
        strokeWidth="2"
        style={{ transition: 'all .6s' }}
      />

      {/* Circles and Text Labels */}
      {scores.map((score, index) => {
        const [x, y] = getCoords(index, score);
        const [lx, ly] = getCoords(index, 11.2);
        const words = PILLARS[index].name.split(' ');

        return (
          <g key={index}>
            <circle cx={x} cy={y} r="4" fill="var(--primary)">
              <title>{`${PILLARS[index].name}: ${score}/9`}</title>
            </circle>

            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--muted-foreground)"
            >
              {words.length > 2 ? (
                <>
                  <tspan x={lx} dy="-0.3em">
                    {words.slice(0, 1).join(' ')}
                  </tspan>
                  <tspan x={lx} dy="1.1em">
                    {words.slice(1).join(' ')}
                  </tspan>
                </>
              ) : (
                <>
                  <tspan x={lx} dy="-0.3em">
                    {words[0]}
                  </tspan>
                  {words[1] && (
                    <tspan x={lx} dy="1.1em">
                      {words.slice(1).join(' ')}
                    </tspan>
                  )}
                </>
              )}
              <tspan x={lx} dy="1.2em" fontWeight="700" fill="var(--primary)">
                {score}
              </tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// 1. WELCOME VIEW
function WelcomeView({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  focusArea,
  setFocusArea,
  otherAreaText,
  setOtherAreaText,
  onStart,
}: {
  userName: string;
  setUserName: (n: string) => void;
  userEmail: string;
  setUserEmail: (e: string) => void;
  userPhone: string;
  setUserPhone: (p: string) => void;
  focusArea: LifeFocusArea;
  setFocusArea: (a: LifeFocusArea) => void;
  otherAreaText: string;
  setOtherAreaText: (t: string) => void;
  onStart: () => void;
}) {
  const titleInfo = getAppTitle(focusArea);
  const areasList: LifeFocusArea[] = ['Pessoal', 'Profissional', 'Relacionamento', 'Familiar', 'Outro'];

  return (
    <section className="fade-up flex min-h-[85vh] flex-col items-center justify-center text-center">
      <Mandala className="mb-6 h-24 w-24 text-primary spin-slow" />
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink">
        Fabiana Berkana
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Taróloga e Terapeuta Energética Familiar
      </p>

      {/* Main Dynamic Title according to chosen life focus area */}
      <h1 className="mt-6 text-3xl font-medium leading-tight text-foreground sm:text-5xl max-w-3xl">
        {titleInfo.full}
      </h1>

      <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
        Cada pilar da sua vida vibra em uma frequência de 1 a 9. Mapeie onde sua energia flui em plena expansão
        e onde pede harmonização para elevar sua consciência e alinhar propósito, prosperidade e bem-estar.
      </p>

      {/* Selection of Life Focus Area */}
      <div className="mt-8 w-full max-w-lg space-y-3 text-left">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
          Escolha em qual área da sua vida deseja o diagnóstico:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {areasList.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setFocusArea(area)}
              className={`rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
                focusArea === area
                  ? 'bg-gradient-primary text-primary-foreground shadow-soft scale-102 ring-2 ring-primary/30'
                  : 'glass text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* If 'Outro' is chosen, exemplify/describe which area */}
        {focusArea === 'Outro' && (
          <div className="pt-2 fade-up">
            <input
              type="text"
              value={otherAreaText}
              onChange={(e) => setOtherAreaText(e.target.value)}
              placeholder="Exemplifique qual a área (ex: Transição de Vida, Criatividade, Saúde Espiritual)"
              className="w-full rounded-2xl glass px-5 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        )}
      </div>

      {/* Optional Name, Email & Phone inputs */}
      <div className="mt-6 w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Seu nome (opcional)"
            className="w-full rounded-full glass px-6 py-3.5 text-center text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="relative">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Seu e-mail (opcional)"
            className="w-full rounded-full glass px-6 py-3.5 text-center text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="relative">
          <input
            type="tel"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Seu WhatsApp / Telefone (opcional)"
            className="w-full rounded-full glass px-6 py-3.5 text-center text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      <div className="mt-8">
        <ActionButton onClick={onStart}>
          Iniciar Minha Jornada Energética ✦
        </ActionButton>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        12 pilares fundamentais · em 2 minutos
      </p>
    </section>
  );
}

// 2. QUIZ VIEW
function QuizView({
  scores,
  current,
  setCurrent,
  setScore,
  focusArea,
  onFinish,
}: {
  scores: number[];
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setScore: (score: number) => void;
  focusArea: LifeFocusArea;
  onFinish: () => void;
}) {
  const currentPillar = PILLARS[current];
  const currentScore = scores[current] ?? 5;
  const isLast = current === PILLARS.length - 1;
  const titleInfo = getAppTitle(focusArea);

  return (
    <section className="fade-up flex min-h-[85vh] flex-col justify-center">
      {/* Dynamic Header Badge */}
      <div className="mb-4 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">
          {titleInfo.main}
          {titleInfo.complement}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Pilar {current + 1} de 12</span>
          <span>{Math.round(((current + 1) / 12) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${((current + 1) / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Glass Card */}
      <div className="glass fade-up rounded-3xl p-6 shadow-soft sm:p-10">
        <h2 className="text-center text-3xl font-medium sm:text-5xl">
          {currentPillar.id}. {currentPillar.name}
        </h2>

        {/* Detailed exemplification of what this area represents */}
        <div className="mt-4 max-w-xl mx-auto p-4 rounded-2xl bg-card/60 border border-border/80 text-center">
          <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 italic font-medium">
            "{currentPillar.summary}"
          </p>
        </div>

        <p className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
          Como você sente a energia deste pilar hoje? Escolha uma nota de <strong>1 a 9</strong>:
        </p>

        {/* Big Score Display */}
        <div className="my-6 text-center font-display text-7xl text-primary">
          {currentScore}
          <span className="text-xs text-muted-foreground font-sans font-normal ml-1">/9</span>
        </div>

        {/* 9 Score Buttons (1 to 9 scale) */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2 max-w-md mx-auto">
          {Array.from({ length: 9 }, (_, t) => t + 1).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setScore(val)}
              aria-label={`Nota ${val}`}
              className={`aspect-square rounded-full border text-base sm:text-lg font-semibold transition-all cursor-pointer ${
                val === currentScore
                  ? 'scale-110 border-transparent bg-gradient-primary text-primary-foreground shadow-soft ring-2 ring-primary/40'
                  : val < currentScore
                  ? 'border-accent bg-accent/60 text-accent-foreground'
                  : 'bg-card text-muted-foreground hover:border-primary'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-between text-xs font-medium text-foreground/70 max-w-md mx-auto px-1">
          <span>1 · Baixa vibração</span>
          <span>5 · Equilíbrio</span>
          <span>9 · Plena expansão</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="rounded-full border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground/80 disabled:opacity-30 cursor-pointer"
        >
          ← Voltar
        </button>
        <ActionButton onClick={() => (isLast ? onFinish() : setCurrent(current + 1))}>
          {isLast ? 'Ver Resultado ✦' : 'Próximo →'}
        </ActionButton>
      </div>
    </section>
  );
}

// 3. RESULT VIEW
function ResultView({
  scores,
  focusArea,
  otherAreaText,
  onRestart,
}: {
  scores: number[];
  focusArea: LifeFocusArea;
  otherAreaText: string;
  onRestart: () => void;
}) {
  const average = scores.reduce((sum, val) => sum + val, 0) / 12;
  const titleInfo = getAppTitle(focusArea);

  const sortedPillars = useMemo(
    () =>
      scores
        .map((score, i) => ({ score, name: PILLARS[i].name, summary: PILLARS[i].summary }))
        .sort((a, b) => b.score - a.score),
    [scores]
  );

  const expansionPoints = sortedPillars.slice(0, 3);
  const harmonizationPoints = sortedPillars.slice(-3).reverse();

  // On 1-9 scale, map average (1-9) to frequency index (0-11)
  const freqIndex = Math.min(
    FREQUENCIES.length - 1,
    Math.max(0, Math.round(((average - 1) / 8) * (FREQUENCIES.length - 1)))
  );
  const currentFrequency = FREQUENCIES[freqIndex];
  const freqPosition = (freqIndex / (FREQUENCIES.length - 1)) * 100;

  // Dynamic WhatsApp booking link matching screenshot format:
  // "Olá Fabiana! Fiz o [Nome do Diagnóstico] com média geral de [X.X]/9. O principal ponto a harmonizar foi "[Pilar]" e gostaria de agendar minha devolutiva completa."
  const lowestPillar = harmonizationPoints[0] || sortedPillars[sortedPillars.length - 1];
  const lowestPillarName = lowestPillar ? lowestPillar.name : 'Equilíbrio Emocional';
  const fullDiagnosisTitle =
    focusArea === 'Outro' && otherAreaText.trim()
      ? `${titleInfo.full} (${otherAreaText.trim()})`
      : titleInfo.full;

  const whatsappMessage = `Olá Fabiana! Fiz o ${fullDiagnosisTitle} com média geral de ${average.toFixed(1)}/9. O principal ponto a harmonizar foi "${lowestPillarName}" e gostaria de agendar minha devolutiva completa.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="fade-up space-y-6">
      {/* Header */}
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {titleInfo.main}
          {titleInfo.complement}
          {focusArea === 'Outro' && otherAreaText ? ` (${otherAreaText})` : ''}
        </p>
        <h1 className="mt-3 text-3xl font-medium sm:text-5xl">
          Média geral <span className="text-primary">{average.toFixed(1)}</span>
          <span className="text-xs font-sans text-muted-foreground font-normal ml-1.5">/ 9.0</span>
        </h1>
      </header>

      {/* Radar Chart */}
      <div className="glass rounded-3xl p-4 shadow-soft sm:p-8">
        <RadarWheelChart scores={scores} />
      </div>

      {/* Frequency Scale */}
      <div className="glass rounded-3xl p-6 shadow-soft sm:p-8">
        <h2 className="text-3xl font-medium">Escala de Frequências</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sua média sintoniza com o estado de{' '}
          <strong className="text-primary">{currentFrequency.name}</strong> (~
          {currentFrequency.hz} Hz).
        </p>

        {/* Gradient Frequency Bar */}
        <div className="relative mt-8 h-3 rounded-full bg-gradient-frequency">
          <div
            className="absolute -top-2 h-7 w-7 -translate-x-1/2 rounded-full border-4 border-card bg-primary shadow-soft transition-all duration-700"
            style={{ left: `${freqPosition}%` }}
          />
        </div>

        {/* Frequency Labels */}
        <div className="mt-4 grid grid-cols-4 gap-1 text-center text-[10px] sm:grid-cols-6 sm:text-xs">
          {FREQUENCIES.map((f, idx) => (
            <span
              key={f.name}
              className={idx === freqIndex ? 'font-bold text-primary' : 'text-muted-foreground'}
            >
              {f.name} <span className="opacity-60">{f.hz}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Energy Reading Card */}
      <div className="glass rounded-3xl p-6 shadow-soft sm:p-8">
        <h2 className="text-3xl font-medium">Leitura Energética</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {getReadingText(average)}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Pontos de Expansão */}
          <div className="rounded-2xl bg-secondary p-5">
            <h3 className="text-xl font-semibold text-secondary-foreground">
              ✦ Pontos de expansão (Maiores notas)
            </h3>
            <ul className="mt-3 space-y-2">
              {expansionPoints.map((item) => (
                <li key={item.name} className="flex justify-between items-center text-sm">
                  <span>{item.name}</span>
                  <strong className="text-primary font-bold">{item.score}/9</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Pedem Harmonização */}
          <div className="rounded-2xl bg-accent/60 p-5">
            <h3 className="text-xl font-semibold text-accent-foreground">
              ❀ Pedem harmonização (Menores notas)
            </h3>
            <ul className="mt-3 space-y-2">
              {harmonizationPoints.map((item) => (
                <li key={item.name} className="flex justify-between items-center text-sm">
                  <span>{item.name}</span>
                  <strong className="text-primary font-bold">{item.score}/9</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Exemplification Glossary of All 12 Areas */}
        <div className="mt-8 pt-6 border-t border-border/70">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            ✦ Perguntas de reflexão de cada uma das 12 áreas:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-muted-foreground">
            {PILLARS.map((p) => {
              const currentVal = scores[p.id - 1];
              return (
                <div key={p.id} className="p-3 rounded-xl bg-card/60 border border-border/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-foreground text-sm">
                      {p.id}. {p.name}
                    </span>
                    <span className="font-bold text-primary">{currentVal}/9</span>
                  </div>
                  <p>{p.summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call To Action Box - Devolutiva Completa */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-soft sm:p-12 border border-white/20">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnóstico Profundo & Harmonização</span>
          </div>

          {/* Bold headline requested by user */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">
            O que o seu reflexo está te mostrando?
          </h2>

          {/* Persuasive copy */}
          <div className="mt-5 space-y-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-white/95">
            <p className="font-medium text-base sm:text-lg text-white">
              Sua autoavaliação revelou como você percebe seu momento atual. Mas será que existem bloqueios que ainda não consegue enxergar?
            </p>
            <p className="opacity-90">
              Descubra o que está por trás dos seus desequilíbrios e receba uma devolutiva completa com orientações para o seu processo de harmonização.
            </p>
          </div>

          {/* Main Action Button */}
          <div className="mt-8 flex flex-col items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 sm:px-10 sm:py-4.5 font-bold text-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/95 cursor-pointer ring-4 ring-white/25 text-base sm:text-lg"
            >
              <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Receber Minha Devolutiva Completa</span>
              <span className="text-primary/70">✦</span>
            </a>
            <p className="mt-3.5 text-xs font-medium text-white/80">
              Atendimento individualizado com Fabiana Berkana via WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pb-10 flex flex-col items-center justify-center gap-3.5 text-center no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-card/90 shadow-soft transition-all duration-300 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-primary opacity-80" />
          <span>Baixar como PDF</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
        >
          Refazer a avaliação
        </button>
      </div>
    </section>
  );
}

// 4. MAIN APP CONTAINER
export default function App() {
  const [view, setView] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  // Default score 5 (on 1-9 scale)
  const [scores, setScores] = useState<number[]>(Array(12).fill(5));
  const [currentPillar, setCurrentPillar] = useState(0);

  // Life Focus Area selection
  const [focusArea, setFocusArea] = useState<LifeFocusArea>('Pessoal');
  const [otherAreaText, setOtherAreaText] = useState('');

  // User input fields at the beginning
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Apply theme attribute to body/container whenever focusArea changes
  useEffect(() => {
    const themeKey = focusArea.toLowerCase();
    document.documentElement.setAttribute('data-theme', themeKey);
    document.title = getAppTitle(focusArea).full;
  }, [focusArea]);

  // Finished assessment handler
  const handleFinishQuiz = () => {
    const avg = scores.reduce((sum, v) => sum + v, 0) / 12;
    const sorted = scores
      .map((score, i) => ({ score, name: PILLARS[i].name }))
      .sort((a, b) => b.score - a.score);

    const freqIdx = Math.min(
      FREQUENCIES.length - 1,
      Math.max(0, Math.round(((avg - 1) / 8) * (FREQUENCIES.length - 1)))
    );
    const freq = FREQUENCIES[freqIdx];
    const titleInfo = getAppTitle(focusArea);

    // Generate high-resolution PNG chart image to avoid Gmail image blocking (attached as inline CID)
    let chartImageBase64 = '';
    try {
      chartImageBase64 = generateRadarChartPng(
        scores,
        PILLARS.map((p) => p.name),
        titleInfo.full,
        avg
      );
    } catch (chartErr) {
      console.warn('Could not generate chart PNG:', chartErr);
    }

    // Background automatic dispatch via Resend API to fabianaberkana@gmail.com
    fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: userEmail.trim(),
        name: userName.trim(),
        phone: userPhone.trim(),
        focusArea: focusArea === 'Outro' && otherAreaText ? `Outro (${otherAreaText})` : focusArea,
        title: `${titleInfo.main}${titleInfo.complement}`,
        scores: scores.map((s, idx) => ({
          id: PILLARS[idx].id,
          name: PILLARS[idx].name,
          score: s,
          summary: PILLARS[idx].summary,
        })),
        average: avg,
        frequencyName: freq.name,
        frequencyHz: freq.hz,
        reading: getReadingText(avg),
        expansionPoints: sorted.slice(0, 3),
        harmonizationPoints: sorted.slice(-3).reverse(),
        chartImage: chartImageBase64,
      }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        console.log('[Berkana Diagnostic Report] Email dispatch response:', result);
      })
      .catch((err) => {
        // Completely silent for end user in UI
        console.warn('[Berkana Diagnostic Report] Silent email delivery error:', err);
      });

    // Reset captured input fields to initial state
    setUserName('');
    setUserEmail('');
    setUserPhone('');

    // Switch to result screen
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setScores(Array(12).fill(5));
    setCurrentPillar(0);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setFocusArea('Pessoal');
    setOtherAreaText('');
    setView('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12 transition-colors duration-500">
      {/* Background Mandalas */}
      <Mandala className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] text-pink opacity-30 spin-slow" />
      <Mandala className="pointer-events-none absolute -bottom-48 -left-48 h-[560px] w-[560px] text-green opacity-25 spin-slow" />

      <div className="relative mx-auto max-w-3xl">
        {view === 'welcome' && (
          <WelcomeView
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            focusArea={focusArea}
            setFocusArea={setFocusArea}
            otherAreaText={otherAreaText}
            setOtherAreaText={setOtherAreaText}
            onStart={() => setView('quiz')}
          />
        )}

        {view === 'quiz' && (
          <QuizView
            scores={scores}
            current={currentPillar}
            setCurrent={setCurrentPillar}
            setScore={(scoreVal) =>
              setScores((prev) =>
                prev.map((val, idx) => (idx === currentPillar ? scoreVal : val))
              )
            }
            focusArea={focusArea}
            onFinish={handleFinishQuiz}
          />
        )}

        {view === 'result' && (
          <ResultView
            scores={scores}
            focusArea={focusArea}
            otherAreaText={otherAreaText}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  );
}
