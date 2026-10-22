import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { catequizandoService } from '../services/catequizandoService';
import { DadosDetalhamentoCatequizando } from '../types/catequizando';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Users 
} from 'lucide-react';

export const CatequizandoList: React.FC = () => {
  const [catequizandos, setCatequizandos] = useState<DadosDetalhamentoCatequizando[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindoMatricula, setExcluindoMatricula] = useState<number | null>(null);

  const carregarCatequizandos = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const data = await catequizandoService.listar();
      setCatequizandos(data);
    } catch (err: any) {
      if (err.request && !err.response) {
        setErro('Não foi possível conectar à API do backend. Verifique sua conexão.');
      } else {
        setErro('Erro ao carregar a lista de catequizandos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarCatequizandos();
  }, []);

  const handleExcluir = async (matricula: number, nome: string) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o catequizando "${nome}" (Matrícula #${matricula})? Esta ação não pode ser desfeita.`
    );

    if (!confirmou) return;

    setExcluindoMatricula(matricula);
    setErro(null);
    setMensagemSucesso(null);

    try {
      await catequizandoService.excluir(matricula);
      setCatequizandos((prev) => prev.filter((c) => c.matricula !== matricula));
      setMensagemSucesso(`Catequizando "${nome}" excluído com sucesso.`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      if (err.response && err.response.status === 500) {
        setErro('Não é possível excluir este aluno pois ele possui registros de chamada ou matrícula vinculados.');
      } else {
        setErro('Erro ao excluir o catequizando.');
      }
    } finally {
      setExcluindoMatricula(null);
    }
  };

  const catequizandosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return catequizandos;

    return catequizandos.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.cpf.includes(termo) ||
        c.matricula.toString().includes(termo) ||
        (c.email && c.email.toLowerCase().includes(termo)) ||
        (c.telefone && c.telefone.includes(termo))
    );
  }, [catequizandos, busca]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-parish-400" />
            <span>Catequizandos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerenciamento de registros cadastrais de alunos da catequese
          </p>
        </div>

        <Link
          to="/catequizandos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Catequizando</span>
        </Link>
      </div>

      {mensagemSucesso && (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, CPF, matrícula ou telefone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-parish-500" />
            <span className="text-xs">Carregando catequizandos...</span>
          </div>
        ) : catequizandosFiltrados.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            {busca
              ? `Nenhum catequizando encontrado para "${busca}".`
              : 'Nenhum catequizando cadastrado no sistema.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Matrícula</th>
                  <th className="px-4 py-3.5">Nome Completo</th>
                  <th className="px-4 py-3.5">CPF</th>
                  <th className="px-4 py-3.5">Telefone</th>
                  <th className="px-4 py-3.5">E-mail</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {catequizandosFiltrados.map((aluno) => (
                  <tr key={aluno.matricula} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      #{aluno.matricula}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-white">
                      {aluno.nome}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {aluno.cpf}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {aluno.telefone || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {aluno.email || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/catequizandos/${aluno.matricula}/editar`}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Editar cadastro"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleExcluir(aluno.matricula, aluno.nome)}
                          disabled={excluindoMatricula === aluno.matricula}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                          title="Excluir cadastro"
                        >
                          {excluindoMatricula === aluno.matricula ? (
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
    </div>
  );
};
