import React, { useState } from 'react';
import { turmaService } from '../services/turmaService';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { X, Layers, Calendar, User, Loader2, Save } from 'lucide-react';

interface NovaTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NovaTurmaModal: React.FC<NovaTurmaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const anoAtual = new Date().getFullYear();
  const [nomeTurma, setNomeTurma] = useState('');
  const [anoLetivo, setAnoLetivo] = useState<number>(anoAtual);
  const [idCatequista, setIdCatequista] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nomeTurma.trim()) {
      setErro('O nome da turma é obrigatório.');
      return;
    }

    if (!anoLetivo || anoLetivo < 2000) {
      setErro('Informe um ano letivo válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await turmaService.cadastrar({
        nomeTurma: nomeTurma.trim(),
        anoLetivo: Number(anoLetivo),
        idCatequista: Number(idCatequista),
      });
      setNomeTurma('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-parish-600/20 text-parish-400 border border-parish-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Nova Turma</h2>
              <p className="text-xs text-slate-400">Cadastre uma nova turma pastoral no sistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {erro && <ApiErrorAlert error={erro} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nome da Turma *
            </label>
            <div className="relative">
              <input
                type="text"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
                placeholder="Ex: 1ª Eucaristia - Etapa 1 (Sáb 15h)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-parish-400" />
                <span>Ano Letivo *</span>
              </label>
              <input
                type="number"
                value={anoLetivo}
                onChange={(e) => setAnoLetivo(Number(e.target.value))}
                min={2020}
                max={2040}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-parish-400" />
                <span>ID do Catequista *</span>
              </label>
              <input
                type="number"
                value={idCatequista}
                onChange={(e) => setIdCatequista(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Turma</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
