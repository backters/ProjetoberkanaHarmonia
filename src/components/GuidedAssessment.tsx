import React from 'react';
import { LIFE_AREAS, PILLARS } from '../data/wheelData';
import { ScoresMap } from '../types/wheel';
import { ArrowLeft, ArrowRight, Check, HelpCircle, Sparkles } from 'lucide-react';

interface GuidedAssessmentProps {
  currentStepIndex: number;
  scores: ScoresMap;
  onChangeScore: (areaId: string, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onSwitchToFull: () => void;
}

export const GuidedAssessment: React.FC<GuidedAssessmentProps> = ({
  currentStepIndex,
  scores,
  onChangeScore,
  onNext,
  onPrev,
  onFinish,
  onSwitchToFull,
}) => {
  const currentArea = LIFE_AREAS[currentStepIndex];
  const currentScore = scores[currentArea.id] ?? 5;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === LIFE_AREAS.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / LIFE_AREAS.length) * 100);

  // Pillar details
  const pillar = PILLARS.find(p => p.id === currentArea.pillar);

  // Score description helper
  const getScoreDescriptor = (score: number) => {
    if (score <= 3) return { label: 'Crítico / Incipiente', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
    if (score <= 5) return { label: 'Abaixo da Média / Desgaste', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    if (score <= 7) return { label: 'Bom / Em Desenvolvimento', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' };
    if (score <= 9) return { label: 'Muito Bom / Estável', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
    return { label: 'Plenitude / Alta Maestria', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' };
  };

  const descriptor = getScoreDescriptor(currentScore);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Top Header & Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentArea.color }}
            />
            <span className="uppercase tracking-wider text-slate-700">
              Pilar {currentArea.pillarName}
            </span>
          </div>
          <span>
            {currentStepIndex + 1} de {LIFE_AREAS.length} áreas ({progressPercent}%)
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: currentArea.color,
            }}
          />
        </div>
      </div>

      {/* Main Area Content */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentArea.name}
            </h2>
            <button
              type="button"
              onClick={onSwitchToFull}
              className="text-xs text-slate-500 hover:text-teal-700 underline underline-offset-4 cursor-pointer"
            >
              Ver todas as 12 áreas juntas
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            {currentArea.description}
          </p>
        </div>

        {/* Guiding Question Callout */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-teal-100/70 text-teal-800 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {currentArea.guidingQuestion}
              </p>
              <div className="mt-3 space-y-1.5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Perguntas de autorreflexão para calibrar sua nota:
                </span>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-slate-400">
                  {currentArea.detailedQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Slider & Scale */}
        <div className="pt-2 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-800">
              Sua avaliação atual (1 a 10):
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${descriptor.bg} ${descriptor.color}`}>
                {descriptor.label}
              </span>
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {currentScore}
                <span className="text-xs text-slate-400 font-normal">/10</span>
              </span>
            </div>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={currentScore}
            onChange={(e) => onChangeScore(currentArea.id, parseInt(e.target.value, 10))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
          />

          {/* Quick Click Buttons from 1 to 10 */}
          <div className="grid grid-cols-10 gap-1.5 mt-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onChangeScore(currentArea.id, val)}
                className={`h-10 rounded-lg text-sm font-bold transition-all tabular-nums cursor-pointer ${
                  currentScore === val
                    ? 'text-white shadow-sm ring-2 ring-offset-1 ring-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                style={{
                  backgroundColor: currentScore === val ? currentArea.color : undefined,
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
              isFirst
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Próxima Área</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Finalizar & Gerar Diagnóstico</span>
              <Check className="w-4 h-4 text-teal-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
