import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { catequizandoService } from '../services/catequizandoService';
import { DadosDetalhamentoCatequizando } from '../types/catequizando';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const CatequizandoList: React.FC = () => {
  const [catequizandos, setCatequizandos] = useState<DadosDetalhamentoCatequizando[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<any>(null);
  const [excluindoMatricula, setExcluindoMatricula] = useState<number | null>(null);

  const carregarCatequizandos = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const data = await catequizandoService.listar();
      setCatequizandos(data);
    } catch (err: any) {
      setErro(err);
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
        setErro(
          'Não é possível excluir este aluno pois ele possui registros de chamada ou matrícula vinculados.'
        );
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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-carmel-950 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-gold-600 shrink-0" />
            <span>Catequizandos</span>
          </h1>
          <p className="text-sm text-carmel-600 mt-1">
            Cadastro geral de alunos da catequese da Paróquia Nossa Senhora do Carmo.
          </p>
        </div>

        <Link
          to="/catequizandos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Catequizando</span>
        </Link>
      </div>

      {mensagemSucesso && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && <ApiErrorAlert error={erro} onRetry={carregarCatequizandos} />}

      <div className="bg-white border border-carmel-200 rounded-xl p-3.5 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 text-carmel-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, CPF, matrícula, e-mail ou telefone..."
            className="w-full pl-10 pr-4 py-2 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500"
          />
        </div>
      </div>

      <div className="bg-white border border-carmel-200 rounded-2xl overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-11 bg-carmel-100 rounded-lg" />
            ))}
          </div>
        ) : catequizandosFiltrados.length === 0 ? (
          <div className="py-16 text-center text-carmel-600 text-sm px-6">
            {busca
              ? `Nenhum catequizando encontrado para "${busca}".`
              : 'Nenhum catequizando cadastrado no sistema.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-carmel-700">
              <thead className="bg-carmel-50 text-[11px] font-semibold uppercase tracking-wider text-carmel-600 border-b border-carmel-200">
                <tr>
                  <th className="px-5 py-3.5">Matrícula</th>
                  <th className="px-5 py-3.5">Nome Completo</th>
                  <th className="px-5 py-3.5">CPF</th>
                  <th className="px-5 py-3.5">Telefone</th>
                  <th className="px-5 py-3.5">E-mail</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carmel-100">
                {catequizandosFiltrados.map((aluno) => (
                  <tr key={aluno.matricula} className="hover:bg-carmel-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-carmel-600 tabular-nums">
                      #{aluno.matricula}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-sm text-carmel-950">
                      {aluno.nome}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-carmel-800 tabular-nums">
                      {aluno.cpf}
                    </td>
                    <td className="px-5 py-3.5 text-carmel-700 tabular-nums">
                      {aluno.telefone || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-carmel-700">
                      {aluno.email || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/catequizandos/${aluno.matricula}/editar`}
                          className="p-2 text-carmel-600 hover:text-carmel-950 hover:bg-carmel-100 rounded-lg transition-colors"
                          title="Editar cadastro"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleExcluir(aluno.matricula, aluno.nome)}
                          disabled={excluindoMatricula === aluno.matricula}
                          className="p-2 text-carmel-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Excluir cadastro"
                        >
                          {excluindoMatricula === aluno.matricula ? (
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
    </div>
  );
};
