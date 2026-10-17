import React, { useState, useEffect } from 'react';
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
  UserCheck
} from 'lucide-react';

interface TurmaPaginaViewProps {
  turma: Turma;
  onVoltar: () => void;
  onTurmaUpdate: (turma: Turma) => void;
}

export const TurmaPaginaView: React.FC<TurmaPaginaViewProps> = ({
  turma,
  onVoltar,
  onTurmaUpdate
}) => {
  // Aba ativa na página: AULA_DIA | ALUNOS | HISTORICO
  const [secaoAtiva, setSecaoAtiva] = useState<'AULA_DIA' | 'ALUNOS' | 'HISTORICO'>('AULA_DIA');
  
  const [alunos, setAlunos] = useState<Catequizando[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [copiedPin, setCopiedPin] = useState(false);
  const [descricaoAula, setDescricaoAula] = useState("Tema do Encontro Paroquial");
  const [minutosValidade, setMinutosValidade] = useState(45);
  const [tempoRestante, setTempoRestante] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Carregar lista de catequizandos
  useEffect(() => {
    let mounted = true;
    api.getAlunosTurma(turma.id).then(data => {
      if (mounted) {
        setAlunos(data);
        setLoadingAlunos(false);
      }
    });
    return () => { mounted = false; };
  }, [turma.id]);

  // Atualizar contador regressivo de tempo do PIN
  useEffect(() => {
    if (!turma.aulaAtiva?.horarioExpiracao) return;

    const interval = setInterval(() => {
      const expira = new Date(turma.aulaAtiva!.horarioExpiracao).getTime();
      const agora = new Date().getTime();
      const diff = expira - agora;

      if (diff <= 0) {
        setTempoRestante('PIN Expirado');
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTempoRestante(`${mins}m ${secs < 10 ? '0' : ''}${secs}s restantes`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turma.aulaAtiva?.horarioExpiracao]);

  // Iniciar aula
  const handleIniciarAula = async () => {
    setActionLoading(true);
    try {
      const updated = await api.iniciarAula(turma.id, descricaoAula, minutosValidade);
      onTurmaUpdate(updated);
    } finally {
      setActionLoading(false);
    }
  };

  // Encerrar aula
  const handleEncerrarAula = async () => {
    if (!window.confirm("Deseja encerrar a sessão de chamada desta turma?")) return;
    setActionLoading(true);
    try {
      const updated = await api.encerrarAula(turma.id);
      onTurmaUpdate(updated);
    } finally {
      setActionLoading(false);
    }
  };

  // Copiar PIN
  const handleCopyPin = () => {
    if (!turma.aulaAtiva?.pin) return;
    navigator.clipboard.writeText(turma.aulaAtiva.pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Alternar presença manual do aluno
  const handleTogglePresenca = async (aluno: Catequizando) => {
    const novoStatus = !aluno.presencaNaAula;
    setAlunos(prev => prev.map(a => {
      if (a.matricula === aluno.matricula) {
        return {
          ...a,
          presencaNaAula: novoStatus,
          origemPresenca: novoStatus ? 'MANUAL' : 'NENHUMA'
        };
      }
      return a;
    }));
  };

  const totalPresentes = alunos.filter(a => a.presencaNaAula).length;
  const percentualPresenca = alunos.length > 0 ? Math.round((totalPresentes / alunos.length) * 100) : 0;
  const totalAulasHistorico = turma.aulasHistorico?.length || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Header com Navegação e Breadcrumb */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={onVoltar}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para todas as Turmas</span>
            </button>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-parish-900/90 text-parish-200 border border-parish-700/40">
                {turma.sacramento}
              </span>
              <span className="text-xs text-slate-400">
                Ano Letivo {turma.anoLetivo}
              </span>
              {turma.aulaAtiva && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Aula Ao Vivo: PIN {turma.aulaAtiva.pin}
                </span>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {turma.nomeTurma}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-0.5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {turma.horario}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {turma.sala}
              </span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                Catequista: <strong className="text-slate-300 font-medium">{turma.catequistaNome}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-start">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Catequizandos</div>
              <div className="font-heading font-bold text-lg text-white">{alunos.length} matriculados</div>
            </div>
          </div>
        </div>

        {/* 2. Seletores de Seção por Blocos/Cards de Topo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
          
          {/* Card 1: Aula de Hoje */}
          <button
            onClick={() => setSecaoAtiva('AULA_DIA')}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              secaoAtiva === 'AULA_DIA'
                ? 'bg-parish-950/60 border-parish-500/80 shadow-glow text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-parish-400" />
                Aula do Dia & PIN
              </span>
              {turma.aulaAtiva && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {turma.aulaAtiva ? 'Sessão aberta com PIN ativo' : 'Pronta para iniciar encontro'}
            </div>
          </button>

          {/* Card 2: Registro de Alunos */}
          <button
            onClick={() => setSecaoAtiva('ALUNOS')}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              secaoAtiva === 'ALUNOS'
                ? 'bg-parish-950/60 border-parish-500/80 shadow-glow text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Registro de Alunos
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {alunos.length} alunos
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Ficha completa, CPF, contatos e faltas
            </div>
          </button>

          {/* Card 3: Aulas Passadas */}
          <button
            onClick={() => setSecaoAtiva('HISTORICO')}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              secaoAtiva === 'HISTORICO'
                ? 'bg-parish-950/60 border-parish-500/80 shadow-glow text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Aulas Passadas
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {totalAulasHistorico} encontros
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Temas abordados e alunos que faltaram
            </div>
          </button>

        </div>
      </div>

      {/* 3. Conteúdo Dinâmico do Card Selecionado */}
      
      {/* SEÇÃO 1: AULA DO DIA & CHAMADA */}
      {secaoAtiva === 'AULA_DIA' && (
        <div className="space-y-6 animate-fadeIn">
          {turma.aulaAtiva ? (
            /* Card de Aula Ativa / Projeção do PIN */
            <div className="bg-gradient-to-b from-parish-950/70 via-slate-900 to-slate-900 border-2 border-parish-500/50 rounded-2xl p-6 sm:p-8 shadow-glow relative overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-heading font-bold text-sm uppercase tracking-wider text-emerald-400">
                    Sessão de Chamada Aberta
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-parish-400" />
                    {tempoRestante}
                  </span>
                  <button
                    onClick={handleEncerrarAula}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 rounded-lg transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Encerrar Chamada
                  </button>
                </div>
              </div>

              {/* Destaque Gigante do PIN para projeção na sala */}
              <div className="text-center py-6 bg-slate-950/80 border border-slate-800 rounded-2xl my-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                  Código PIN de Presença do Aluno
                </div>
                <div className="font-heading text-6xl sm:text-8xl font-extrabold tracking-[0.25em] text-parish-300 drop-shadow-[0_0_25px_rgba(14,134,229,0.35)]">
                  {turma.aulaAtiva.pin}
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleCopyPin}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPin ? 'PIN Copiado!' : 'Copiar PIN'}</span>
                  </button>
                </div>
              </div>

              {/* Barra de Progresso de Presenças */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                <span className="font-medium text-slate-200">
                  Tema: {turma.aulaAtiva.descricao || 'Encontro em andamento'}
                </span>
                <span className="font-semibold text-parish-300">
                  {totalPresentes} de {alunos.length} catequizandos registraram presença ({percentualPresenca}%)
                </span>
              </div>
            </div>
          ) : (
            /* Card para Iniciar Aula */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-parish-400" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Iniciar Encontro de Hoje & Habilitar Chamada
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-2xl">
                Ao iniciar o encontro, o sistema gerará um PIN de 4 dígitos com tempo limite. Os catequizandos poderão digitar esse PIN pelo smartphone para registrar presença automaticamente.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Tema ou Conteúdo Ministrado no Encontro
                  </label>
                  <input
                    type="text"
                    value={descricaoAula}
                    onChange={(e) => setDescricaoAula(e.target.value)}
                    placeholder="Ex: Oração do Pai Nosso e Mandamentos"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-parish-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Duração da Sessão do PIN
                  </label>
                  <select
                    value={minutosValidade}
                    onChange={(e) => setMinutosValidade(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:ring-2 focus:ring-parish-500/50 focus:outline-none"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleIniciarAula}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-parish-600 to-parish-500 hover:from-parish-500 hover:to-parish-400 text-white font-semibold text-sm shadow-md shadow-parish-900/50 flex items-center gap-2.5 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{actionLoading ? 'Gerando Sessão...' : 'Iniciar Encontro & Gerar PIN'}</span>
              </button>
            </div>
          )}

          {/* Lista de Chamada em Tempo Real do Encontro de Hoje */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-parish-400" />
                  Presenças no Encontro de Hoje
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {totalPresentes} presentes • {alunos.length - totalPresentes} ausentes
                </p>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hidden sm:block">
                Toque no botão para alternar presença manual
              </div>
            </div>

            {loadingAlunos ? (
              <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-parish-400" />
                Carregando alunos...
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 bg-slate-950/60">
                {alunos.map((aluno) => {
                  const isPresente = aluno.presencaNaAula;
                  return (
                    <div
                      key={aluno.matricula}
                      className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-200 truncate">
                            {aluno.nome}
                          </span>
                          {isPresente && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              {aluno.origemPresenca === 'PIN' ? '✓ via PIN' : '✓ Manual'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Matrícula: #{aluno.matricula} • CPF: {aluno.cpf}
                        </div>
                      </div>

                      {/* Botão de Toggle de Presença */}
                      <button
                        onClick={() => handleTogglePresenca(aluno)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isPresente
                            ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-600/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        {isPresente ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-500" />
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

      {/* SEÇÃO 2: REGISTRO COMPLETO DE ALUNOS (Ficha, CPF, Contatos, Faltas Acumuladas) */}
      {secaoAtiva === 'ALUNOS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <TurmaAlunosTab alunos={alunos} turmaNome={turma.nomeTurma} />
        </div>
      )}

      {/* SEÇÃO 3: HISTÓRICO DE AULAS PASSADAS & ALUNOS QUE FALTARAM */}
      {secaoAtiva === 'HISTORICO' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <TurmaHistoricoTab aulas={turma.aulasHistorico || []} turmaNome={turma.nomeTurma} />
        </div>
      )}

    </div>
  );
};
