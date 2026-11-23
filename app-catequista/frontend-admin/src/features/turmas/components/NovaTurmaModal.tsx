import React, { useState, useEffect } from 'react';
import { turmaService, CATEQUISTAS_PADRAO } from '../services/turmaService';
import { DadosDetalhamentoCatequista } from '../types/turma';
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
  const [catequistas, setCatequistas] = useState<DadosDetalhamentoCatequista[]>(CATEQUISTAS_PADRAO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      turmaService.listarCatequistas().then((lista) => {
        setCatequistas(lista);
        if (lista.length > 0 && !lista.some((c) => c.id === idCatequista)) {
          setIdCatequista(lista[0].id);
        }
      });
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carmel-950/60 backdrop-blur-[2px] animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-carmel-200 rounded-2xl p-6 sm:p-7 shadow-modal space-y-5">
        <div className="flex items-center justify-between border-b border-carmel-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-carmel-100 text-carmel-800 border border-carmel-200 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl text-carmel-950 font-heading">Nova Turma</h2>
              <p className="text-xs text-carmel-600">Cadastre uma nova turma pastoral da paróquia</p>
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
            <label className="block text-xs font-semibold text-carmel-800 mb-1.5">
              Nome da Turma *
            </label>
            <input
              type="text"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
              placeholder="Ex: 1ª Eucaristia - Turma Santa Teresinha (Sáb 15h)"
              className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 placeholder-carmel-400 focus:bg-white focus:border-gold-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-700" />
                <span>Ano Letivo *</span>
              </label>
              <input
                type="number"
                value={anoLetivo}
                onChange={(e) => setAnoLetivo(Number(e.target.value))}
                min={2020}
                max={2040}
                className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-700" />
                <span>Catequista Responsável *</span>
              </label>
              <select
                value={idCatequista}
                onChange={(e) => setIdCatequista(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                required
              >
                {catequistas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome} (#{cat.id})
                  </option>
                ))}
              </select>
            </div>
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
