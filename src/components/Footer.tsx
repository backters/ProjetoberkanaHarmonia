import React from 'react';
import { Compass, Heart, Github } from 'lucide-react';

interface FooterProps {
  onStartAssessment: () => void;
  onOpenLeads: () => void;
  onOpenPillars: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onStartAssessment,
  onOpenLeads,
  onOpenPillars,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Life Wheel Harmony Guide
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Metodologia de autoconhecimento e harmonia integral para diagnóstico das 12 áreas fundamentais da vida, com identificação de alavanca de impacto e envio de plano de ação personalizado.
            </p>
            <div className="pt-2 flex items-center gap-2 text-slate-400">
              <span>Projeto Berkana Harmonia</span>
              <span>·</span>
              <a
                href="https://github.com/backters/ProjetoberkanaHarmonia"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-700 flex items-center gap-1 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 block">Navegação</span>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="hover:text-slate-900 transition-colors"
                >
                  Fazer Diagnóstico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPillars}
                  className="hover:text-slate-900 transition-colors"
                >
                  Os 4 Pilares
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLeads}
                  className="hover:text-slate-900 transition-colors"
                >
                  Histórico de Leads
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 block">Privacidade & LGPD</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Todos os dados coletados são estritamente opcionais e utilizados exclusivamente para gerar o dossiê da sua Roda da Vida e envio por e-mail quando solicitado.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Berkana Harmonia. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com foco em autoliderança e harmonia consciente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
