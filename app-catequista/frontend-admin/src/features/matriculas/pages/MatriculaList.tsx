import React, { useEffect, useState, useMemo } from 'react';
import { matriculaService } from '../services/matriculaService';
import { catequizandoService } from '../../catequizandos/services/catequizandoService';
import { turmaService } from '../../turmas/services/turmaService';
import { MatriculaComDetalhes } from '../types/matricula';
import { DadosDetalhamentoCatequizando } from '../../catequizandos/types/catequizando';
import { DadosDetalhamentoTurma } from '../../turmas/types/turma';
import { NovaMatriculaModal } from '../components/NovaMatriculaModal';
import { EditarMatriculaModal } from '../components/EditarMatriculaModal';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Loader2, 
  GraduationCap, 
  UserCheck, 
  CheckCircle2, 
  ArrowRightLeft, 
  Edit2
} from 'lucide-react';

export const MatriculaList: React.FC = () => {
  const [matriculas, setMatriculas] = useState<MatriculaComDetalhes[]>([]);
  const [catequizandos, setCatequizandos] = useState<DadosDetalhamentoCatequizando[]>([]);
  const [turmas, setTurmas] = useState<DadosDetalhamentoTurma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');
  const [turmaFiltro, setTurmaFiltro] = useState<string>('TODAS');
  const [isNovaModalOpen, setIsNovaModalOpen] = useState(false);
  const [matriculaEmEdicao, setMatriculaEmEdicao] = useState<MatriculaComDetalhes | null>(null);
  const [erro, setErro] = useState<any>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const carregarDados = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const [matriculasData, catequizandosData, turmasData] = await Promise.all([
        matriculaService.listar(),
        catequizandoService.listar().catch(() => []),
        turmaService.listar().catch(() => []),
      ]);

      setCatequizandos(catequizandosData);
      setTurmas(turmasData);

      // Cruzamento de dados para enriquecer a listagem
      const enriquecidas: MatriculaComDetalhes[] = matriculasData.map((m) => {
        const aluno = catequizandosData.find((c) => c.matricula === m.matriculaCatequizando);
        const turma = turmasData.find((t) => t.id === m.idTurma);
        return {
          ...m,
          nomeCatequizando: aluno?.nome,
          cpfCatequizando: aluno?.cpf,
          nomeTurma: turma?.nomeTurma,
          anoLetivoTurma: turma?.anoLetivo,
        };
      });

      setMatriculas(enriquecidas);
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluir = async (id: number, nomeAluno?: string) => {
    const confirmou = window.confirm(
      `Deseja realmente cancelar/excluir a matrícula #${id}${nomeAluno ? ` de "${nomeAluno}"` : ''}? Esta ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setExcluindoId(id);
    setErro(null);
    try {
      await matriculaService.excluir(id);
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setErro(err);
    } finally {
      setExcluindoId(null);
    }
  };

  // Contadores analíticos
  const totalMatriculas = matriculas.length;
  const ativasCount = matriculas.filter((m) => m.statusMatricula === 'ATIVA').length;
  const trancadasCount = matriculas.filter((m) => m.statusMatricula === 'TRANCADA').length;
  const concluidasCount = matriculas.filter((m) => m.statusMatricula === 'CONCLUIDA').length;

  const matriculasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return matriculas.filter((m) => {
      const matchesBusca =
        !termo ||
        m.id.toString().includes(termo) ||
        m.matriculaCatequizando.toString().includes(termo) ||
        (m.nomeCatequizando && m.nomeCatequizando.toLowerCase().includes(termo)) ||
        (m.cpfCatequizando && m.cpfCatequizando.includes(termo)) ||
        (m.nomeTurma && m.nomeTurma.toLowerCase().includes(termo));

      const matchesStatus =
        statusFiltro === 'TODOS' || m.statusMatricula === statusFiltro;

      const matchesTurma =
        turmaFiltro === 'TODAS' || m.idTurma.toString() === turmaFiltro;

      return matchesBusca && matchesStatus && matchesTurma;
    });
  }, [matriculas, busca, statusFiltro, turmaFiltro]);

  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ATIVA
          </span>
        );
      case 'TRANCADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            TRANCADA
          </span>
        );
      case 'TRANSFERIDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <ArrowRightLeft className="w-3 h-3 text-purple-400" />
            TRANSFERIDA
          </span>
        );
      case 'CONCLUIDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            CONCLUÍDA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-parish-400" />
            <span>Matrículas Pastorais</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vínculo de catequizandos às turmas, transferências e controle das situações cadastrais
          </p>
        </div>

        <button
          onClick={() => setIsNovaModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nova Matrícula</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarDados} />}

      {/* 2. Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total de Matrículas</div>
          <div className="font-heading font-extrabold text-xl text-white mt-1">{totalMatriculas}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Ativas</div>
          <div className="font-heading font-extrabold text-xl text-emerald-400 mt-1">{ativasCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Trancadas</div>
          <div className="font-heading font-extrabold text-xl text-amber-400 mt-1">{trancadasCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Concluídas</div>
          <div className="font-heading font-extrabold text-xl text-blue-400 mt-1">{concluidasCount}</div>
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
            placeholder="Buscar por nome do aluno, CPF ou turma..."
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
            {(['TODOS', 'ATIVA', 'TRANCADA', 'CONCLUIDA', 'TRANSFERIDA'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFiltro === st
                    ? 'bg-parish-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Tabela de Matrículas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-parish-500" />
            <span className="text-xs font-medium">Carregando matrículas pastorais...</span>
          </div>
        ) : matriculasFiltradas.length === 0 ? (
          <div className="py-20 text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Nenhuma matrícula encontrada</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {busca || statusFiltro !== 'TODOS' || turmaFiltro !== 'TODAS'
                ? 'Nenhuma matrícula corresponde aos filtros aplicados.'
                : 'Ainda não há matrículas registradas. Clique em "Nova Matrícula" para vincular um catequizando a uma turma.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Matrícula</th>
                  <th className="px-5 py-3.5">Catequizando</th>
                  <th className="px-5 py-3.5">Turma Pastoral</th>
                  <th className="px-5 py-3.5">Situação</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {matriculasFiltradas.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-400">
                      #{mat.id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-white text-sm">
                        {mat.nomeCatequizando || `Catequizando #${mat.matriculaCatequizando}`}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {mat.cpfCatequizando ? `CPF: ${mat.cpfCatequizando}` : `Reg #${mat.matriculaCatequizando}`}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">
                        {mat.nomeTurma || `Turma #${mat.idTurma}`}
                      </div>
                      {mat.anoLetivoTurma && (
                        <div className="text-[11px] text-parish-400 mt-0.5 font-medium">
                          Ciclo {mat.anoLetivoTurma}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {renderBadgeStatus(mat.statusMatricula)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setMatriculaEmEdicao(mat)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                          title="Alterar status ou transferir de turma"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-parish-400" />
                          <span>Gerenciar</span>
                        </button>

                        <button
                          onClick={() => handleExcluir(mat.id, mat.nomeCatequizando)}
                          disabled={excluindoId === mat.id}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                          title="Excluir matrícula"
                        >
                          {excluindoId === mat.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Modais */}
      <NovaMatriculaModal
        isOpen={isNovaModalOpen}
        onClose={() => setIsNovaModalOpen(false)}
        onSuccess={carregarDados}
        catequizandos={catequizandos}
        turmas={turmas}
      />

      <EditarMatriculaModal
        isOpen={!!matriculaEmEdicao}
        onClose={() => setMatriculaEmEdicao(null)}
        onSuccess={carregarDados}
        matricula={matriculaEmEdicao}
        turmas={turmas}
      />
    </div>
  );
};
