import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../../lib/api';
import brasaoCarmo from '../../../assets/brasao-carmo.png';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, MapPin, Phone } from 'lucide-react';

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
        setErro(
          `Não foi possível conectar à API (${API_BASE_URL}). Se o servidor no Render estiver hibernando, pode levar até 1 minuto para acordar. Tente novamente.`
        );
      } else {
        setErro('Ocorreu um erro inesperado ao tentar realizar login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-carmel-50 flex flex-col lg:flex-row">
      {/* Painel Institucional da Paróquia */}
      <div className="lg:w-[44%] bg-carmel-900 text-carmel-50 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gold-500/25">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-carmel-50 p-1.5 ring-1 ring-gold-400/50 shadow-sm shrink-0">
            <img
              src={brasaoCarmo}
              alt="Brasão da Paróquia Nossa Senhora do Carmo"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div>
            <div className="text-xs font-medium text-gold-300 tracking-wide">
              Arquidiocese de Brasília
            </div>
            <div className="font-heading text-lg text-carmel-50">
              Paróquia Nossa Senhora do Carmo
            </div>
          </div>
        </div>

        <div className="my-10 lg:my-0 space-y-6 max-w-md">
          <div className="w-24 h-24 rounded-2xl bg-carmel-50 p-2.5 ring-1 ring-gold-400/60 shadow-modal hidden lg:flex items-center justify-center">
            <img
              src={brasaoCarmo}
              alt="Brasão da Paróquia Nossa Senhora do Carmo"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl text-carmel-50 leading-tight">
              Catequiza<span className="text-gold-300">.</span>
            </h1>
            <p className="text-sm text-carmel-200 leading-relaxed">
              Sistema paroquial de acompanhamento de turmas, registro de frequência por PIN,
              matrículas e fila de espera sacramental do Centro Catequético.
            </p>
          </div>

          <blockquote className="pt-5 border-t border-gold-500/25 text-xs italic text-gold-200/90 leading-relaxed">
            “Mas, acima de tudo, revesti-vos da caridade, que é o vínculo da perfeição.”
            <footer className="not-italic font-semibold text-gold-300 mt-1">
              Colossenses 3, 14
            </footer>
          </blockquote>
        </div>

        <div className="pt-6 border-t border-gold-500/20 flex flex-wrap gap-x-6 gap-y-2 text-xs text-carmel-200/85">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-300" />
            QSF 05/07 AE 2 • Taguatinga Sul
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Phone className="w-3.5 h-3.5 text-gold-300" />
            (61) 3356-7489
          </span>
        </div>
      </div>

      {/* Formulário de Acesso */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-carmel-200 rounded-2xl p-7 sm:p-9 shadow-card">
          <div className="mb-7">
            <h2 className="font-heading text-2xl text-carmel-950">Acesse sua conta</h2>
            <p className="text-sm text-carmel-600 mt-1">
              Entre com suas credenciais de catequista ou secretaria paroquial.
            </p>
          </div>

          {erro && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-carmel-800 mb-1.5"
              >
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-carmel-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="catequista@paroquia.org"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-senha"
                className="block text-xs font-semibold text-carmel-800 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-carmel-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-carmel-800 hover:bg-carmel-700 disabled:opacity-60 text-carmel-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Conectando...</span>
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
