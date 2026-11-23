import React, { useState, useEffect } from 'react';
import { AulaComDetalhes } from '../types/aula';
import brasaoCarmo from '../../../assets/brasao-carmo.png';
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
      const agora = Date.now();
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
          setTempoRestante(
            `${horas}h ${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s restantes`
          );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carmel-950/90 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-carmel-900 border border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-modal text-center space-y-6 text-carmel-50">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-carmel-300 hover:text-white rounded-xl hover:bg-carmel-800 transition-colors"
          title="Fechar projeção"
          aria-label="Fechar projeção"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Identidade da Paróquia na Projeção */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-carmel-50 p-1.5 ring-1 ring-gold-400/60 shadow-sm">
            <img
              src={brasaoCarmo}
              alt="Brasão da Paróquia Nossa Senhora do Carmo"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="text-xs font-medium text-gold-300 tracking-wide">
            Paróquia Nossa Senhora do Carmo • Chamada ao Vivo
          </div>
        </div>

        {/* Badge de Status */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
          <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span>{expirado ? 'Sessão Encerrada' : 'Sessão de Chamada Aberta'}</span>
        </div>

        {/* Turma e Tema */}
        <div className="space-y-1.5">
          <h2 className="font-heading text-2xl sm:text-3xl text-carmel-50 tracking-tight">
            {aula.nomeTurma || `Turma #${aula.idTurma}`}
          </h2>
          {aula.descricaoConteudo && (
            <p className="text-sm text-carmel-200 max-w-lg mx-auto">{aula.descricaoConteudo}</p>
          )}
        </div>

        {/* Destaque do PIN */}
        <div className="relative py-8 px-6 bg-carmel-950/75 border-2 border-gold-400/50 rounded-2xl">
          <div className="text-xs uppercase tracking-widest text-gold-300 font-semibold mb-2">
            Código PIN da Chamada
          </div>

          <div className="font-mono font-bold text-5xl sm:text-7xl tracking-[0.22em] text-gold-200 select-all">
            {aula.pin}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 text-xs font-semibold border border-gold-400/40 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200">PIN Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gold-300" />
                  <span>Copiar PIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validade */}
        <div className="flex items-center justify-center gap-2 text-xs tabular-nums">
          <Clock className="w-4 h-4 text-gold-300" />
          <span className="text-carmel-200">Validade do PIN:</span>
          <span className={`font-mono font-bold ${expirado ? 'text-red-300' : 'text-gold-200'}`}>
            {tempoRestante}
          </span>
        </div>

        {/* Instruções */}
        <div className="p-4 rounded-xl bg-carmel-950/55 border border-gold-500/25 flex items-start gap-3 text-left text-xs text-carmel-200">
          <div className="p-2 rounded-lg bg-carmel-800 text-gold-300 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-carmel-50">
              Instruções para Catequizandos e Responsáveis:
            </p>
            <p className="text-carmel-200/85 text-xs leading-relaxed">
              Abra o <strong className="text-gold-200">Portal do Aluno</strong> no celular, selecione
              seu nome e digite o código PIN exibido acima para confirmar sua presença.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
