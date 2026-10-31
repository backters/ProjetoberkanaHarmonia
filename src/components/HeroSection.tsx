import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartGuided: () => void;
  onStartFull: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartGuided,
  onStartFull,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/20 to-slate-50 border-b border-slate-200/80 pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-100/70 border border-teal-200/60 px-3 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Life Wheel Harmony Guide · Método Berkana</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]" style={{ textWrap: 'balance' }}>
              Encontre o equilíbrio real e consciente em todas as esferas da sua vida
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Uma autoavaliação interativa profunda baseada na Roda da Vida. Meça seus 12 setores essenciais, descubra seu Índice de Harmonia, identifique a sua <strong>Área Alavanca</strong> e receba um plano de ação personalizado diretamente por e-mail.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartGuided}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs hover:shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Iniciar Diagnóstico Passo a Passo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onStartFull}
                className="px-5 py-3.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
              >
                Modo Rápido (Roda Completa)
              </button>
            </div>

            {/* Quiet Metadata Proof */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                12 Áreas Estratégicas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Envio Automático do Dossiê
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Dados 100% Opcionais
              </span>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <img
                src="/src/assets/images/hero_life_harmony_1793159365089.jpg"
                alt="Composição de harmonia zen com pedras e folhagem verde"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/50 text-slate-900 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                    Harmonia Holística
                  </span>
                  <span className="text-xs font-bold text-slate-700">12 / 12 Dimensões</span>
                </div>
                <p className="text-xs text-slate-600">
                  "O equilíbrio não é estático; é a capacidade dinâmica da sua roda girar sem atritos desnecessários."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
