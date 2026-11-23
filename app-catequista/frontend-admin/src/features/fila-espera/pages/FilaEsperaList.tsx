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
  UserCheck,
  Plus,
  X,
  Loader2,
  Save,
  Phone,
} from 'lucide-react';
import { filaEsperaService } from '../services/filaEsperaService';
import { catequizandoService } from '../../catequizandos/services/catequizandoService';
import { DadosDetalhamentoCatequizando } from '../../catequizandos/types/catequizando';
import { FilaEsperaItem, FilaStatus } from '../types/filaEspera';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';

const SACRAMENTO_LABELS: Record<string, string> = {
  PRIMEIRA_EUCARISTIA: '1ª Eucaristia',
  '1ª Eucaristia': '1ª Eucaristia',
  CRISMA: 'Crisma',
  Crisma: 'Crisma',
  BATISMO: 'Batismo',
  Batismo: 'Batismo',
  PERSEVERANCA: 'Perseverança',
  Perseverança: 'Perseverança',
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  PENDENTE: {
    label: 'Pendente',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  CHAMADO: {
    label: 'Chamado',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  EM_ANALISE: {
    label: 'Em Análise',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  MATRICULADO: {
    label: 'Matriculado',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  CONCLUIDA: {
    label: 'Concluída',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  CANCELADO: {
    label: 'Cancelado',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
  },
  CANCELADA: {
    label: 'Cancelada',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
  },
};

function formatarDataBR(isoDate?: string): string {
  if (!isoDate) return '—';
  const partes = isoDate.split('T')[0].split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return isoDate;
}

function isStatusEmAnalise(status: string): boolean {
  return status === 'CHAMADO' || status === 'EM_ANALISE';
}

function isStatusConcluido(status: string): boolean {
  return status === 'MATRICULADO' || status === 'CONCLUIDA';
}

function isStatusCancelado(status: string): boolean {
  return status === 'CANCELADO' || status === 'CANCELADA';
}

export const FilaEsperaList: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<FilaEsperaItem[]>([]);
  const [catequizandos, setCatequizandos] = useState<DadosDetalhamentoCatequizando[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroSacramento, setFiltroSacramento] = useState<string>('TODOS');

  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [isNovaModalOpen, setIsNovaModalOpen] = useState(false);
  const [novoAlunoMatricula, setNovoAlunoMatricula] = useState<number | ''>('');
  const [novoSacramento, setNovoSacramento] = useState<string>('1ª Eucaristia');
  const [isCadastrando, setIsCadastrando] = useState(false);

  const carregarFila = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [filaData, alunosData] = await Promise.all([
        filaEsperaService.listar(),
        catequizandoService.listar().catch(() => []),
      ]);

      setCatequizandos(alunosData);

      const enriquecidas: FilaEsperaItem[] = filaData.map((item) => {
        const aluno = alunosData.find((c) => c.matricula === item.matriculaCatequizando);
        return {
          ...item,
          nomeCatequizando: item.nomeCatequizando || aluno?.nome,
          cpfCatequizando: item.cpfCatequizando || aluno?.cpf,
          telefoneCatequizando: item.telefoneCatequizando || aluno?.telefone,
        };
      });

      setSolicitacoes(enriquecidas);
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
    setError(null);
    try {
      await filaEsperaService.atualizarStatus({ id, status: novoStatus });
      setSolicitacoes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: novoStatus } : item))
      );
    } catch (err) {
      setError(err);
    } finally {
      setProcessandoId(null);
    }
  };

  const handleExcluir = async (id: number, nome?: string) => {
    if (
      !window.confirm(
        `Tem certeza de que deseja remover a solicitação #${id}${
          nome ? ` de "${nome}"` : ''
        } da fila de espera?`
      )
    ) {
      return;
    }
    setProcessandoId(id);
    setError(null);
    try {
      await filaEsperaService.excluir(id);
      setSolicitacoes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setProcessandoId(null);
    }
  };

  const handleCadastrarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAlunoMatricula) return;
    setIsCadastrando(true);
    setError(null);
    try {
      await filaEsperaService.cadastrar({
        matriculaCatequizando: Number(novoAlunoMatricula),
        sacramentoDesejado: novoSacramento,
      });
      setIsNovaModalOpen(false);
      setNovoAlunoMatricula('');
      await carregarFila();
    } catch (err) {
      setError(err);
    } finally {
      setIsCadastrando(false);
    }
  };

  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoes.filter((item) => {
      const termoBusca = busca.trim().toLowerCase();
      const sacramentoFormatado = (
        SACRAMENTO_LABELS[item.sacramentoDesejado] || item.sacramentoDesejado
      ).toLowerCase();
      const matriculaStr = item.matriculaCatequizando?.toString() || '';
      const nomeStr = (item.nomeCatequizando || '').toLowerCase();
      const cpfStr = item.cpfCatequizando || '';

      const correspondeBusca =
        !termoBusca ||
        sacramentoFormatado.includes(termoBusca) ||
        matriculaStr.includes(termoBusca) ||
        nomeStr.includes(termoBusca) ||
        cpfStr.includes(termoBusca);

      let correspondeStatus = true;
      if (filtroStatus === 'PENDENTE') correspondeStatus = item.status === 'PENDENTE';
      else if (filtroStatus === 'EM_ANALISE') correspondeStatus = isStatusEmAnalise(item.status);
      else if (filtroStatus === 'CONCLUIDA') correspondeStatus = isStatusConcluido(item.status);
      else if (filtroStatus === 'CANCELADA') correspondeStatus = isStatusCancelado(item.status);

      const correspondeSacramento =
        filtroSacramento === 'TODOS' || item.sacramentoDesejado === filtroSacramento;

      return correspondeBusca && correspondeStatus && correspondeSacramento;
    });
  }, [solicitacoes, busca, filtroStatus, filtroSacramento]);

  const metricas = useMemo(() => {
    const total = solicitacoes.length;
    const pendentes = solicitacoes.filter((s) => s.status === 'PENDENTE').length;
    const emAnalise = solicitacoes.filter((s) => isStatusEmAnalise(s.status)).length;
    const concluidas = solicitacoes.filter((s) => isStatusConcluido(s.status)).length;
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-gold-600 shrink-0" />
            <span>Fila de Espera</span>
          </h1>
          <p className="text-sm text-carmel-600 mt-1">
            Triagem de pedidos de inscrição para Batismo, 1ª Eucaristia, Crisma e Perseverança.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={carregarFila}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white hover:bg-carmel-100 text-carmel-800 text-xs font-semibold transition-colors border border-carmel-200 shadow-card disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gold-700' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={() => setIsNovaModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Solicitação</span>
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 tabular-nums">
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-carmel-600 text-[11px] font-semibold uppercase tracking-wider">
            <span>Total na Fila</span>
            <Layers className="w-4 h-4 text-carmel-400" />
          </div>
          <div className="mt-1.5 font-sans text-2xl font-bold text-carmel-950">
            {metricas.total}
          </div>
        </div>

        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-amber-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Pendentes</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="mt-1.5 font-sans text-2xl font-bold text-amber-700">
            {metricas.pendentes}
          </div>
        </div>

        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-sky-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Chamados / Análise</span>
            <AlertCircle className="w-4 h-4 text-sky-700" />
          </div>
          <div className="mt-1.5 font-sans text-2xl font-bold text-sky-700">
            {metricas.emAnalise}
          </div>
        </div>

        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Matriculados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-1.5 font-sans text-2xl font-bold text-emerald-700">
            {metricas.concluidas}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-carmel-200 p-3.5 rounded-xl shadow-card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-carmel-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome do catequizando, CPF, matrícula ou sacramento..."
            className="w-full pl-10 pr-4 py-2 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-carmel-500" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="bg-carmel-50/70 border border-carmel-200 rounded-lg px-3 py-2 text-xs font-semibold text-carmel-800 focus:bg-white focus:border-gold-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="EM_ANALISE">Chamados / Em Análise</option>
              <option value="CONCLUIDA">Matriculados / Concluídos</option>
              <option value="CANCELADA">Cancelados</option>
            </select>
          </div>

          <select
            value={filtroSacramento}
            onChange={(e) => setFiltroSacramento(e.target.value)}
            className="bg-carmel-50/70 border border-carmel-200 rounded-lg px-3 py-2 text-xs font-semibold text-carmel-800 focus:bg-white focus:border-gold-500"
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

      {error && <ApiErrorAlert error={error} onRetry={carregarFila} />}

      {isLoading && solicitacoes.length === 0 && (
        <div className="bg-white border border-carmel-200 rounded-2xl p-6 space-y-3 shadow-card animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-12 bg-carmel-100 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && !error && solicitacoesFiltradas.length === 0 && (
        <div className="bg-white border border-carmel-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-card">
          <Inbox className="w-12 h-12 text-carmel-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-carmel-950">Nenhuma solicitação encontrada</h3>
          <p className="text-sm text-carmel-600 mt-1">
            {busca || filtroStatus !== 'TODOS' || filtroSacramento !== 'TODOS'
              ? 'Tente ajustar os filtros ou o termo pesquisado.'
              : 'Não há registros pendentes na fila de espera no momento.'}
          </p>
        </div>
      )}

      {!isLoading && solicitacoesFiltradas.length > 0 && (
        <div className="bg-white border border-carmel-200 rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-carmel-700">
              <thead className="bg-carmel-50 border-b border-carmel-200 text-[11px] font-semibold uppercase tracking-wider text-carmel-600">
                <tr>
                  <th className="px-5 py-3.5">Protocolo</th>
                  <th className="px-5 py-3.5">Catequizando</th>
                  <th className="px-5 py-3.5">Sacramento</th>
                  <th className="px-5 py-3.5">Data</th>
                  <th className="px-5 py-3.5">Situação</th>
                  <th className="px-5 py-3.5 text-right">Ações de Triagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carmel-100">
                {solicitacoesFiltradas.map((item) => {
                  const statusConf = STATUS_CONFIG[item.status] || {
                    label: item.status,
                    badgeClass: 'bg-carmel-100 text-carmel-800 border-carmel-200',
                  };
                  const isProcessing = processandoId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-carmel-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-carmel-600 tabular-nums">
                        #{item.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-carmel-100 border border-carmel-200 flex items-center justify-center text-carmel-800 font-bold text-xs shrink-0">
                            {item.nomeCatequizando ? item.nomeCatequizando.charAt(0) : '#'}
                          </div>
                          <div>
                            <div className="font-semibold text-carmel-950 text-sm">
                              {item.nomeCatequizando ||
                                `Catequizando #${item.matriculaCatequizando}`}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-carmel-500 mt-0.5 tabular-nums">
                              <span className="font-mono">
                                {item.cpfCatequizando
                                  ? `CPF: ${item.cpfCatequizando}`
                                  : `Matrícula #${item.matriculaCatequizando}`}
                              </span>
                              {item.telefoneCatequizando && (
                                <span className="inline-flex items-center gap-1">
                                  • <Phone className="w-3 h-3 text-gold-700" />{' '}
                                  {item.telefoneCatequizando}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-200">
                          {SACRAMENTO_LABELS[item.sacramentoDesejado] || item.sacramentoDesejado}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-carmel-700 font-mono text-xs tabular-nums">
                        {formatarDataBR(item.dataSolicitacao)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusConf.badgeClass}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'PENDENTE' && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'CHAMADO')}
                              disabled={isProcessing}
                              title="Chamar catequizando para matrícula"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <ArrowRightCircle className="w-3.5 h-3.5" />
                              <span>Chamar</span>
                            </button>
                          )}

                          {(item.status === 'PENDENTE' || isStatusEmAnalise(item.status)) && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'MATRICULADO')}
                              disabled={isProcessing}
                              title="Confirmar Matrícula Concluída"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Matricular</span>
                            </button>
                          )}

                          {!isStatusCancelado(item.status) && !isStatusConcluido(item.status) && (
                            <button
                              onClick={() => handleAlterarStatus(item.id, 'CANCELADO')}
                              disabled={isProcessing}
                              title="Cancelar Solicitação"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-carmel-600 hover:text-red-800 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}

                          <button
                            onClick={() => handleExcluir(item.id, item.nomeCatequizando)}
                            disabled={isProcessing}
                            title="Remover registro permanentemente"
                            className="p-1.5 rounded-lg text-carmel-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
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

      {/* Modal Nova Solicitação */}
      {isNovaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carmel-950/60 backdrop-blur-[2px] animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-carmel-200 rounded-2xl p-6 sm:p-7 shadow-modal space-y-5">
            <div className="flex items-center justify-between border-b border-carmel-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-carmel-100 text-carmel-800 border border-carmel-200 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl text-carmel-950 font-heading">
                    Incluir na Fila de Espera
                  </h2>
                  <p className="text-xs text-carmel-600">
                    Registre uma solicitação de vaga para o próximo ciclo sacramental
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNovaModalOpen(false)}
                className="p-2 text-carmel-500 hover:text-carmel-950 rounded-lg hover:bg-carmel-100 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarSolicitacao} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-carmel-800 mb-1.5">
                  Catequizando *
                </label>
                <select
                  value={novoAlunoMatricula}
                  onChange={(e) =>
                    setNovoAlunoMatricula(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                  required
                >
                  <option value="">Selecione o catequizando...</option>
                  {catequizandos.map((c) => (
                    <option key={c.matricula} value={c.matricula}>
                      {c.nome} (CPF: {c.cpf} • Matrícula #{c.matricula})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-carmel-800 mb-1.5">
                  Sacramento Desejado *
                </label>
                <select
                  value={novoSacramento}
                  onChange={(e) => setNovoSacramento(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                  required
                >
                  <option value="Batismo">Batismo</option>
                  <option value="1ª Eucaristia">1ª Eucaristia</option>
                  <option value="Crisma">Crisma</option>
                  <option value="Perseverança">Perseverança</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-carmel-200">
                <button
                  type="button"
                  onClick={() => setIsNovaModalOpen(false)}
                  disabled={isCadastrando}
                  className="px-4 py-2 text-xs font-semibold text-carmel-700 hover:text-carmel-950 rounded-lg hover:bg-carmel-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCadastrando}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {isCadastrando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Registrar na Fila</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
