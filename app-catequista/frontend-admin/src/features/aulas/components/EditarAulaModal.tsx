import React, { useState, useEffect } from 'react';
import { aulaService } from '../services/aulaService';
import { AulaComDetalhes } from '../types/aula';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { X, Edit2, Calendar, BookOpen, Loader2, Save } from 'lucide-react';

interface EditarAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aula: AulaComDetalhes | null;
}

export const EditarAulaModal: React.FC<EditarAulaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  aula,
}) => {
  const [data, setData] = useState('');
  const [descricaoConteudo, setDescricaoConteudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  useEffect(() => {
    if (aula) {
      setData(aula.data || '');
      setDescricaoConteudo(aula.descricaoConteudo || '');
      setErro(null);
    }
  }, [aula]);

  if (!isOpen || !aula) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!data) {
      setErro('A data do encontro é obrigatória.');
      return;
    }

    setIsSubmitting(true);
    try {
      await aulaService.atualizar({
        id: aula.id,
        data,
        descricaoConteudo: descricaoConteudo.trim() || undefined,
      });
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
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Editar Encontro</h2>
              <p className="text-xs text-slate-400">
                {aula.nomeTurma || `Turma #${aula.idTurma}`} • PIN: <strong className="font-mono text-parish-300">{aula.pin}</strong>
              </p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-parish-400" />
              <span>Data do Encontro *</span>
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-parish-400" />
              <span>Tema ou Conteúdo do Encontro</span>
            </label>
            <textarea
              rows={3}
              value={descricaoConteudo}
              onChange={(e) => setDescricaoConteudo(e.target.value)}
              placeholder="Descreva os temas abordados no encontro..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50 resize-none"
            />
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
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
