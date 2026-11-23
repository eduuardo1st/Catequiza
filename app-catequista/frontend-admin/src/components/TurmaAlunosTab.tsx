import React, { useState, useMemo } from 'react';
import { Catequizando } from '../types';
import {
  Search,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  User,
  MessageCircle,
  ExternalLink,
  X,
} from 'lucide-react';

interface TurmaAlunosTabProps {
  alunos: Catequizando[];
  turmaNome: string;
}

export const TurmaAlunosTab: React.FC<TurmaAlunosTabProps> = ({ alunos, turmaNome }) => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'OK' | 'ALERTA' | 'CRITICO'>('TODOS');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Catequizando | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const query = busca.toLowerCase().trim();
      const matchBusca =
        !query ||
        aluno.nome.toLowerCase().includes(query) ||
        aluno.cpf.includes(query) ||
        aluno.matricula.toString().includes(query) ||
        (aluno.email && aluno.email.toLowerCase().includes(query)) ||
        (aluno.telefone && aluno.telefone.includes(query));

      let matchStatus = true;
      if (filtroStatus === 'OK') matchStatus = aluno.totalFaltas <= 2;
      if (filtroStatus === 'ALERTA') matchStatus = aluno.totalFaltas >= 3 && aluno.totalFaltas < 5;
      if (filtroStatus === 'CRITICO') matchStatus = aluno.totalFaltas >= 5;

      return matchBusca && matchStatus;
    });
  }, [alunos, busca, filtroStatus]);

  const totalAlunos = alunos.length;
  const alunosCriticos = alunos.filter((a) => a.totalFaltas >= 5).length;
  const alunosAlerta = alunos.filter((a) => a.totalFaltas >= 3 && a.totalFaltas < 5).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Indicadores da Turma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-carmel-50 border border-carmel-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-carmel-600 uppercase tracking-wider">
              Total de Alunos
            </div>
            <div className="font-sans font-bold text-2xl text-carmel-950 mt-0.5 tabular-nums">
              {totalAlunos}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white border border-carmel-200 text-carmel-800 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
              Em Alerta (3–4 faltas)
            </div>
            <div className="font-sans font-bold text-2xl text-amber-800 mt-0.5 tabular-nums">
              {alunosAlerta}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-red-900 uppercase tracking-wider">
              Limite Crítico (≥ 5 faltas)
            </div>
            <div className="font-sans font-bold text-2xl text-red-800 mt-0.5 tabular-nums">
              {alunosCriticos}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white border border-red-200 text-red-700 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-carmel-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome completo, CPF, telefone ou matrícula..."
            className="w-full pl-10 pr-4 py-2 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setFiltroStatus('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filtroStatus === 'TODOS'
                ? 'bg-carmel-800 text-carmel-50 border-carmel-800'
                : 'bg-white text-carmel-700 border-carmel-200 hover:bg-carmel-100'
            }`}
          >
            Todos ({totalAlunos})
          </button>
          <button
            onClick={() => setFiltroStatus('OK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filtroStatus === 'OK'
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-carmel-700 border-carmel-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            Frequentes
          </button>
          <button
            onClick={() => setFiltroStatus('ALERTA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filtroStatus === 'ALERTA'
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-white text-carmel-700 border-carmel-200 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            Atenção ({alunosAlerta})
          </button>
          <button
            onClick={() => setFiltroStatus('CRITICO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filtroStatus === 'CRITICO'
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white text-carmel-700 border-carmel-200 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            Críticos ({alunosCriticos})
          </button>
        </div>
      </div>

      {/* Tabela de Alunos */}
      {alunosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-carmel-50 border border-carmel-200 rounded-xl text-carmel-600 text-sm">
          Nenhum catequizando encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="border border-carmel-200 rounded-xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-carmel-700">
              <thead className="bg-carmel-50 text-[11px] font-semibold uppercase tracking-wider text-carmel-600 border-b border-carmel-200">
                <tr>
                  <th className="px-4 py-3.5">Catequizando</th>
                  <th className="px-4 py-3.5">CPF / Matrícula</th>
                  <th className="px-4 py-3.5">Contatos</th>
                  <th className="px-4 py-3.5 text-center">Faltas</th>
                  <th className="px-4 py-3.5 text-center">Frequência</th>
                  <th className="px-4 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carmel-100">
                {alunosFiltrados.map((aluno) => {
                  const totalAulas = (aluno.totalPresencas || 0) + (aluno.totalFaltas || 0);
                  const pct =
                    totalAulas > 0 ? Math.round((aluno.totalPresencas / totalAulas) * 100) : 100;
                  const isCritico = aluno.totalFaltas >= 5;
                  const isAlerta = aluno.totalFaltas >= 3 && aluno.totalFaltas < 5;

                  return (
                    <tr
                      key={aluno.matricula}
                      className="hover:bg-carmel-50/80 transition-colors group cursor-pointer"
                      onClick={() => setAlunoSelecionado(aluno)}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-carmel-100 border border-carmel-200 flex items-center justify-center text-carmel-800 font-bold text-xs shrink-0">
                            {aluno.nome.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-carmel-950 group-hover:text-carmel-800">
                              {aluno.nome}
                            </div>
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Matrícula Ativa
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap tabular-nums">
                        <div className="font-mono text-xs text-carmel-800">{aluno.cpf}</div>
                        <div className="text-[11px] text-carmel-500">#{aluno.matricula}</div>
                      </td>

                      <td
                        className="px-4 py-3.5 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-1">
                          {aluno.email && (
                            <div className="flex items-center gap-1.5 text-carmel-700">
                              <Mail className="w-3.5 h-3.5 text-carmel-400" />
                              <span className="truncate max-w-[190px]">{aluno.email}</span>
                              <button
                                onClick={() => handleCopy(aluno.email!, `email-${aluno.matricula}`)}
                                title="Copiar e-mail"
                                className="p-1 hover:text-carmel-950 text-carmel-400 rounded"
                              >
                                {copiedItem === `email-${aluno.matricula}` ? (
                                  <Check className="w-3 h-3 text-emerald-700" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          {aluno.telefone && (
                            <div className="flex items-center gap-1.5 text-carmel-700 tabular-nums">
                              <Phone className="w-3.5 h-3.5 text-carmel-400" />
                              <span>{aluno.telefone}</span>
                              <a
                                href={`https://wa.me/55${aluno.telefone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir no WhatsApp"
                                className="p-1 text-emerald-700 hover:text-emerald-800 rounded"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-center tabular-nums">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                            isCritico
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : isAlerta
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isCritico && <AlertCircle className="w-3.5 h-3.5" />}
                          {isAlerta && <AlertTriangle className="w-3.5 h-3.5" />}
                          {!isCritico && !isAlerta && <CheckCircle className="w-3.5 h-3.5" />}
                          {aluno.totalFaltas} {aluno.totalFaltas === 1 ? 'falta' : 'faltas'}
                        </span>
                        <div className="text-[11px] text-carmel-500 mt-0.5">
                          Limite: {aluno.limiteFaltas || 5}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-center tabular-nums">
                        <div className="font-semibold text-xs text-carmel-950 mb-1">{pct}%</div>
                        <div className="w-20 mx-auto bg-carmel-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritico
                                ? 'bg-red-600'
                                : isAlerta
                                ? 'bg-amber-600'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => setAlunoSelecionado(aluno)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-carmel-800 hover:text-carmel-50 bg-carmel-100 hover:bg-carmel-800 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>Ficha</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Ficha Cadastral */}
      {alunoSelecionado && (
        <div
          className="fixed inset-0 z-50 bg-carmel-950/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setAlunoSelecionado(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-carmel-200 rounded-2xl shadow-modal p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-carmel-200">
              <div>
                <h3 className="font-heading text-xl text-carmel-950">{alunoSelecionado.nome}</h3>
                <p className="text-xs text-carmel-600 mt-0.5">Turma: {turmaNome}</p>
              </div>
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="p-1.5 text-carmel-500 hover:text-carmel-950 rounded-lg hover:bg-carmel-100"
                aria-label="Fechar ficha"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-carmel-50 p-3.5 rounded-xl border border-carmel-200 tabular-nums">
                <div>
                  <div className="text-carmel-600 font-medium">Matrícula</div>
                  <div className="font-mono text-sm font-semibold text-carmel-950 mt-0.5">
                    #{alunoSelecionado.matricula}
                  </div>
                </div>
                <div>
                  <div className="text-carmel-600 font-medium">CPF do Aluno</div>
                  <div className="font-mono text-sm font-semibold text-carmel-950 mt-0.5">
                    {alunoSelecionado.cpf}
                  </div>
                </div>
              </div>

              <div className="bg-carmel-50 p-3.5 rounded-xl border border-carmel-200 space-y-2">
                <div className="text-carmel-600 font-semibold">Contatos dos Responsáveis</div>
                <div className="flex items-center justify-between text-carmel-900">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gold-700" />
                    {alunoSelecionado.email || 'Não informado'}
                  </span>
                  {alunoSelecionado.email && (
                    <button
                      onClick={() => handleCopy(alunoSelecionado.email!, 'modal-email')}
                      className="text-gold-700 hover:text-carmel-900 font-semibold"
                    >
                      {copiedItem === 'modal-email' ? 'Copiado!' : 'Copiar'}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-carmel-900 tabular-nums">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-700" />
                    {alunoSelecionado.telefone || 'Não informado'}
                  </span>
                  {alunoSelecionado.telefone && (
                    <a
                      href={`https://wa.me/55${alunoSelecionado.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-carmel-50 p-3.5 rounded-xl border border-carmel-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-carmel-700 font-semibold">Histórico no Ano Letivo</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      alunoSelecionado.totalFaltas >= 5
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {alunoSelecionado.totalFaltas >= 5
                      ? 'Atenção Pastoral Necessária'
                      : 'Frequência Regular'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2 tabular-nums">
                  <div className="bg-white border border-carmel-200 p-2.5 rounded-lg">
                    <div className="text-[10px] text-carmel-600 uppercase font-semibold">Presenças</div>
                    <div className="font-sans font-bold text-lg text-emerald-700">
                      {alunoSelecionado.totalPresencas || 0}
                    </div>
                  </div>
                  <div className="bg-white border border-carmel-200 p-2.5 rounded-lg">
                    <div className="text-[10px] text-carmel-600 uppercase font-semibold">Faltas</div>
                    <div className="font-sans font-bold text-lg text-red-700">
                      {alunoSelecionado.totalFaltas || 0}
                    </div>
                  </div>
                  <div className="bg-white border border-carmel-200 p-2.5 rounded-lg">
                    <div className="text-[10px] text-carmel-600 uppercase font-semibold">Limite</div>
                    <div className="font-sans font-bold text-lg text-carmel-800">
                      {alunoSelecionado.limiteFaltas || 5}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-carmel-200 text-right">
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="px-4 py-2 bg-carmel-800 hover:bg-carmel-700 text-carmel-50 text-xs font-semibold rounded-lg transition-colors"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
