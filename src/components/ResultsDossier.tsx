import React, { useState } from 'react';
import { HarmonyReport, ScoresMap } from '../types/wheel';
import { WheelChart } from './WheelChart';
import { LIFE_AREAS, PILLARS } from '../data/wheelData';
import {
  Sparkles,
  Zap,
  ShieldAlert,
  Trophy,
  Calendar,
  Share2,
  Printer,
  Mail,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';

interface ResultsDossierProps {
  report: HarmonyReport;
  scores: ScoresMap;
  recipientEmail?: string;
  onSendEmailTo: (email: string) => Promise<void>;
  onShowEmailPreview: () => void;
  onRestart: () => void;
  isSendingEmail: boolean;
}

export const ResultsDossier: React.FC<ResultsDossierProps> = ({
  report,
  scores,
  recipientEmail,
  onSendEmailTo,
  onShowEmailPreview,
  onRestart,
  isSendingEmail,
}) => {
  const [inlineEmail, setInlineEmail] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌟 Acabei de realizar meu diagnóstico na Roda da Vida Berkana Harmonia!\n\n` +
      `📊 Meu Índice de Harmonia: ${report.harmonyIndex}%\n` +
      `⭐ Maior Força: ${report.strongestArea.name} (${scores[report.strongestArea.id]}/10)\n` +
      `🎯 Minha Área Alavanca: ${report.leverageArea.name} (${scores[report.leverageArea.id]}/10)\n\n` +
      `Faça o seu diagnóstico gratuito também: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `Meu Índice de Harmonia na Roda da Vida foi de ${report.harmonyIndex}%! Área alavanca: ${report.leverageArea.name}. Teste aqui: ${window.location.origin}`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleInlineEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineEmail.trim()) return;
    await onSendEmailTo(inlineEmail.trim());
    setInlineEmail('');
  };

  const handleRequestAiInsights = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          harmonyIndex: report.harmonyIndex,
          strongestArea: report.strongestArea.name,
          criticalArea: report.criticalArea.name,
          leverageArea: report.leverageArea.name,
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis(
          `Com base na sua Área Alavanca (${report.leverageArea.name}), foque os próximos 14 dias em rituais matinais consistentes. Pequenos ganhos aqui criam um efeito cascata que eleva naturalmente a sua produtividade e bem-estar geral.`
        );
      }
    } catch {
      setAiAnalysis(
        `Sua Área Alavanca (${report.leverageArea.name}) é o pilar que sustenta o restante da sua estrutura. Dedicar 20 minutos de atenção diária exclusiva a este ponto é a forma mais rápida de restabelecer a harmonia completa.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner with Harmony Score Badge */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Harmony Score Ring */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Índice de Harmonia
            </span>

            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={report.harmonyIndex >= 70 ? '#0D9488' : report.harmonyIndex >= 50 ? '#2563EB' : '#E11D48'}
                  strokeWidth="8"
                  strokeDasharray={`${(report.harmonyIndex / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  {report.harmonyIndex}%
                </span>
                <span className="text-[11px] font-medium text-slate-500">Equilíbrio</span>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200 mt-2">
              {report.tierLabel}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Média geral: {report.overallAverage} / 10
            </span>
          </div>

          {/* Diagnostic Narrative */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Diagnóstico de Vida Berkana</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Seu Diagnóstico Integral de Harmonia
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {report.tierDescription}
            </p>

            {/* Strategic Pillars Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {PILLARS.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 tabular-nums">
                    {report.pillarAverages[p.id]}
                    <span className="text-xs text-slate-400 font-normal">/10</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Dispatch Notice / Trigger */}
            <div className="pt-3 border-t border-slate-100">
              {recipientEmail ? (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs">
                  <div className="flex items-center gap-2 text-teal-900">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      Dossiê completo enviado para: <strong>{recipientEmail}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onShowEmailPreview}
                    className="font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-4 cursor-pointer"
                  >
                    Visualizar E-mail Enviado →
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleInlineEmailSubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-700 shrink-0">
                    <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-medium">Receber este relatório por e-mail:</span>
                  </div>
                  <input
                    type="email"
                    value={inlineEmail}
                    onChange={(e) => setInlineEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="flex-1 min-w-0 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    {isSendingEmail ? 'Enviando...' : 'Enviar Agora'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wheel Visualizer & Key Strategic Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive SVG Wheel */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900 mb-1 self-start">
            Gráfico da Roda da Vida
          </h3>
          <p className="text-xs text-slate-500 mb-4 self-start">
            Clique nas áreas para inspecionar os detalhes e notas individuais.
          </p>

          <WheelChart scores={scores} size={420} showDownload={true} />
        </div>

        {/* Right: Key Highlights (Leverage Area, Strongest Area, Critical Area) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Spotlight: Área Alavanca (The Crucial Coaching Concept) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
                <Zap className="w-3.5 h-3.5" />
                <span>Sua Área Alavanca Prioritária</span>
              </div>

              <h4 className="text-2xl font-bold tracking-tight text-white">
                {report.leverageArea.name} ({scores[report.leverageArea.id]}/10)
              </h4>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                No método de harmonia integral, a <strong>Área Alavanca</strong> é o ponto de maior impacto sistêmico. Quando você investe intencionalmente em {report.leverageArea.name.toLowerCase()}, esse avanço desobstrui energia e impulsiona automaticamente as outras 11 áreas.
              </p>

              <div className="pt-2 text-xs text-teal-200/80 flex items-center gap-1.5">
                <span>Pilar: {report.leverageArea.pillarName}</span>
                <span>·</span>
                <span>Impacto: Efeito Dominó Positivo</span>
              </div>
            </div>
          </div>

          {/* Maior Fortaleza vs Ponto Crítico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fortaleza */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>Maior Fortaleza</span>
              </div>
              <h5 className="text-lg font-bold text-slate-900">
                {report.strongestArea.name}
              </h5>
              <div className="text-2xl font-black text-emerald-700 tabular-nums">
                {scores[report.strongestArea.id]}/10
              </div>
              <p className="text-xs text-slate-600">
                Sua principal fonte de segurança e consistência neste momento. Use-a como alicerce.
              </p>
            </div>

            {/* Ponto de Cuidado */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Ponto de Atenção</span>
              </div>
              <h5 className="text-lg font-bold text-slate-900">
                {report.criticalArea.name}
              </h5>
              <div className="text-2xl font-black text-rose-700 tabular-nums">
                {scores[report.criticalArea.id]}/10
              </div>
              <p className="text-xs text-slate-600">
                Área com maior drenagem ou atrito. Requer intervenção gradual e sem autocobrança excessiva.
              </p>
            </div>
          </div>

          {/* AI Insights Module */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Sparkles className="w-4 h-4" />
                <span>Análise de Inteligência Estratégica</span>
              </div>
              <button
                type="button"
                onClick={handleRequestAiInsights}
                disabled={loadingAi}
                className="text-xs font-medium text-teal-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                {loadingAi ? 'Gerando Análise...' : aiAnalysis ? 'Atualizar' : 'Gerar Parecer'}
              </button>
            </div>

            {aiAnalysis ? (
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                "{aiAnalysis}"
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Gere uma interpretação aprofundada baseada na sinergia exclusiva entre suas 12 notas.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Step-by-Step Action Plan */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Roteiro de Harmonização Gradual</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Seu Plano de Ação Estratégico em 3 Fases
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Metas práticas, realistas e calibradas para transformar seus pontos frágeis sem sobrecarregar sua rotina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.actionPlan.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-teal-800 shadow-2xs">
                    Fase: {item.timeframe}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Passo 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Foco: {item.areaName}
                  </h4>
                  <span className="text-[11px] text-slate-500">{item.pillarName}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.action}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                <strong>Impacto esperado:</strong> {item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refazer Diagnóstico</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Salvar em PDF / Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
          >
            <span>{copiedShare ? 'Resumo Copiado!' : 'Copiar Resumo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
