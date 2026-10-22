import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { catequizandoService } from '../services/catequizandoService';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';

export const CatequizandoForm: React.FC = () => {
  const { matricula } = useParams<{ matricula: string }>();
  const navigate = useNavigate();
  const isEdicao = Boolean(matricula);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [isLoadingDados, setIsLoadingDados] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (isEdicao && matricula) {
      setIsLoadingDados(true);
      catequizandoService
        .obterPorMatricula(Number(matricula))
        .then((dados) => {
          setNome(dados.nome);
          setCpf(dados.cpf);
          setTelefone(dados.telefone || '');
          setEmail(dados.email || '');
        })
        .catch(() => {
          setErro('Não foi possível carregar os dados do catequizando para edição.');
        })
        .finally(() => {
          setIsLoadingDados(false);
        });
    }
  }, [isEdicao, matricula]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!nome.trim()) {
      setErro('O campo Nome é obrigatório.');
      return;
    }

    if (!isEdicao && !cpf.trim()) {
      setErro('O campo CPF é obrigatório no cadastro.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdicao && matricula) {
        await catequizandoService.atualizar({
          matricula: Number(matricula),
          nome,
          telefone,
          email,
        });
        setSucesso('Catequizando atualizado com sucesso!');
      } else {
        await catequizandoService.cadastrar({
          nome,
          cpf,
          telefone,
          email,
        });
        setSucesso('Catequizando cadastrado com sucesso!');
      }

      setTimeout(() => {
        navigate('/catequizandos');
      }, 1200);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErro('Dados inválidos. Verifique o formato do CPF e e-mail.');
      } else if (err.response?.status === 409) {
        setErro('Já existe um catequizando cadastrado com este CPF.');
      } else {
        setErro(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDados) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-parish-500" />
        <span className="text-xs">Carregando dados cadastrais...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/catequizandos"
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            {isEdicao ? 'Editar Catequizando' : 'Novo Catequizando'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEdicao
              ? `Atualize as informações cadastrais da matrícula #${matricula}`
              : 'Preencha os dados para registrar um novo catequizando'}
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{sucesso}</span>
        </div>
      )}

      {erro && (
        <ApiErrorAlert error={erro} />
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Nome Completo *
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Clara dos Santos"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              CPF *
            </label>
            <input
              type="text"
              required={!isEdicao}
              disabled={isEdicao}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            />
            {isEdicao && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                O CPF não pode ser alterado após o cadastro.
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(61) 99999-9999"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            E-mail de Contato
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato.aluno@email.com"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Link
            to="/catequizandos"
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-parish-600 hover:bg-parish-500 disabled:opacity-60 text-white font-semibold text-xs transition-all shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Catequizando</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
