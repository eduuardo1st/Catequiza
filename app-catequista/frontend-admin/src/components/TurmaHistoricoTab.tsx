import React from 'react';
import { AulaHistorico } from '../types';
import { Calendar, UserX, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';

interface TurmaHistoricoTabProps {
  aulas: AulaHistorico[];
  turmaNome: string;
}

export const TurmaHistoricoTab: React.FC<TurmaHistoricoTabProps> = ({ aulas, turmaNome }) => {
  if (!aulas || aulas.length === 0) {
    return (
      <div className="text-center py-14 bg-carmel-50 border border-carmel-200 rounded-xl p-8">
        <Calendar className="w-10 h-10 text-carmel-400 mx-auto mb-3" />
        <h3 className="font-heading text-lg text-carmel-950">Nenhuma aula passada registrada</h3>
        <p className="text-sm text-carmel-600 mt-1 max-w-md mx-auto">
          À medida que os encontros forem realizados e encerrados, o histórico de temas e faltas aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="font-heading text-lg text-carmel-950 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-700" />
            Encontros Realizados no Ano Letivo
          </h3>
          <p className="text-xs text-carmel-600 mt-0.5">
            Temas ministrados e acompanhamento pastoral dos catequizandos ausentes
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-carmel-100 border border-carmel-200 text-xs font-semibold text-carmel-800 tabular-nums">
          {aulas.length} encontros
        </span>
      </div>

      <div className="space-y-4">
        {aulas.map((aula, index) => {
          const teveFaltas = aula.totalFaltas > 0;
          return (
            <div
              key={aula.id}
              className="bg-carmel-50/50 border border-carmel-200 rounded-xl p-5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-carmel-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-carmel-800 text-gold-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 tabular-nums">
                    #{aulas.length - index}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm sm:text-base text-carmel-950">
                      {aula.tema}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-carmel-600 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-gold-700" />
                        {aula.data}
                      </span>
                      <span>•</span>
                      <span>{turmaNome}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto tabular-nums">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {aula.totalPresentes} presentes
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      teveFaltas
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-white border-carmel-200 text-carmel-600'
                    }`}
                  >
                    {aula.totalFaltas} {aula.totalFaltas === 1 ? 'falta' : 'faltas'}
                  </span>
                </div>
              </div>

              {aula.descricao && (
                <p className="text-xs text-carmel-600 py-2.5 font-mono">{aula.descricao}</p>
              )}

              <div className="pt-3 border-t border-carmel-200/80 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-carmel-600 flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5 text-carmel-500" />
                    Alunos Ausentes Neste Encontro
                  </span>
                  {teveFaltas && (
                    <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      Necessita reposição do tema
                    </span>
                  )}
                </div>

                {teveFaltas ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {aula.alunosFaltantes.map((aluno) => (
                      <div
                        key={aluno.matricula}
                        className="bg-white border border-carmel-200 rounded-lg p-2.5 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-xs text-carmel-950">{aluno.nome}</div>
                          <div className="text-[11px] text-carmel-500 tabular-nums">
                            Matrícula #{aluno.matricula}
                          </div>
                          {aluno.motivoJustificativa && (
                            <div className="text-[11px] text-sky-800 font-medium mt-1 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                              {aluno.motivoJustificativa}
                            </div>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200 shrink-0">
                          Ausente
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Todos os catequizandos compareceram a este encontro.</span>
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
