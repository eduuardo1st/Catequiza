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
  GraduationCap
} from 'lucide-react';

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

      const agora = new Date().getTime();
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

      // Ordena por data decrescente
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
    // Abre automaticamente a projeção do PIN para a aula recém-iniciada!
    setAulaProjetando(detalhada);
  };

  // Contadores analíticos
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
        (aula.descricaoConteudo && aula.descricaoConteudo.toLowerCase().includes(termo)) ||
        (aula.nomeTurma && aula.nomeTurma.toLowerCase().includes(termo));

      const matchesTurma =
        turmaFiltro === 'TODAS' || aula.idTurma.toString() === turmaFiltro;

      const matchesStatus =
        statusFiltro === 'TODOS' ||
        (statusFiltro === 'AO_VIVO' && aula.isAtiva) ||
        (statusFiltro === 'ENCERRADAS' && !aula.isAtiva);

      return matchesBusca && matchesTurma && matchesStatus;
    });
  }, [aulas, busca, turmaFiltro, statusFiltro]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-parish-400" />
            <span>Aulas & PIN de Chamada</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sessões de presença em tempo real, geração de PIN dinâmico e registro histórico dos encontros
          </p>
        </div>

        <button
          onClick={() => setIsNovaModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Iniciar Encontro & PIN</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarDados} />}

      {/* 2. Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total de Encontros</div>
            <div className="font-heading font-extrabold text-xl text-white mt-1">{totalAulas}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sessões Ao Vivo (PIN Ativo)</div>
            <div className="font-heading font-extrabold text-xl text-emerald-400 mt-1">{aoVivoCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Encontros Concluídos</div>
            <div className="font-heading font-extrabold text-xl text-slate-300 mt-1">{encerradasCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por PIN, tema do encontro, data ou turma..."
            className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={turmaFiltro}
            onChange={(e) => setTurmaFiltro(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
          >
            <option value="TODAS">Todas as Turmas</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.nomeTurma}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {(['TODOS', 'AO_VIVO', 'ENCERRADAS'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFiltro === st
                    ? 'bg-parish-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st === 'AO_VIVO' ? 'Ao Vivo' : 'Encerradas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Lista de Aulas & PIN */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-7 h-7 animate-spin text-parish-500" />
          <span className="text-xs font-medium">Carregando sessões e histórico de aulas...</span>
        </div>
      ) : aulasFiltradas.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">Nenhum encontro encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {busca || statusFiltro !== 'TODOS' || turmaFiltro !== 'TODAS'
              ? 'Nenhum encontro pastoral corresponde aos filtros aplicados.'
              : 'Ainda não há aulas registradas. Clique em "Iniciar Encontro & PIN" para abrir a primeira sessão de chamada.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aulasFiltradas.map((aula) => (
            <div
              key={aula.id}
              className={`group relative bg-slate-900/90 border rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                aula.isAtiva
                  ? 'border-emerald-500/50 hover:border-emerald-500 shadow-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header do Card */}
                <div className="flex items-center justify-between gap-2">
                  {aula.isAtiva ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>AO VIVO • PIN ATIVO</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      ENCERRADA
                    </span>
                  )}

                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{aula.data}</span>
                  </span>
                </div>

                {/* Turma e Conteúdo */}
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-parish-300 transition-colors">
                    {aula.nomeTurma || `Turma #${aula.idTurma}`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {aula.descricaoConteudo || 'Encontro pastoral de catequese'}
                  </p>
                </div>

                {/* Box de PIN */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500">PIN da Chamada</div>
                    <div className="font-mono font-extrabold text-2xl text-parish-300 tracking-wider">
                      {aula.pin}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyPin(aula.pin, aula.id)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 transition-colors"
                      title="Copiar PIN"
                    >
                      {copiedPinId === aula.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setAulaProjetando(aula)}
                      className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-parish-300 hover:text-white bg-parish-950/80 hover:bg-parish-900 rounded-lg border border-parish-800/80 transition-colors"
                      title="Projetar PIN em tela cheia na sala"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Projetar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer do Card */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Encontro #{aula.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAulaEmEdicao(aula)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Editar informações do encontro"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleExcluir(aula.id, aula.pin)}
                    disabled={excluindoId === aula.id}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                    title="Excluir aula"
                  >
                    {excluindoId === aula.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
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

      {/* Modais */}
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
