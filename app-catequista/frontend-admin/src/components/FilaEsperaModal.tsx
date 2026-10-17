import React, { useState, useEffect } from 'react';
import { FilaEsperaItem } from '../types';
import { api } from '../services/api';
import { X, Check, XCircle, Clock, UserCheck, RefreshCw } from 'lucide-react';

interface FilaEsperaModalProps {
  onClose: () => void;
  onUpdateCount: (count: number) => void;
}

export const FilaEsperaModal: React.FC<FilaEsperaModalProps> = ({ onClose, onUpdateCount }) => {
  const [items, setItems] = useState<FilaEsperaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFilaEspera().then(data => {
      setItems(data);
      onUpdateCount(data.filter(i => i.status === 'PENDENTE').length);
      setLoading(false);
    });
  }, [onUpdateCount]);

  const handleStatus = async (id: number, status: 'APROVADO' | 'RECUSADO') => {
    const updated = await api.atualizarStatusFila(id, status);
    setItems(updated);
    onUpdateCount(updated.filter(i => i.status === 'PENDENTE').length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-parish-400" />
              Fila de Espera de Sacramentos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Solicitações públicas de vagas enviadas por catequizandos e pais
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-parish-400" />
              Carregando solicitações...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhuma solicitação na fila de espera no momento.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-200">
                      {item.nomeCatequizando}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-parish-900/80 text-parish-300 border border-parish-700/50">
                      {item.sacramentoDesejado}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Matrícula #{item.matriculaCatequizando} • Solicitado em {item.dataSolicitacao}
                  </div>
                </div>

                {/* Status or actions */}
                {item.status === 'PENDENTE' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatus(item.id, 'APROVADO')}
                      title="Aprovar e liberar matrícula"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/50 rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatus(item.id, 'RECUSADO')}
                      title="Recusar solicitação"
                      className="p-1.5 text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
                      item.status === 'APROVADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
