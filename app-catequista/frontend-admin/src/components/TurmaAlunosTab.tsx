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
  ExternalLink
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

  // Copiar texto para o clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Filtragem dos alunos
  const alunosFiltrados = useMemo(() => {
    return alunos.filter(aluno => {
      // Filtro de texto
      const query = busca.toLowerCase().trim();
      const matchBusca = !query ||
        aluno.nome.toLowerCase().includes(query) ||
        aluno.cpf.includes(query) ||
        aluno.matricula.toString().includes(query) ||
        (aluno.email && aluno.email.toLowerCase().includes(query)) ||
        (aluno.telefone && aluno.telefone.includes(query));

      // Filtro de frequência/faltas
      let matchStatus = true;
      if (filtroStatus === 'OK') matchStatus = aluno.totalFaltas <= 2;
      if (filtroStatus === 'ALERTA') matchStatus = aluno.totalFaltas >= 3 && aluno.totalFaltas < 5;
      if (filtroStatus === 'CRITICO') matchStatus = aluno.totalFaltas >= 5;

      return matchBusca && matchStatus;
    });
  }, [alunos, busca, filtroStatus]);

  // Estatísticas gerais
  const totalAlunos = alunos.length;
  const alunosCriticos = alunos.filter(a => a.totalFaltas >= 5).length;
  const alunosAlerta = alunos.filter(a => a.totalFaltas >= 3 && a.totalFaltas < 5).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Indicadores Rápidos da Turma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total de Alunos</div>
            <div className="font-heading font-extrabold text-xl text-white mt-0.5">{totalAlunos}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-parish-500/10 text-parish-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Em Alerta (3-4 faltas)</div>
            <div className="font-heading font-extrabold text-xl text-amber-400 mt-0.5">{alunosAlerta}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Limite Crítico (≥5 faltas)</div>
            <div className="font-heading font-extrabold text-xl text-red-400 mt-0.5">{alunosCriticos}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome completo, CPF, telefone ou matrícula..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
          />
        </div>

        {/* Filtros de Frequência */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setFiltroStatus('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtroStatus === 'TODOS'
                ? 'bg-slate-700 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos ({totalAlunos})
          </button>
          <button
            onClick={() => setFiltroStatus('OK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtroStatus === 'OK'
                ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            Frequentes
          </button>
          <button
            onClick={() => setFiltroStatus('ALERTA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtroStatus === 'ALERTA'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-800'
            }`}
          >
            Atenção ({alunosAlerta})
          </button>
          <button
            onClick={() => setFiltroStatus('CRITICO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filtroStatus === 'CRITICO'
                ? 'bg-red-600/30 text-red-200 border border-red-500/50 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-red-300 border border-slate-800'
            }`}
          >
            Críticos ({alunosCriticos})
          </button>
        </div>
      </div>

      {/* 3. Tabela Rica e Responsiva de Alunos */}
      {alunosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
          Nenhum catequizando encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/80 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Catequizando</th>
                  <th className="px-4 py-3.5">CPF / Matrícula</th>
                  <th className="px-4 py-3.5">Contatos (E-mail / Telefone)</th>
                  <th className="px-4 py-3.5 text-center">Faltas Registradas</th>
                  <th className="px-4 py-3.5 text-center">Frequência</th>
                  <th className="px-4 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {alunosFiltrados.map((aluno) => {
                  const totalAulas = (aluno.totalPresencas || 0) + (aluno.totalFaltas || 0);
                  const pct = totalAulas > 0 ? Math.round((aluno.totalPresencas / totalAulas) * 100) : 100;
                  const isCritico = aluno.totalFaltas >= 5;
                  const isAlerta = aluno.totalFaltas >= 3 && aluno.totalFaltas < 5;

                  return (
                    <tr 
                      key={aluno.matricula}
                      className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                      onClick={() => setAlunoSelecionado(aluno)}
                    >
                      {/* Nome e Avatar */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs shrink-0 group-hover:border-parish-500/50 transition-colors">
                            {aluno.nome.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-parish-300 transition-colors">
                              {aluno.nome}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-medium">
                              Matrícula Ativa
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CPF / Matrícula */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs text-slate-300">{aluno.cpf}</div>
                        <div className="text-[11px] text-slate-500">#{aluno.matricula}</div>
                      </td>

                      {/* Contatos */}
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                          {aluno.email && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span className="truncate max-w-[190px]">{aluno.email}</span>
                              <button
                                onClick={() => handleCopy(aluno.email!, `email-${aluno.matricula}`)}
                                title="Copiar e-mail"
                                className="p-1 hover:text-white text-slate-500 rounded"
                              >
                                {copiedItem === `email-${aluno.matricula}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          {aluno.telefone && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{aluno.telefone}</span>
                              <a
                                href={`https://wa.me/55${aluno.telefone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir no WhatsApp"
                                className="p-1 text-emerald-500 hover:text-emerald-400 rounded"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Faltas */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                            isCritico
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : isAlerta
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isCritico && <AlertCircle className="w-3.5 h-3.5" />}
                          {isAlerta && <AlertTriangle className="w-3.5 h-3.5" />}
                          {!isCritico && !isAlerta && <CheckCircle className="w-3.5 h-3.5" />}
                          {aluno.totalFaltas} {aluno.totalFaltas === 1 ? 'falta' : 'faltas'}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Limite: {aluno.limiteFaltas || 5}
                        </div>
                      </td>

                      {/* Barra de Frequência */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <div className="font-semibold text-xs text-white mb-1">
                          {pct}%
                        </div>
                        <div className="w-20 mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritico ? 'bg-red-500' : isAlerta ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Ação */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => setAlunoSelecionado(aluno)}
                          className="px-2.5 py-1 text-xs font-semibold text-parish-300 hover:text-white bg-slate-800 hover:bg-parish-600 rounded-lg transition-colors inline-flex items-center gap-1"
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

      {/* 4. Modal de Ficha Cadastral Completa do Catequizando */}
      {alunoSelecionado && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setAlunoSelecionado(null)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header da Ficha */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-parish-900/80 text-parish-300 border border-parish-700/50">
                  Ficha do Catequizando
                </span>
                <h3 className="font-heading font-extrabold text-xl text-white mt-1.5">
                  {alunoSelecionado.nome}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Turma: {turmaNome}
                </p>
              </div>
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Dados Cadastrais */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <div className="text-slate-500 font-medium">Matrícula</div>
                  <div className="font-mono text-sm text-slate-200 mt-0.5">#{alunoSelecionado.matricula}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">CPF do Aluno</div>
                  <div className="font-mono text-sm text-slate-200 mt-0.5">{alunoSelecionado.cpf}</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-slate-500 font-medium">Contatos dos Pais / Responsáveis</div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {alunoSelecionado.email || 'Não informado'}
                  </span>
                  {alunoSelecionado.email && (
                    <button
                      onClick={() => handleCopy(alunoSelecionado.email!, 'modal-email')}
                      className="text-parish-400 hover:text-parish-300 font-medium"
                    >
                      {copiedItem === 'modal-email' ? 'Copiado!' : 'Copiar'}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {alunoSelecionado.telefone || 'Não informado'}
                  </span>
                  {alunoSelecionado.telefone && (
                    <a
                      href={`https://wa.me/55${alunoSelecionado.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Histórico de Frequência */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 font-medium">Histórico no Ano Letivo</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    alunoSelecionado.totalFaltas >= 5 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {alunoSelecionado.totalFaltas >= 5 ? 'Atenção Pastoral Necessária' : 'Frequência Regular'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-500 uppercase">Presenças</div>
                    <div className="font-heading font-bold text-base text-emerald-400">{alunoSelecionado.totalPresencas || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-500 uppercase">Faltas</div>
                    <div className="font-heading font-bold text-base text-red-400">{alunoSelecionado.totalFaltas || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-500 uppercase">Limite</div>
                    <div className="font-heading font-bold text-base text-slate-300">{alunoSelecionado.limiteFaltas || 5}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
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
