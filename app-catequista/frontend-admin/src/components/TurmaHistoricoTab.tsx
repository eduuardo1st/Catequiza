import React from 'react';
import { AulaHistorico } from '../types';
import { Calendar, UserX, CheckCircle, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface TurmaHistoricoTabProps {
  aulas: AulaHistorico[];
  turmaNome: string;
}

export const TurmaHistoricoTab: React.FC<TurmaHistoricoTabProps> = ({ aulas, turmaNome }) => {
  if (!aulas || aulas.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
        <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-base text-slate-300">
          Nenhuma aula passada registrada
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          À medida que os encontros forem realizados e encerrados, o histórico de temas e faltas aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-parish-400" />
            Encontros Realizados no Ano Letivo
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro dos temas ministrados e acompanhamento pastoral dos catequizandos ausentes
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300">
          {aulas.length} encontros
        </span>
      </div>

      {/* Grid de Cards de Aulas Passadas */}
      <div className="space-y-4">
        {aulas.map((aula, index) => {
          const teveFaltas = aula.totalFaltas > 0;
          return (
            <div
              key={aula.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-card transition-all"
            >
              {/* Header do Card de Aula */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-parish-900/60 text-parish-300 border border-parish-700/40 flex items-center justify-center font-heading font-bold text-xs shrink-0">
                    #{aulas.length - index}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      {aula.tema}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {aula.data}
                      </span>
                      <span>•</span>
                      <span>Turma: {turmaNome}</span>
                    </div>
                  </div>
                </div>

                {/* Métricas de Presença/Falta */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    {aula.totalPresentes} presentes
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      teveFaltas
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {aula.totalFaltas} {aula.totalFaltas === 1 ? 'falta' : 'faltas'}
                  </span>
                </div>
              </div>

              {/* Descrição do Tema da Aula */}
              {aula.descricao && (
                <p className="text-xs text-slate-300 py-3 leading-relaxed">
                  {aula.descricao}
                </p>
              )}

              {/* Seção de Alunos que Faltaram */}
              <div className="pt-3 border-t border-slate-800/60 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5 text-slate-500" />
                    Alunos Ausentes Neste Encontro:
                  </span>
                  {teveFaltas && (
                    <span className="text-[10px] text-amber-400/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Necessita reposição do tema
                    </span>
                  )}
                </div>

                {teveFaltas ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {aula.alunosFaltantes.map((aluno) => (
                      <div
                        key={aluno.matricula}
                        className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-2.5 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-200">
                            {aluno.nome}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Matrícula #{aluno.matricula}
                          </div>
                          {aluno.motivoJustificativa && (
                            <div className="text-[10px] text-sky-400 font-medium mt-1 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
                              ℹ️ {aluno.motivoJustificativa}
                            </div>
                          )}
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                          Ausente
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Todos os catequizandos compareceram a esta aula! Parabéns à turma.</span>
                    <Sparkles className="w-3.5 h-3.5 ml-auto text-emerald-400/60" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
