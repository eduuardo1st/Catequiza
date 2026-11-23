import React, { useState, useEffect, useCallback } from 'react';
import { Turma, Catequizando } from '../types';
import { api } from '../services/api';
import { TurmaAlunosTab } from './TurmaAlunosTab';
import { TurmaHistoricoTab } from './TurmaHistoricoTab';
import {
  ArrowLeft,
  Sparkles,
  Users,
  BookOpen,
  Radio,
  Clock,
  Play,
  Square,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  UserCheck,
} from 'lucide-react';

interface TurmaPaginaViewProps {
  turma: Turma;
  onVoltar: () => void;
  onTurmaUpdate: (turma: Turma) => void;
}

export const TurmaPaginaView: React.FC<TurmaPaginaViewProps> = ({
  turma,
  onVoltar,
  onTurmaUpdate,
}) => {
  const [secaoAtiva, setSecaoAtiva] = useState<'AULA_DIA' | 'ALUNOS' | 'HISTORICO'>('AULA_DIA');

  const [alunos, setAlunos] = useState<Catequizando[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [copiedPin, setCopiedPin] = useState(false);
  const [descricaoAula, setDescricaoAula] = useState('Tema do Encontro Paroquial');
  const [minutosValidade, setMinutosValidade] = useState(60);
  const [tempoRestante, setTempoRestante] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  const carregarAlunos = useCallback(async () => {
    setLoadingAlunos(true);
    try {
      const data = await api.getAlunosTurma(turma.id);
      setAlunos(data);
    } finally {
      setLoadingAlunos(false);
    }
  }, [turma.id]);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  useEffect(() => {
    if (!turma.aulaAtiva?.horarioExpiracao) return;

    const atualizarRelogio = () => {
      const expira = new Date(turma.aulaAtiva!.horarioExpiracao).getTime();
      const agora = Date.now();
      const diff = expira - agora;

      if (diff <= 0) {
        setTempoRestante('PIN Expirado');
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        if (hrs > 0) {
          setTempoRestante(`${hrs}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s restantes`);
        } else {
          setTempoRestante(`${mins}m ${secs < 10 ? '0' : ''}${secs}s restantes`);
        }
      }
    };

    atualizarRelogio();
    const interval = setInterval(atualizarRelogio, 1000);
    return () => clearInterval(interval);
  }, [turma.aulaAtiva?.horarioExpiracao]);

  const handleIniciarAula = async () => {
    setActionLoading(true);
    try {
      const updated = await api.iniciarAula(turma.id, descricaoAula, minutosValidade);
      onTurmaUpdate(updated);
      await carregarAlunos();
    } finally {
      setActionLoading(false);
    }
  };

  const handleEncerrarAula = async () => {
    if (!window.confirm('Deseja encerrar a sessão de chamada desta turma?')) return;
    setActionLoading(true);
    try {
      const updated = await api.encerrarAula(turma.id, turma.aulaAtiva?.id);
      onTurmaUpdate(updated);
      await carregarAlunos();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyPin = () => {
    if (!turma.aulaAtiva?.pin) return;
    navigator.clipboard.writeText(turma.aulaAtiva.pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleTogglePresenca = async (aluno: Catequizando) => {
    const novoStatus = !aluno.presencaNaAula;
    const aulaIdAlvo =
      turma.aulaAtiva?.id ||
      (turma.aulasHistorico && turma.aulasHistorico.length > 0
        ? turma.aulasHistorico[0].id
        : null);

    setAlunos((prev) =>
      prev.map((a) => {
        if (a.matricula === aluno.matricula) {
          const deltaPresenca = novoStatus ? 1 : -1;
          const deltaFalta = novoStatus ? -1 : 1;
          return {
            ...a,
            presencaNaAula: novoStatus,
            origemPresenca: novoStatus ? 'MANUAL' : 'NENHUMA',
            totalPresencas: Math.max(0, (a.totalPresencas || 0) + deltaPresenca),
            totalFaltas: Math.max(0, (a.totalFaltas || 0) + deltaFalta),
          };
        }
        return a;
      })
    );

    if (aulaIdAlvo) {
      await api.togglePresenca(aulaIdAlvo, aluno.matricula, novoStatus);
      const turmasAtualizadas = await api.getTurmas();
      const turmaAtualizada = turmasAtualizadas.find((t) => t.id === turma.id);
      if (turmaAtualizada) {
        onTurmaUpdate(turmaAtualizada);
      }
    }
  };

  const totalPresentes = alunos.filter((a) => a.presencaNaAula).length;
  const percentualPresenca =
    alunos.length > 0 ? Math.round((totalPresentes / alunos.length) * 100) : 0;
  const totalAulasHistorico = turma.aulasHistorico?.length || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Cabeçalho da Turma */}
      <div className="bg-white border border-carmel-200 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2.5">
            <button
              onClick={onVoltar}
              className="inline-flex items-center gap-2 text-xs font-semibold text-carmel-700 hover:text-carmel-950 transition-colors bg-carmel-50 hover:bg-carmel-100 px-3 py-1.5 rounded-lg border border-carmel-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para Turmas</span>
            </button>

            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-gold-100 text-gold-800 border border-gold-300">
                {turma.sacramento}
              </span>
              <span className="text-xs font-medium text-carmel-600 tabular-nums">
                Ano Letivo {turma.anoLetivo}
              </span>
              {turma.aulaAtiva && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-700 animate-pulse" />
                  Aula Ao Vivo: PIN {turma.aulaAtiva.pin}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight">
              {turma.nomeTurma}
            </h1>

            <div className="flex items-center gap-4 text-xs text-carmel-600 pt-0.5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-600" />
                {turma.horario}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                {turma.sala}
              </span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-gold-600" />
                Catequista: <strong className="text-carmel-900 font-semibold">{turma.catequistaNome}</strong>
              </span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-carmel-50 border border-carmel-200 text-left sm:text-right shrink-0">
            <div className="text-[11px] text-carmel-600 uppercase font-semibold tracking-wide">
              Catequizandos
            </div>
            <div className="font-sans font-bold text-lg text-carmel-950 tabular-nums">
              {alunos.length} matriculados
            </div>
          </div>
        </div>

        {/* Navegação interna por abas limpas */}
        <div
          className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-carmel-200"
          role="tablist"
          aria-label="Seções da turma"
        >
          <button
            role="tab"
            aria-selected={secaoAtiva === 'AULA_DIA'}
            onClick={() => setSecaoAtiva('AULA_DIA')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2 ${
              secaoAtiva === 'AULA_DIA'
                ? 'bg-carmel-800 text-carmel-50 border-carmel-800 shadow-sm'
                : 'bg-carmel-50 text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${secaoAtiva === 'AULA_DIA' ? 'text-gold-300' : 'text-gold-700'}`} />
            <span>Aula do Dia & PIN</span>
            {turma.aulaAtiva && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={secaoAtiva === 'ALUNOS'}
            onClick={() => setSecaoAtiva('ALUNOS')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2 ${
              secaoAtiva === 'ALUNOS'
                ? 'bg-carmel-800 text-carmel-50 border-carmel-800 shadow-sm'
                : 'bg-carmel-50 text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
            }`}
          >
            <Users className={`w-4 h-4 ${secaoAtiva === 'ALUNOS' ? 'text-gold-300' : 'text-gold-700'}`} />
            <span>Registro de Alunos</span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full tabular-nums ${
                secaoAtiva === 'ALUNOS'
                  ? 'bg-carmel-950/50 text-gold-200'
                  : 'bg-white text-carmel-700 border border-carmel-200'
              }`}
            >
              {alunos.length}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={secaoAtiva === 'HISTORICO'}
            onClick={() => setSecaoAtiva('HISTORICO')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2 ${
              secaoAtiva === 'HISTORICO'
                ? 'bg-carmel-800 text-carmel-50 border-carmel-800 shadow-sm'
                : 'bg-carmel-50 text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${secaoAtiva === 'HISTORICO' ? 'text-gold-300' : 'text-gold-700'}`} />
            <span>Aulas Passadas</span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full tabular-nums ${
                secaoAtiva === 'HISTORICO'
                  ? 'bg-carmel-950/50 text-gold-200'
                  : 'bg-white text-carmel-700 border border-carmel-200'
              }`}
            >
              {totalAulasHistorico}
            </span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 1: AULA DO DIA & CHAMADA */}
      {secaoAtiva === 'AULA_DIA' && (
        <div className="space-y-6 animate-fadeIn">
          {turma.aulaAtiva ? (
            /* Card de Aula Ativa — Quadro Carmelita de Alta Visibilidade para Projeção */
            <div className="bg-carmel-900 border border-gold-500/40 rounded-2xl p-6 sm:p-8 shadow-card text-carmel-50">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-xs uppercase tracking-wider text-emerald-300">
                    Sessão de Chamada Aberta
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gold-200 font-mono bg-carmel-950/60 px-3 py-1.5 rounded-lg border border-gold-500/30 flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-4 h-4 text-gold-300" />
                    {tempoRestante}
                  </span>
                  <button
                    onClick={handleEncerrarAula}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-100 hover:text-white bg-red-900/70 hover:bg-red-800 border border-red-400/30 rounded-lg transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Encerrar Chamada
                  </button>
                </div>
              </div>

              <div className="text-center py-7 bg-carmel-950/70 border border-gold-400/35 rounded-2xl my-4">
                <div className="text-xs font-semibold text-gold-300 uppercase tracking-widest mb-2">
                  Código PIN de Presença do Aluno
                </div>
                <div className="font-mono text-5xl sm:text-7xl font-bold tracking-[0.22em] text-gold-200 select-all">
                  {turma.aulaAtiva.pin}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={handleCopyPin}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-carmel-800 hover:bg-carmel-700 text-carmel-50 border border-gold-400/40 rounded-lg transition-colors"
                  >
                    {copiedPin ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4 text-gold-300" />
                    )}
                    <span>{copiedPin ? 'PIN Copiado!' : 'Copiar PIN'}</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gold-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-carmel-200">
                <span className="font-medium text-carmel-50">
                  Tema: {turma.aulaAtiva.descricao || 'Encontro em andamento'}
                </span>
                <span className="font-semibold text-gold-200 tabular-nums">
                  {totalPresentes} de {alunos.length} catequizandos presentes ({percentualPresenca}%)
                </span>
              </div>
            </div>
          ) : (
            /* Card para Iniciar Aula */
            <div className="bg-white border border-carmel-200 rounded-2xl p-6 sm:p-7 shadow-card">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <h2 className="font-heading text-xl text-carmel-950">
                  Iniciar Encontro de Hoje & Habilitar Chamada
                </h2>
              </div>
              <p className="text-sm text-carmel-600 mb-6 max-w-2xl">
                Ao iniciar o encontro, o sistema gera um PIN exclusivo com tempo limite para que os
                catequizandos registrem a presença pelo Portal do Aluno.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-carmel-800 mb-1.5">
                    Tema ou Conteúdo Ministrado no Encontro
                  </label>
                  <input
                    type="text"
                    value={descricaoAula}
                    onChange={(e) => setDescricaoAula(e.target.value)}
                    placeholder="Ex: Oração do Pai Nosso e Mandamentos"
                    className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-carmel-800 mb-1.5">
                    Duração da Sessão do PIN
                  </label>
                  <select
                    value={minutosValidade}
                    onChange={(e) => setMinutosValidade(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={120}>120 minutos (2 horas)</option>
                    <option value={240}>240 minutos (4 horas)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleIniciarAula}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{actionLoading ? 'Gerando Sessão...' : 'Iniciar Encontro & Gerar PIN'}</span>
              </button>
            </div>
          )}

          {/* Lista de Chamada */}
          <div className="bg-white border border-carmel-200 rounded-2xl p-5 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-heading text-lg text-carmel-950 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-700" />
                  {turma.aulaAtiva
                    ? 'Presenças no Encontro Ao Vivo'
                    : 'Lista de Presença do Último Encontro'}
                </h2>
                <p className="text-xs text-carmel-600 mt-0.5 tabular-nums">
                  {totalPresentes} presentes • {Math.max(0, alunos.length - totalPresentes)} ausentes
                </p>
              </div>

              <div className="text-xs text-carmel-600 bg-carmel-50 px-3 py-1.5 rounded-lg border border-carmel-200">
                Clique no botão ao lado de cada aluno para ajustar a chamada
              </div>
            </div>

            {loadingAlunos ? (
              <div className="text-center py-12 text-carmel-600 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-gold-700" />
                Carregando catequizandos da turma...
              </div>
            ) : alunos.length === 0 ? (
              <div className="text-center py-12 bg-carmel-50 border border-carmel-200 rounded-xl text-carmel-600 text-sm">
                Nenhum catequizando matriculado nesta turma até o momento.
              </div>
            ) : (
              <div className="border border-carmel-200 rounded-xl overflow-hidden divide-y divide-carmel-100">
                {alunos.map((aluno) => {
                  const isPresente = aluno.presencaNaAula;
                  return (
                    <div
                      key={aluno.matricula}
                      className="p-3.5 sm:px-4 flex items-center justify-between gap-3 bg-white hover:bg-carmel-50/70 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-carmel-950 truncate">
                            {aluno.nome}
                          </span>
                          {isPresente && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                              {aluno.origemPresenca === 'PIN' ? 'Via PIN' : 'Manual'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-carmel-600 mt-0.5 tabular-nums">
                          Matrícula #{aluno.matricula} • CPF {aluno.cpf} • Faltas no ano:{' '}
                          <strong
                            className={
                              aluno.totalFaltas >= 5
                                ? 'text-red-700'
                                : aluno.totalFaltas >= 3
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }
                          >
                            {aluno.totalFaltas}
                          </strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePresenca(aluno)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                          isPresente
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-carmel-50 text-carmel-700 border-carmel-200 hover:bg-carmel-100 hover:text-carmel-950'
                        }`}
                      >
                        {isPresente ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-carmel-500" />
                            <span>Falta</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: REGISTRO COMPLETO DE ALUNOS */}
      {secaoAtiva === 'ALUNOS' && (
        <div className="bg-white border border-carmel-200 rounded-2xl p-5 sm:p-6 shadow-card">
          <TurmaAlunosTab alunos={alunos} turmaNome={turma.nomeTurma} />
        </div>
      )}

      {/* SEÇÃO 3: HISTÓRICO DE AULAS PASSADAS */}
      {secaoAtiva === 'HISTORICO' && (
        <div className="bg-white border border-carmel-200 rounded-2xl p-5 sm:p-6 shadow-card">
          <TurmaHistoricoTab aulas={turma.aulasHistorico || []} turmaNome={turma.nomeTurma} />
        </div>
      )}
    </div>
  );
};
