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
  Edit2,
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

      const enriquecidas: MatriculaComDetalhes[] = matriculasData.map((m) => {
        const aluno = catequizandosData.find((c) => c.matricula === m.matriculaCatequizando);
        const turma = turmasData.find((t) => t.id === m.idTurma);
        return {
          ...m,
          nomeCatequizando: m.nomeCatequizando || aluno?.nome,
          cpfCatequizando: m.cpfCatequizando || aluno?.cpf,
          nomeTurma: m.nomeTurma || turma?.nomeTurma,
          anoLetivoTurma: m.anoLetivoTurma || turma?.anoLetivo,
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
      `Deseja realmente cancelar/excluir a matrícula #${id}${
        nomeAluno ? ` de "${nomeAluno}"` : ''
      }? Esta ação não pode ser desfeita.`
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

      const matchesStatus = statusFiltro === 'TODOS' || m.statusMatricula === statusFiltro;
      const matchesTurma = turmaFiltro === 'TODAS' || m.idTurma.toString() === turmaFiltro;

      return matchesBusca && matchesStatus && matchesTurma;
    });
  }, [matriculas, busca, statusFiltro, turmaFiltro]);

  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            ATIVA
          </span>
        );
      case 'TRANCADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            TRANCADA
          </span>
        );
      case 'TRANSFERIDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <ArrowRightLeft className="w-3 h-3 text-purple-700" />
            TRANSFERIDA
          </span>
        );
      case 'CONCLUIDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3 h-3 text-sky-700" />
            CONCLUÍDA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-carmel-100 text-carmel-800 border border-carmel-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-gold-600 shrink-0" />
            <span>Matrículas Pastorais</span>
          </h1>
          <p className="text-sm text-carmel-600 mt-1">
            Vínculo de catequizandos às turmas, transferências e situações cadastrais.
          </p>
        </div>

        <button
          onClick={() => setIsNovaModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nova Matrícula</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarDados} />}

      {/* Resumo compacto */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-carmel-600 uppercase tracking-wider">
            Total de Matrículas
          </div>
          <div className="font-sans font-bold text-2xl text-carmel-950 mt-1">{totalMatriculas}</div>
        </div>
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
            Ativas
          </div>
          <div className="font-sans font-bold text-2xl text-emerald-700 mt-1">{ativasCount}</div>
        </div>
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
            Trancadas
          </div>
          <div className="font-sans font-bold text-2xl text-amber-700 mt-1">{trancadasCount}</div>
        </div>
        <div className="bg-white border border-carmel-200 rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">
            Concluídas
          </div>
          <div className="font-sans font-bold text-2xl text-sky-700 mt-1">{concluidasCount}</div>
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
            placeholder="Buscar por nome do aluno, CPF ou turma..."
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

          <div className="flex items-center gap-1 bg-white border border-carmel-200 p-1 rounded-xl shadow-card overflow-x-auto">
            {(['TODOS', 'ATIVA', 'TRANCADA', 'CONCLUIDA', 'TRANSFERIDA'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFiltro === st
                    ? 'bg-carmel-800 text-carmel-50'
                    : 'text-carmel-600 hover:text-carmel-950 hover:bg-carmel-50'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Matrículas */}
      <div className="bg-white border border-carmel-200 rounded-2xl overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-carmel-100 rounded-lg" />
            ))}
          </div>
        ) : matriculasFiltradas.length === 0 ? (
          <div className="py-16 text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-carmel-100 text-gold-700 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-carmel-950">Nenhuma matrícula encontrada</h3>
            <p className="text-sm text-carmel-600 max-w-sm mx-auto">
              {busca || statusFiltro !== 'TODOS' || turmaFiltro !== 'TODAS'
                ? 'Nenhuma matrícula corresponde aos filtros aplicados.'
                : 'Ainda não há matrículas registradas. Clique em "Nova Matrícula" para vincular um catequizando.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-carmel-700">
              <thead className="bg-carmel-50 text-[11px] font-semibold uppercase tracking-wider text-carmel-600 border-b border-carmel-200">
                <tr>
                  <th className="px-5 py-3.5">Matrícula</th>
                  <th className="px-5 py-3.5">Catequizando</th>
                  <th className="px-5 py-3.5">Turma Pastoral</th>
                  <th className="px-5 py-3.5">Situação</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carmel-100">
                {matriculasFiltradas.map((mat) => (
                  <tr key={mat.id} className="hover:bg-carmel-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono text-carmel-600 tabular-nums">#{mat.id}</td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-carmel-950 text-sm">
                        {mat.nomeCatequizando || `Catequizando #${mat.matriculaCatequizando}`}
                      </div>
                      <div className="text-[11px] text-carmel-500 font-mono mt-0.5 tabular-nums">
                        {mat.cpfCatequizando
                          ? `CPF: ${mat.cpfCatequizando}`
                          : `Reg #${mat.matriculaCatequizando}`}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-carmel-900">
                        {mat.nomeTurma || `Turma #${mat.idTurma}`}
                      </div>
                      {mat.anoLetivoTurma && (
                        <div className="text-[11px] text-gold-700 mt-0.5 font-semibold tabular-nums">
                          Ciclo {mat.anoLetivoTurma}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">{renderBadgeStatus(mat.statusMatricula)}</td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setMatriculaEmEdicao(mat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-carmel-800 hover:text-carmel-950 bg-carmel-100 hover:bg-carmel-200/80 rounded-lg transition-colors font-semibold"
                          title="Alterar status ou transferir de turma"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                          <span>Gerenciar</span>
                        </button>

                        <button
                          onClick={() => handleExcluir(mat.id, mat.nomeCatequizando)}
                          disabled={excluindoId === mat.id}
                          className="p-2 text-carmel-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Excluir matrícula"
                        >
                          {excluindoId === mat.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-700" />
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
