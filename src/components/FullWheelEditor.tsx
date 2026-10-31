import React, { useState } from 'react';
import { LIFE_AREAS, PILLARS } from '../data/wheelData';
import { PillarId, ScoresMap } from '../types/wheel';
import { WheelChart } from './WheelChart';
import { Check, RotateCcw, ListFilter } from 'lucide-react';

interface FullWheelEditorProps {
  scores: ScoresMap;
  onChangeScore: (areaId: string, value: number) => void;
  onReset: () => void;
  onFinish: () => void;
  onSwitchToGuided: () => void;
}

export const FullWheelEditor: React.FC<FullWheelEditorProps> = ({
  scores,
  onChangeScore,
  onReset,
  onFinish,
  onSwitchToGuided,
}) => {
  const [activePillarFilter, setActivePillarFilter] = useState<PillarId | 'all'>('all');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const filteredAreas = activePillarFilter === 'all'
    ? LIFE_AREAS
    : LIFE_AREAS.filter(a => a.pillar === activePillarFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Painel da Roda da Vida Interativa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Ajuste as notas de 1 a 10 e observe a transformação do gráfico em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSwitchToGuided}
            className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Modo Passo a Passo
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Restaurar notas padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redefinir</span>
          </button>
          <button
            type="button"
            onClick={onFinish}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-lg shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Gerar Diagnóstico</span>
          </button>
        </div>
      </div>

      {/* Grid: Wheel on Left, Sliders by Pillar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Sticky Wheel Chart */}
        <div className="lg:col-span-5 sticky top-20 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <WheelChart
            scores={scores}
            selectedAreaId={selectedAreaId || undefined}
            onSelectArea={(id) => setSelectedAreaId(id)}
            size={380}
            showDownload={true}
          />
        </div>

        {/* Right: Area Sliders organized by Pillar */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pillar Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActivePillarFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePillarFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos os Pilares (12)
            </button>
            {PILLARS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillarFilter(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activePillarFilter === p.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredAreas.map((area) => {
              const currentScore = scores[area.id] ?? 5;
              const isSelected = selectedAreaId === area.id;

              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`p-4 sm:p-5 rounded-xl border bg-white transition-all ${
                    isSelected
                      ? 'border-slate-800 shadow-sm ring-1 ring-slate-800'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: area.color }}
                        />
                        <h3 className="text-base font-semibold text-slate-900">
                          {area.name}
                        </h3>
                        <span className="text-xs text-slate-400">· {area.pillarName}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {area.guidingQuestion}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold tabular-nums text-slate-900">
                        {currentScore}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">/10</span>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="mt-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={currentScore}
                      onChange={(e) => onChangeScore(area.id, parseInt(e.target.value, 10))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 tabular-nums">
                      <span>1 (Crítico)</span>
                      <span>5 (Médio)</span>
                      <span>10 (Pleno)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action CTA */}
          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-teal-900">
                Pronto para descobrir o seu diagnóstico?
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                Calcularemos seu Índice de Harmonia, Ponto Forte e Área Alavanca estratégica.
              </p>
            </div>
            <button
              type="button"
              onClick={onFinish}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Concluir & Ver Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
