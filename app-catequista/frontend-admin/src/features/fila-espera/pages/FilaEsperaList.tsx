import React, { useEffect, useState, useMemo } from 'react';
import {
  Clock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Layers,
  ArrowRightCircle,
  Inbox,
  UserCheck
} from 'lucide-react';
import { filaEsperaService } from '../services/filaEsperaService';
import { FilaEsperaItem, FilaStatus } from '../types/filaEspera';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';

const SACRAMENTO_LABELS: Record<string, string> = {
  PRIMEIRA_EUCARISTIA: 'Primeira Eucaristia',
  CRISMA: 'Crisma',
  BATISMO: 'Batismo',
  PERSEVERANCA: 'Perseverança',
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; borderClass: string }
> = {
  PENDENTE: {
    label: 'Pendente',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    borderClass: 'border-l-amber-500',
  },
  EM_ANALISE: {
    label: 'Em Análise',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    borderClass: 'border-l-sky-500',
  },
  CONCLUIDA: {
    label: 'Concluída',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    borderClass: 'border-l-emerald-500',
  },
  CANCELADA: {
    label: 'Cancelada',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    borderClass: 'border-l-rose-500',
  },
};

export const FilaEsperaList: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<FilaEsperaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroSacramento, setFiltroSacramento] = useState<string>('TODOS');

  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const carregarFila = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await filaEsperaService.listar();
      setSolicitacoes(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarFila();
  }, []);

  const handleAlterarStatus = async (id: number, novoStatus: FilaStatus) => {
    setProcessandoId(id);
    try {
      await filaEsperaService.atualizarStatus({ id, status: novoStatus });
      setSolicitacoes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: novoStatus } : item))
      );
    } catch (err) {
      alert('Não foi possível atualizar o status da solicitação.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja remover esta solicitação da fila?')) {
      return;
    }
    setProcessandoId(id);
    try {
      await filaEsperaService.excluir(id);
      setSolicitacoes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Erro ao excluir solicitação da fila.');
    } finally {
      setProcessandoId(null);
    }
  };

  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoes.filter((item) => {
      const termoBusca = busca.trim().toLowerCase();
      const sacramentoFormatado = (SACRAMENTO_LABELS[item.sacramentoDesejado] || item.sacramentoDesejado).toLowerCase();
      const matriculaStr = item.matriculaCatequizando?.toString() || '';

      const correspondeBusca =
        !termoBusca ||
        sacramentoFormatado.includes(termoBusca) ||
        matriculaStr.includes(termoBusca);

      const correspondeStatus =
        filtroStatus === 'TODOS' || item.status === filtroStatus;

      const correspondeSacramento =
        filtroSacramento === 'TODOS' || item.sacramentoDesejado === filtroSacramento;

      return correspondeBusca && correspondeStatus && correspondeSacramento;
    });
  }, [solicitacoes, busca, filtroStatus, filtroSacramento]);

  const metricas = useMemo(() => {
    const total = solicitacoes.length;
    const pendentes = solicitacoes.filter((s) => s.status === 'PENDENTE').length;
    const emAnalise = solicitacoes.filter((s) => s.status === 'EM_ANALISE').length;
    const concluidas = solicitacoes.filter((s) => s.status === 'CONCLUIDA').length;
    return { total, pendentes, emAnalise, concluidas };
  }, [solicitacoes]);

  const sacramentosUnicos = useMemo(() => {
    const set = new Set<string>();
    solicitacoes.forEach((s) => {
      if (s.sacramentoDesejado) set.add(s.sacramentoDesejado);
    });
    return Array.from(set);
  }, [solicitacoes]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Fila de Espera</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de pedidos de inscrição e triagem de catequizandos para novos ciclos sacramentais.
          </p>
        </div>

        <button
          onClick={carregarFila}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total na Fila</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{metricas.total}</div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pendentes</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-200">{metricas.pendentes}</div>
        </div>

        <div className="bg-slate-900 border border-sky-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span>Em Análise</span>
            <AlertCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-200">{metricas.emAnalise}</div>
        </div>

        <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span>Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-200">{metricas.concluidas}</div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por matrícula ou sacramento..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="CONCLUIDA">Concluídas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>

          <select
            value={filtroSacramento}
            onChange={(e) => setFiltroSacramento(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="TODOS">Todos os Sacramentos</option>
            {sacramentosUnicos.map((sac) => (
              <option key={sac} value={sac}>
                {SACRAMENTO_LABELS[sac] || sac}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && <ApiErrorAlert error={error} onRetry={carregarFila} />}

      {/* Loading state */}
      {isLoading && solicitacoes.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-medium">Carregando solicitações da fila...</p>
        </div>
      )}

      {/* Empty list state */}
      {!isLoading && !error && solicitacoesFiltradas.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhuma solicitação encontrada</h3>
          <p className="text-sm text-slate-400 mt-1">
            {busca || filtroStatus !== 'TODOS' || filtroSacramento !== 'TODOS'
              ? 'Tente ajustar os filtros ou o termo pesquisado.'
              : 'Não há registros pendentes na fila de espera no momento.'}
          </p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && solicitacoesFiltradas.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Catequizando (Matrícula)</th>
                  <th className="px-6 py-4">Sacramento Desejado</th>
                  <th className="px-6 py-4">Data da Solicitação</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações de Triagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {solicitacoesFiltradas.map((item) => {
                  const statusConf = STATUS_CONFIG[item.status] || {
                    label: item.status,
                    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
                    borderClass: 'border-l-slate-700',
                  };
                  const isProcessing = processandoId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors border-l-4 ${statusConf.borderClass}`}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-sky-400" />
                          <span>Matrícula: {item.matriculaCatequizando}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                          {SACRAMENTO_LABELS[item.sacramentoDesejado] || item.sacramentoDesejado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {item.dataSolicitacao
                          ? new Date(item.dataSolicitacao).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConf.badgeClass}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === 'PENDENTE' && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'EM_ANALISE')}
                              disabled={isProcessing}
                              title="Colocar em Análise"
                              className="px-2.5 py-1 rounded text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <ArrowRightCircle className="w-3.5 h-3.5" />
                              <span>Em Análise</span>
                            </button>
                          )}

                          {item.status === 'EM_ANALISE' && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'CONCLUIDA')}
                              disabled={isProcessing}
                              title="Marcar como Concluída"
                              className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluir</span>
                            </button>
                          )}

                          {item.status !== 'CANCELADA' && item.status !== 'CONCLUIDA' && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'CANCELADA')}
                              disabled={isProcessing}
                              title="Cancelar Solicitação"
                              className="px-2 py-1 rounded text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}

                          <button
                            onClick={() => handleExcluir(item.id)}
                            disabled={isProcessing}
                            title="Remover permanentemente"
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
