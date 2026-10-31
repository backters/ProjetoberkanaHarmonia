import React, { useState } from 'react';
import { CheckCircle2, Mail, X, Copy, ExternalLink, Send } from 'lucide-react';
import { EmailDispatchResult } from '../types/wheel';

interface EmailDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EmailDispatchResult | null;
  onResendTo: (email: string) => Promise<void>;
  isSending: boolean;
}

export const EmailDeliveryModal: React.FC<EmailDeliveryModalProps> = ({
  isOpen,
  onClose,
  result,
  onResendTo,
  isSending,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyHtml = () => {
    if (result.emailPreviewHtml) {
      navigator.clipboard.writeText(result.emailPreviewHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    await onResendTo(newEmail.trim());
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-teal-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-700/80 flex items-center justify-center border border-teal-500/50">
              <CheckCircle2 className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dossiê da Roda da Vida Enviado!
              </h3>
              <p className="text-xs text-teal-200">
                Destinatário: <strong>{result.recipient || 'Seu e-mail'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & HTML Preview */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/80 flex items-start gap-3">
            <Mail className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-900 leading-relaxed">
              <p className="font-semibold">{result.message}</p>
              <p className="text-teal-700 mt-1">
                Uma cópia completa com todos os 12 escores, análise de equilíbrio e plano de ação de 30 dias foi despachada para a sua caixa de entrada.
              </p>
            </div>
          </div>

          {/* HTML Email Visual Preview Frame */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">
                Pré-visualização do Relatório Formatado:
              </span>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="text-xs font-medium text-slate-500 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Código Copiado!' : 'Copiar HTML do Dossiê'}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <iframe
                title="Prévia do E-mail"
                srcDoc={result.emailPreviewHtml}
                className="w-full h-72 border-none bg-white"
              />
            </div>
          </div>

          {/* Forward to another email */}
          <form onSubmit={handleResend} className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Deseja enviar uma cópia adicional para outro e-mail?
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="outroemail@exemplo.com"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-900"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Enviando...' : 'Reenviar'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
          >
            Fechar e Ver Meu Relatório na Tela
          </button>
        </div>
      </div>
    </div>
  );
};
