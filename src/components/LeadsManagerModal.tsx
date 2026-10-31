import React, { useState } from 'react';
import { LeadData } from '../types/wheel';
import { X, Download, Trash2, Search, UserCheck, Mail, Phone, Calendar } from 'lucide-react';

interface LeadsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadData[];
  onClearLeads: () => void;
}

export const LeadsManagerModal: React.FC<LeadsManagerModalProps> = ({
  isOpen,
  onClose,
  leads,
  onClearLeads,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const q = searchTerm.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.leverageAreaName && lead.leverageAreaName.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      'Data',
      'Nome',
      'Email',
      'Telefone',
      'Indice_Harmonia',
      'Media_Geral',
      'Area_Alavanca',
    ];

    const rows = leads.map((l) => [
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`,
      `"${(l.name || 'Anônimo').replace(/"/g, '""')}"`,
      `"${(l.email || 'Não informado').replace(/"/g, '""')}"`,
      `"${(l.phone || 'Não informado').replace(/"/g, '""')}"`,
      `"${l.harmonyIndex}%"`,
      `"${l.overallAverage}"`,
      `"${(l.leverageAreaName || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_berkana_harmonia_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const avgHarmony = leads.length
    ? Math.round(leads.reduce((sum, l) => sum + (l.harmonyIndex || 0), 0) / leads.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600/80 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Painel de Leads & Diagnósticos Salvos
              </h3>
              <p className="text-xs text-slate-400">
                Gestão dos contatos e resultados capturados na Roda da Vida
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

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total de Diagnósticos</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{leads.length}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Índice Médio de Harmonia</span>
            <div className="text-2xl font-bold text-teal-700 tabular-nums">{avgHarmony}%</div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Leads com E-mail</span>
            <div className="text-2xl font-bold text-blue-700 tabular-nums">
              {leads.filter((l) => l.email).length}
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              onClick={onClearLeads}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-y-auto flex-1 p-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Nenhum diagnóstico registrado ainda.</p>
              <p className="text-xs">Assim que um usuário concluir uma autoavaliação, os dados aparecerão aqui.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Nome / Contato</th>
                    <th className="py-2.5 px-3">E-mail</th>
                    <th className="py-2.5 px-3 text-center">Harmonia</th>
                    <th className="py-2.5 px-3">Área Alavanca</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead, idx) => (
                    <tr key={lead.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 tabular-nums">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {lead.name || 'Anônimo'}
                        {lead.phone && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {lead.email ? (
                          <span className="text-teal-700 font-medium">{lead.email}</span>
                        ) : (
                          <span className="text-slate-400 italic">Não informado</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 tabular-nums">
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {lead.harmonyIndex}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium">
                        {lead.leverageAreaName || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
