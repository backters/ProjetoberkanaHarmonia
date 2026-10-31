import React from 'react';
import { PILLARS, LIFE_AREAS } from '../data/wheelData';
import { Heart, Briefcase, Users, Sparkles, ArrowRight } from 'lucide-react';

interface PillarsOverviewProps {
  onStartAssessment: () => void;
}

export const PillarsOverview: React.FC<PillarsOverviewProps> = ({ onStartAssessment }) => {
  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'pessoal':
        return <Heart className="w-5 h-5 text-teal-600" />;
      case 'profissional':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'relacionamentos':
        return <Users className="w-5 h-5 text-rose-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
            <span>Metodologia Berkana Harmonia</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Os 4 Pilares da Harmonia Integral
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Uma vida verdadeiramente equilibrada não exige perfeição 10/10 em todos os pontos, mas sim a fluidez necessária para que um setor não sabote ou drene os demais.
          </p>
        </div>

        {/* 4 Pillar Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => {
            const pillarAreas = LIFE_AREAS.filter((a) => a.pillar === pillar.id);

            return (
              <div
                key={pillar.id}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                        {getPillarIcon(pillar.id)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Pilar {pillar.name}
                        </h3>
                        <span className="text-xs text-slate-500">3 áreas integradas</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {pillar.shortDescription}
                  </p>

                  <div className="space-y-2">
                    {pillarAreas.map((area) => (
                      <div
                        key={area.id}
                        className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-slate-800">{area.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Holistic Insight Banner with Lifestyle Image */}
        <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Diagnóstico Científico & Humanizado
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              A sua roda rola macia ou com trancos diários?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              O segredo dos grandes líderes e mentes serenas não é trabalhar 16 horas ou abandonar a saúde: é saber qual área está puxando o freio de mão invisível. Faça o teste em menos de 3 minutos.
            </p>
            <div>
              <button
                type="button"
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <span>Calcular Meu Índice Agora</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full min-h-[300px] relative">
            <img
              src="/src/assets/images/harmony_lifestyle_journal_1793159364881.jpg"
              alt="Caderno de reflexões e chá matinal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
