import React, { useState } from 'react';
import { Mail, User, Phone, CheckCircle, ShieldCheck, X, Send, Sparkles } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>;
  onSkip: () => void;
  isSending: boolean;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  isSending,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top visual banner with mentor portrait */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/coach_berkana_guide_1793159365639.jpg"
              alt="Mentora Berkana Harmonia"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-teal-200 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnóstico Concluído</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                Receba seu Dossiê Completo
              </h3>
              <p className="text-xs text-teal-100/90 mt-0.5">
                Todos os campos são 100% opcionais.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Informe onde deseja receber o PDF com o mapa da sua roda, o Índice de Harmonia e o plano de ação estratégico de 30 dias:
          </p>

          {/* Nome (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seu Nome <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Clara"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* E-mail (Opcional, mas envia resultado se preenchido) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seu E-mail <span className="text-slate-400 font-normal">(Opcional · Enviaremos o resultado)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seuemail@exemplo.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ao preencher, o relatório de harmonia é enviado imediatamente para sua caixa de entrada.
            </p>
          </div>

          {/* WhatsApp / Telefone (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp com DDD <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* LGPD / Privacy notice */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="lead-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <label htmlFor="lead-consent" className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Respeitamos sua privacidade. Seus dados nunca serão compartilhados com terceiros.</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              disabled={isSending}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isSending ? (
                <span>Processando envio do relatório...</span>
              ) : email.trim() ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Diagnóstico por E-mail & Ver Resultado</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Visualizar Diagnóstico na Tela</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Pular captura e abrir relatório imediatamente →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
