import React, { useState, useEffect } from 'react';
import { AulaComDetalhes } from '../types/aula';
import { X, Copy, Check, Radio, Clock, Smartphone } from 'lucide-react';

interface ProjetarPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  aula: AulaComDetalhes | null;
}

export const ProjetarPinModal: React.FC<ProjetarPinModalProps> = ({
  isOpen,
  onClose,
  aula,
}) => {
  const [copied, setCopied] = useState(false);
  const [tempoRestante, setTempoRestante] = useState<string>('');
  const [expirado, setExpirado] = useState(false);

  useEffect(() => {
    if (!aula?.horarioExpiracao) return;

    const atualizarTempo = () => {
      const expira = new Date(aula.horarioExpiracao).getTime();
      const agora = new Date().getTime();
      const diff = expira - agora;

      if (diff <= 0) {
        setTempoRestante('PIN Expirado');
        setExpirado(true);
      } else {
        setExpirado(false);
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);

        if (horas > 0) {
          setTempoRestante(`${horas}h ${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s restantes`);
        } else {
          setTempoRestante(`${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s restantes`);
        }
      }
    };

    atualizarTempo();
    const interval = setInterval(atualizarTempo, 1000);
    return () => clearInterval(interval);
  }, [aula?.horarioExpiracao]);

  if (!isOpen || !aula) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(aula.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-7">
        {/* Fechar Modal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Fechar projeção"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Badge de Status da Sessão */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Sessão de Chamada Aberta</span>
        </div>

        {/* Informações da Turma e Tema */}
        <div className="space-y-1.5">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
            {aula.nomeTurma || `Turma #${aula.idTurma}`}
          </h2>
          {aula.descricaoConteudo && (
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              {aula.descricaoConteudo}
            </p>
          )}
        </div>

        {/* Caixa de Destaque Gigante do PIN */}
        <div className="relative py-8 px-6 bg-slate-950 border-2 border-parish-500/60 rounded-3xl shadow-inner group">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Código PIN da Chamada
          </div>

          <div className="font-mono font-black text-5xl sm:text-7xl tracking-widest text-parish-300 select-all">
            {aula.pin}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">PIN Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar PIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Temporizador de Expiração */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Validade do PIN:</span>
          <span className={`font-mono font-bold ${expirado ? 'text-red-400' : 'text-amber-400'}`}>
            {tempoRestante}
          </span>
        </div>

        {/* Orientação Pastoral para os Alunos */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-left text-xs text-slate-300">
          <div className="p-2 rounded-xl bg-parish-600/20 text-parish-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-white">Instruções para Catequizandos e Responsáveis:</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Abra o <strong>Portal do Aluno</strong> no seu smartphone, informe sua matrícula ou CPF e digite o código PIN exibido na tela para registrar a presença do encontro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
