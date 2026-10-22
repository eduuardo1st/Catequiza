import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../../lib/api';
import { Church, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!email || !senha) {
      setErro('Por favor, informe seu e-mail e senha de acesso.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, senha });
      navigate('/turmas');
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 403 || err.response.status === 401) {
          setErro('E-mail ou senha incorretos. Verifique suas credenciais.');
        } else {
          setErro(`Erro ao autenticar (${err.response.status}). Tente novamente.`);
        }
      } else if (err.request) {
        setErro(`Não foi possível conectar à API (${API_BASE_URL}). Se o servidor no Render estiver hibernando, pode levar até 1 minuto para acordar. Tente novamente.`);
      } else {
        setErro('Ocorreu um erro inesperado ao tentar realizar login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-parish-600 text-white items-center justify-center shadow-sm mb-3">
            <Church className="w-6 h-6" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Catequiza<span className="text-parish-400">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Painel de Gestão Paroquial e Secretaria
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Acesse sua conta</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Entre com suas credenciais de catequista ou secretaria
            </p>
          </div>

          {erro && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-3 text-red-200 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@paroquia.org"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50 focus:border-parish-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-parish-500/50 focus:border-parish-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-parish-600 hover:bg-parish-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Conectando à API...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
