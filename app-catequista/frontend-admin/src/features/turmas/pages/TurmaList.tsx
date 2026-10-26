import React, { useEffect, useState, useMemo } from 'react';
import { turmaService } from '../services/turmaService';
import { DadosDetalhamentoTurma } from '../types/turma';
import { NovaTurmaModal } from '../components/NovaTurmaModal';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Loader2, 
  GraduationCap,
  Layers,
  Sparkles
} from 'lucide-react';

export const TurmaList: React.FC = () => {
  const [turmas, setTurmas] = useState<DadosDetalhamentoTurma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [anoFiltro, setAnoFiltro] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [erro, setErro] = useState<any>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const carregarTurmas = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const data = await turmaService.listar();
      setTurmas(data);
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleExcluir = async (id: number, nome: string) => {
    const confirmou = window.confirm(
      `Deseja realmente excluir a turma "${nome}"? Esta ação removerá a turma do banco de dados.`
    );
    if (!confirmou) return;

    setExcluindoId(id);
    setErro(null);
    try {
      await turmaService.excluir(id);
      setTurmas((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setErro(err);
    } finally {
      setExcluindoId(null);
    }
  };

  const anosDisponiveis = useMemo(() => {
    const anos = Array.from(new Set(turmas.map((t) => t.anoLetivo.toString())));
    return anos.sort((a, b) => Number(b) - Number(a));
  }, [turmas]);

  const turmasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return turmas.filter((t) => {
      const matchesBusca =
        !termo ||
        t.nomeTurma.toLowerCase().includes(termo) ||
        t.id.toString().includes(termo) ||
        t.anoLetivo.toString().includes(termo);

      const matchesAno = anoFiltro === 'TODOS' || t.anoLetivo.toString() === anoFiltro;

      return matchesBusca && matchesAno;
    });
  }, [turmas, busca, anoFiltro]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-parish-400" />
            <span>Turmas Pastorais</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão das turmas de catequese, encontros e sacramentos da paróquia
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Turma</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarTurmas} />}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome da turma ou ano letivo..."
            className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setAnoFiltro('TODOS')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              anoFiltro === 'TODOS'
                ? 'bg-parish-600 text-white border-parish-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            Todos os Anos
          </button>
          {anosDisponiveis.map((ano) => (
            <button
              key={ano}
              onClick={() => setAnoFiltro(ano)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                anoFiltro === ano
                  ? 'bg-parish-600 text-white border-parish-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              Ano {ano}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-7 h-7 animate-spin text-parish-500" />
            <span className="text-xs font-medium">Carregando turmas pastorais...</span>
          </div>
        ) : turmasFiltradas.length === 0 ? (
          <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Nenhuma turma encontrada</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {busca || anoFiltro !== 'TODOS'
                ? 'Nenhuma turma corresponde aos filtros aplicados.'
                : 'Ainda não há turmas cadastradas no banco de dados. Clique em "Nova Turma" para cadastrar a primeira.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {turmasFiltradas.map((turma) => (
              <div
                key={turma.id}
                className="group relative bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-parish-500/60 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-parish-900/60 text-parish-300 border border-parish-700/40">
                      Ano {turma.anoLetivo}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ID #{turma.id}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-parish-300 transition-colors">
                    {turma.nomeTurma}
                  </h3>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-parish-400" />
                      <span>Ciclo {turma.anoLetivo}</span>
                    </span>
                    <span>Catequista #{turma.idCatequista}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Turma Ativa</span>
                  </span>

                  <button
                    onClick={() => handleExcluir(turma.id, turma.nomeTurma)}
                    disabled={excluindoId === turma.id}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                    title="Excluir turma"
                  >
                    {excluindoId === turma.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NovaTurmaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={carregarTurmas}
      />
    </div>
  );
};
