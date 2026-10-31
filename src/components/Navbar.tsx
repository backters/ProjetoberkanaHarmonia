import React from 'react';
import { Compass } from 'lucide-react';

interface NavbarProps {
  onStartAssessment: () => void;
  onOpenLeads: () => void;
  onOpenPillars: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartAssessment,
  onOpenLeads,
  onOpenPillars,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-2xs">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-teal-700 transition-colors"
          >
            Berkana Harmonia
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Sobre a Roda
          </button>
          <button
            type="button"
            onClick={onStartAssessment}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Diagnóstico
          </button>
          <button
            type="button"
            onClick={onOpenPillars}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Os 4 Pilares
          </button>
          <button
            type="button"
            onClick={onOpenLeads}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-slate-500"
          >
            Histórico & Leads
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartAssessment}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs hover:shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            Iniciar Diagnóstico
          </button>
        </div>
      </div>
    </header>
  );
};
