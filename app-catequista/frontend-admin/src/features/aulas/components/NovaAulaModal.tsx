import React, { useState } from 'react';
import { aulaService } from '../services/aulaService';
import { DadosDetalhamentoTurma } from '../../turmas/types/turma';
import { DadosDetalhamentoAula } from '../types/aula';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { X, Sparkles, Calendar, BookOpen, Layers, Loader2, KeyRound } from 'lucide-react';

interface NovaAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (novaAula: DadosDetalhamentoAula) => void;
  turmas: DadosDetalhamentoTurma[];
}

export const NovaAulaModal: React.FC<NovaAulaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  turmas,
}) => {
  const dataHoje = new Date().toISOString().split('T')[0];
  const [idTurma, setIdTurma] = useState<number | ''>('');
  const [data, setData] = useState<string>(dataHoje);
  const [descricaoConteudo, setDescricaoConteudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!idTurma) {
      setErro('Selecione a turma pastoral para iniciar o encontro.');
      return;
    }

    if (!data) {
      setErro('Informe a data de realização do encontro.');
      return;
    }

    setIsSubmitting(true);
    try {
      const novaAula = await aulaService.cadastrar({
        idTurma: Number(idTurma),
        data,
        descricaoConteudo: descricaoConteudo.trim() || undefined,
      });
      setIdTurma('');
      setData(dataHoje);
      setDescricaoConteudo('');
      onSuccess(novaAula);
      onClose();
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carmel-950/60 backdrop-blur-[2px] animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-carmel-200 rounded-2xl p-6 sm:p-7 shadow-modal space-y-5">
        <div className="flex items-center justify-between border-b border-carmel-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-carmel-100 text-carmel-800 border border-carmel-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl text-carmel-950 font-heading">Iniciar Encontro & Gerar PIN</h2>
              <p className="text-xs text-carmel-600">
                Abra a sessão de chamada ao vivo para os catequizandos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-carmel-500 hover:text-carmel-950 rounded-lg hover:bg-carmel-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {erro && <ApiErrorAlert error={erro} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gold-700" />
              <span>Turma Pastoral *</span>
            </label>
            <select
              value={idTurma}
              onChange={(e) => setIdTurma(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
              required
            >
              <option value="">Selecione a turma...</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nomeTurma} (Ano {t.anoLetivo} • ID #{t.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-700" />
              <span>Data do Encontro *</span>
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500 tabular-nums"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-700" />
              <span>Tema ou Conteúdo do Encontro</span>
            </label>
            <textarea
              rows={3}
              value={descricaoConteudo}
              onChange={(e) => setDescricaoConteudo(e.target.value)}
              placeholder="Ex: Introdução aos Dez Mandamentos e partilha fraterna..."
              className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500 resize-none"
            />
            <p className="text-[11px] text-carmel-500 mt-1">
              O sistema gera automaticamente um código PIN exclusivo com validade programada de 4 horas.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-carmel-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-carmel-700 hover:text-carmel-950 rounded-lg hover:bg-carmel-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-carmel-800 hover:bg-carmel-700 text-carmel-50 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PIN...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-gold-300" />
                  <span>Iniciar & Gerar PIN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
