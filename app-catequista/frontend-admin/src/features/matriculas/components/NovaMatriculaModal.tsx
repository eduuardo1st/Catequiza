import React, { useState } from 'react';
import { matriculaService } from '../services/matriculaService';
import { DadosDetalhamentoCatequizando } from '../../catequizandos/types/catequizando';
import { DadosDetalhamentoTurma } from '../../turmas/types/turma';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { X, UserPlus, GraduationCap, CheckCircle2, Loader2, Save } from 'lucide-react';

interface NovaMatriculaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  catequizandos: DadosDetalhamentoCatequizando[];
  turmas: DadosDetalhamentoTurma[];
}

export const NovaMatriculaModal: React.FC<NovaMatriculaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  catequizandos,
  turmas,
}) => {
  const [matriculaCatequizando, setMatriculaCatequizando] = useState<number | ''>('');
  const [idTurma, setIdTurma] = useState<number | ''>('');
  const [statusMatricula, setStatusMatricula] = useState<string>('ATIVA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!matriculaCatequizando) {
      setErro('Selecione o catequizando que será matriculado.');
      return;
    }

    if (!idTurma) {
      setErro('Selecione a turma pastoral de destino.');
      return;
    }

    setIsSubmitting(true);
    try {
      await matriculaService.cadastrar({
        matriculaCatequizando: Number(matriculaCatequizando),
        idTurma: Number(idTurma),
        statusMatricula,
      });
      setMatriculaCatequizando('');
      setIdTurma('');
      setStatusMatricula('ATIVA');
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Nova Matrícula Pastoral</h2>
              <p className="text-xs text-slate-400">Vincule um catequizando a uma turma paroquial</p>
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
              Catequizando *
            </label>
            <select
              value={matriculaCatequizando}
              onChange={(e) => setMatriculaCatequizando(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
              required
            >
              <option value="">Selecione o catequizando...</option>
              {catequizandos.map((c) => (
                <option key={c.matricula} value={c.matricula}>
                  {c.nome} (CPF: {c.cpf} • Matrícula #{c.matricula})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-parish-400" />
              <span>Turma de Destino *</span>
            </label>
            <select
              value={idTurma}
              onChange={(e) => setIdTurma(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-parish-400" />
              <span>Status Inicial da Matrícula *</span>
            </label>
            <select
              value={statusMatricula}
              onChange={(e) => setStatusMatricula(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
              required
            >
              <option value="ATIVA">ATIVA (Participando dos encontros)</option>
              <option value="TRANCADA">TRANCADA (Afastamento temporário)</option>
              <option value="CONCLUIDA">CONCLUÍDA (Ciclo pastoral finalizado)</option>
              <option value="TRANSFERIDA">TRANSFERIDA (Outra turma ou paróquia)</option>
            </select>
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
                  <span>Matriculando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Confirmar Matrícula</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
