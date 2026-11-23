import React, { useEffect, useState, useMemo } from 'react';
import { aulaService } from '../services/aulaService';
import { turmaService } from '../../turmas/services/turmaService';
import { AulaComDetalhes, DadosDetalhamentoAula } from '../types/aula';
import { DadosDetalhamentoTurma } from '../../turmas/types/turma';
import { NovaAulaModal } from '../components/NovaAulaModal';
import { ProjetarPinModal } from '../components/ProjetarPinModal';
import { EditarAulaModal } from '../components/EditarAulaModal';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import {
  Sparkles,
  Search,
  Calendar,
  Trash2,
  Loader2,
  Radio,
  Copy,
  Check,
  Maximize2,
  BookOpen,
  Edit2,
  Plus,
  GraduationCap,
} from 'lucide-react';

function formatarDataBR(isoDate?: string): string {
  if (!isoDate) return '—';
  const partes = isoDate.split('T')[0].split('-');
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return isoDate;
}

export const AulaList: React.FC = () => {
  const [aulas, setAulas] = useState<AulaComDetalhes[]>([]);
  const [turmas, setTurmas] = useState<DadosDetalhamentoTurma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [turmaFiltro, setTurmaFiltro] = useState<string>('TODAS');
  const [statusFiltro, setStatusFiltro] = useState<'TODOS' | 'AO_VIVO' | 'ENCERRADAS'>('TODOS');

  const [isNovaModalOpen, setIsNovaModalOpen] = useState(false);
  const [aulaProjetando, setAulaProjetando] = useState<AulaComDetalhes | null>(null);
  const [aulaEmEdicao, setAulaEmEdicao] = useState<AulaComDetalhes | null>(null);
  const [copiedPinId, setCopiedPinId] = useState<number | null>(null);
  const [erro, setErro] = useState<any>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const carregarDados = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const [aulasData, turmasData] = await Promise.all([
        aulaService.listar(),
        turmaService.listar().catch(() => []),
      ]);

      setTurmas(turmasData);

      const agora = Date.now();
      const enriquecidas: AulaComDetalhes[] = aulasData.map((aula) => {
        const turma = turmasData.find((t) => t.id === aula.idTurma);
        const expira = aula.horarioExpiracao ? new Date(aula.horarioExpiracao).getTime() : 0;
        const isAtiva = expira > agora;

        return {
          ...aula,
          nomeTurma: turma?.nomeTurma,
          anoLetivoTurma: turma?.anoLetivo,
          isAtiva,
        };
      });

      enriquecidas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      setAulas(enriquecidas);
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCopyPin = (pin: string, id: number) => {
    navigator.clipboard.writeText(pin);
    setCopiedPinId(id);
    setTimeout(() => setCopiedPinId(null), 2000);
  };

  const handleExcluir = async (id: number, pin: string) => {
    const confirmou = window.confirm(
      `Deseja realmente excluir a aula com PIN "${pin}" (#${id})? Esta ação removerá o registro do banco de dados.`
    );
    if (!confirmou) return;

    setExcluindoId(id);
    setErro(null);
    try {
      await aulaService.excluir(id);
      setAulas((prev) => prev.filter((a) => a.id !== id));
      if (aulaProjetando?.id === id) setAulaProjetando(null);
      if (aulaEmEdicao?.id === id) setAulaEmEdicao(null);
    } catch (err: any) {
      setErro(err);
    } finally {
      setExcluindoId(null);
    }
  };

  const handleNovaAulaCriada = (nova: DadosDetalhamentoAula) => {
    const turma = turmas.find((t) => t.id === nova.idTurma);
    const detalhada: AulaComDetalhes = {
      ...nova,
      nomeTurma: turma?.nomeTurma,
      anoLetivoTurma: turma?.anoLetivo,
      isAtiva: true,
    };
    setAulas((prev) => [detalhada, ...prev]);
    setAulaProjetando(detalhada);
  };

  const totalAulas = aulas.length;
  const aoVivoCount = aulas.filter((a) => a.isAtiva).length;
  const encerradasCount = totalAulas - aoVivoCount;

  const aulasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return aulas.filter((aula) => {
      const matchesBusca =
        !termo ||
        aula.pin.toLowerCase().includes(termo) ||
        aula.data.includes(termo) ||
        formatarDataBR(aula.data).includes(termo) ||
        (aula.descricaoConteudo && aula.descricaoConteudo.toLowerCase().includes(termo)) ||
        (aula.nomeTurma && aula.nomeTurma.toLowerCase().includes(termo));

      const matchesTurma = turmaFiltro === 'TODAS' || aula.idTurma.toString() === turmaFiltro;

      const matchesStatus =
        statusFiltro === 'TODOS' ||
        (statusFiltro === 'AO_VIVO' && aula.isAtiva) ||
        (statusFiltro === 'ENCERRADAS' && !aula.isAtiva);

      return matchesBusca && matchesTurma && matchesStatus;
    });
  }, [aulas, busca, turmaFiltro, statusFiltro]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-gold-600 shrink-0" />
            <span>Aulas & PIN de Chamada</span>
          </h1>
          <p className="text-sm text-carmel-600 mt-1">
            Sessões de presença em tempo real, projeção de PIN na sala e histórico de encontros.
          </p>
        </div>

        <button
          onClick={() => setIsNovaModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Iniciar Encontro & PIN</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarDados} />}

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 tabular-nums">
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-carmel-600 uppercase tracking-wider">
              Total de Encontros
            </div>
            <div className="font-sans font-bold text-2xl text-carmel-950 mt-1">{totalAulas}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-carmel-50 border border-carmel-200 text-carmel-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Sessões Ao Vivo
            </div>
            <div className="font-sans font-bold text-2xl text-emerald-700 mt-1">{aoVivoCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-carmel-600 uppercase tracking-wider">
              Encontros Encerrados
            </div>
            <div className="font-sans font-bold text-2xl text-carmel-800 mt-1">
              {encerradasCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-carmel-50 border border-carmel-200 text-gold-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 bg-white border border-carmel-200 rounded-xl px-3.5 py-2.5 shadow-card flex items-center gap-2.5 focus-within:border-gold-500">
          <Search className="w-4 h-4 text-carmel-400 shrink-0" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por PIN, tema do encontro, data ou turma..."
            className="w-full bg-transparent border-none text-sm text-carmel-950 placeholder-carmel-400 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={turmaFiltro}
            onChange={(e) => setTurmaFiltro(e.target.value)}
            className="px-3 py-2 bg-white border border-carmel-200 rounded-xl text-xs font-semibold text-carmel-800 focus:border-gold-500 shadow-card"
          >
            <option value="TODAS">Todas as Turmas</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.nomeTurma}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-white border border-carmel-200 p-1 rounded-xl shadow-card">
            {(['TODOS', 'AO_VIVO', 'ENCERRADAS'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFiltro === st
                    ? 'bg-carmel-800 text-carmel-50'
                    : 'text-carmel-600 hover:text-carmel-950 hover:bg-carmel-50'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st === 'AO_VIVO' ? 'Ao Vivo' : 'Encerradas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Aulas & PIN */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border border-carmel-200 rounded-2xl p-5 shadow-card animate-pulse space-y-4"
            >
              <div className="h-5 bg-carmel-100 rounded w-1/2" />
              <div className="h-4 bg-carmel-100 rounded w-3/4" />
              <div className="h-16 bg-carmel-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : aulasFiltradas.length === 0 ? (
        <div className="py-16 text-center bg-white border border-carmel-200 rounded-2xl p-8 space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-carmel-100 text-gold-700 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-carmel-950">Nenhum encontro encontrado</h3>
          <p className="text-sm text-carmel-600 max-w-sm mx-auto">
            {busca || statusFiltro !== 'TODOS' || turmaFiltro !== 'TODAS'
              ? 'Nenhum encontro pastoral corresponde aos filtros aplicados.'
              : 'Ainda não há aulas registradas. Clique em "Iniciar Encontro & PIN" para abrir a primeira sessão.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aulasFiltradas.map((aula) => (
            <div
              key={aula.id}
              className={`bg-white border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between ${
                aula.isAtiva ? 'border-emerald-300 ring-1 ring-emerald-200/70' : 'border-carmel-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  {aula.isAtiva ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                      <span>AO VIVO • PIN ATIVO</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-carmel-100 text-carmel-700 border border-carmel-200">
                      ENCERRADA
                    </span>
                  )}

                  <span className="flex items-center gap-1.5 text-xs text-carmel-600 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-gold-700" />
                    <span>{formatarDataBR(aula.data)}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-base text-carmel-950 leading-snug">
                    {aula.nomeTurma || `Turma #${aula.idTurma}`}
                  </h3>
                  <p className="text-xs text-carmel-600 mt-1 line-clamp-2">
                    {aula.descricaoConteudo || 'Encontro pastoral de catequese'}
                  </p>
                </div>

                <div className="p-3.5 bg-carmel-50 border border-carmel-200 rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-carmel-600">
                      PIN da Chamada
                    </div>
                    <div className="font-mono font-bold text-2xl text-carmel-900 tracking-wider tabular-nums">
                      {aula.pin}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyPin(aula.pin, aula.id)}
                      className="p-2 text-carmel-700 hover:text-carmel-950 bg-white hover:bg-carmel-100 rounded-lg border border-carmel-200 transition-colors"
                      title="Copiar PIN"
                    >
                      {copiedPinId === aula.id ? (
                        <Check className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setAulaProjetando(aula)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-carmel-50 bg-carmel-800 hover:bg-carmel-700 rounded-lg transition-colors shadow-sm"
                      title="Projetar PIN em tela cheia na sala"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-gold-300" />
                      <span>Projetar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-carmel-100 flex items-center justify-between text-xs">
                <span className="text-carmel-500 font-mono text-[11px] tabular-nums">
                  Encontro #{aula.id}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAulaEmEdicao(aula)}
                    className="p-1.5 text-carmel-600 hover:text-carmel-950 hover:bg-carmel-100 rounded-lg transition-colors"
                    title="Editar informações do encontro"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleExcluir(aula.id, aula.pin)}
                    disabled={excluindoId === aula.id}
                    className="p-1.5 text-carmel-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Excluir aula"
                  >
                    {excluindoId === aula.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-700" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NovaAulaModal
        isOpen={isNovaModalOpen}
        onClose={() => setIsNovaModalOpen(false)}
        onSuccess={handleNovaAulaCriada}
        turmas={turmas}
      />

      <ProjetarPinModal
        isOpen={!!aulaProjetando}
        onClose={() => setAulaProjetando(null)}
        aula={aulaProjetando}
      />

      <EditarAulaModal
        isOpen={!!aulaEmEdicao}
        onClose={() => setAulaEmEdicao(null)}
        onSuccess={carregarDados}
        aula={aulaEmEdicao}
      />
    </div>
  );
};
