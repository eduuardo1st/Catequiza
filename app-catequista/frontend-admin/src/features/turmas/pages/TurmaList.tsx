import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../../services/api';
import { turmaService } from '../services/turmaService';
import { Turma } from '../../../types';
import { NovaTurmaModal } from '../components/NovaTurmaModal';
import { TurmaCard } from '../../../components/TurmaCard';
import { TurmaPaginaView } from '../../../components/TurmaPaginaView';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { Plus, Search, GraduationCap, Layers } from 'lucide-react';

export const TurmaList: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
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
      const data = await api.getTurmas();
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

  const handleTurmaUpdate = (turmaAtualizada: Turma) => {
    setTurmas((prev) =>
      prev.map((t) => (t.id === turmaAtualizada.id ? turmaAtualizada : t))
    );
    setTurmaSelecionada(turmaAtualizada);
  };

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
      if (turmaSelecionada?.id === id) {
        setTurmaSelecionada(null);
      }
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
        t.anoLetivo.toString().includes(termo) ||
        (t.catequistaNome && t.catequistaNome.toLowerCase().includes(termo)) ||
        (t.sacramento && t.sacramento.toLowerCase().includes(termo));

      const matchesAno = anoFiltro === 'TODOS' || t.anoLetivo.toString() === anoFiltro;

      return matchesBusca && matchesAno;
    });
  }, [turmas, busca, anoFiltro]);

  if (turmaSelecionada) {
    return (
      <TurmaPaginaView
        turma={turmaSelecionada}
        onVoltar={() => setTurmaSelecionada(null)}
        onTurmaUpdate={handleTurmaUpdate}
      />
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-gold-600 shrink-0" />
            <span>Turmas Pastorais</span>
          </h1>
          <p className="text-sm text-carmel-600 mt-1">
            Selecione uma turma para acompanhar catequizandos, faltas, encontros passados e chamada por PIN.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Turma</span>
        </button>
      </div>

      {erro && <ApiErrorAlert error={erro} onRetry={carregarTurmas} />}

      {/* Barra de Busca e Filtro por Ano */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-white border border-carmel-200 rounded-xl px-3.5 py-2.5 shadow-card flex items-center gap-2.5 focus-within:border-gold-500 transition-colors">
          <Search className="w-4 h-4 text-carmel-400 shrink-0" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome da turma, sacramento, catequista ou ano..."
            className="w-full bg-transparent border-none text-sm text-carmel-950 placeholder-carmel-400 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setAnoFiltro('TODOS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              anoFiltro === 'TODOS'
                ? 'bg-carmel-800 text-carmel-50 border-carmel-800 shadow-sm'
                : 'bg-white text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
            }`}
          >
            Todos os Anos
          </button>
          {anosDisponiveis.map((ano) => (
            <button
              key={ano}
              onClick={() => setAnoFiltro(ano)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border tabular-nums ${
                anoFiltro === ano
                  ? 'bg-carmel-800 text-carmel-50 border-carmel-800 shadow-sm'
                  : 'bg-white text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
              }`}
            >
              Ano {ano}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Turmas */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border border-carmel-200 rounded-xl overflow-hidden shadow-card animate-pulse"
              >
                <div className="h-40 bg-carmel-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-carmel-100 rounded w-3/4" />
                  <div className="h-3 bg-carmel-100 rounded w-1/3" />
                  <div className="h-3 bg-carmel-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : turmasFiltradas.length === 0 ? (
          <div className="py-16 text-center bg-white border border-carmel-200 rounded-2xl p-8 space-y-3 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-carmel-100 text-gold-700 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-carmel-950">Nenhuma turma encontrada</h3>
            <p className="text-sm text-carmel-600 max-w-sm mx-auto">
              {busca || anoFiltro !== 'TODOS'
                ? 'Nenhuma turma corresponde aos filtros aplicados.'
                : 'Ainda não há turmas cadastradas. Clique em "Nova Turma" para registrar a primeira.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {turmasFiltradas.map((turma) => (
              <TurmaCard
                key={turma.id}
                turma={turma}
                onOpen={(t) => setTurmaSelecionada(t)}
                onDelete={handleExcluir}
                isDeleting={excluindoId === turma.id}
              />
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
