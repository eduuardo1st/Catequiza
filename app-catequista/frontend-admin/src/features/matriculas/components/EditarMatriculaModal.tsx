import React, { useState } from 'react';
import { matriculaService } from '../services/matriculaService';
import { MatriculaComDetalhes } from '../types/matricula';
import { DadosDetalhamentoTurma } from '../../turmas/types/turma';
import { ApiErrorAlert } from '../../../components/ApiErrorAlert';
import { X, RefreshCw, ArrowRightLeft, CheckCircle2, Loader2, Save } from 'lucide-react';

interface EditarMatriculaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  matricula: MatriculaComDetalhes | null;
  turmas: DadosDetalhamentoTurma[];
}

export const EditarMatriculaModal: React.FC<EditarMatriculaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  matricula,
  turmas,
}) => {
  const [modo, setModo] = useState<'STATUS' | 'TRANSFERIR'>('STATUS');
  const [novoStatus, setNovoStatus] = useState<string>('ATIVA');
  const [novaTurmaId, setNovaTurmaId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<any>(null);

  React.useEffect(() => {
    if (matricula) {
      setNovoStatus(matricula.statusMatricula || 'ATIVA');
      setModo('STATUS');
      setNovaTurmaId('');
      setErro(null);
    }
  }, [matricula]);

  if (!isOpen || !matricula) return null;

  const handleSalvarStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    setIsSubmitting(true);
    try {
      await matriculaService.atualizar({
        id: matricula.id,
        statusMatricula: novoStatus,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErro(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferirTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!novaTurmaId) {
      setErro('Selecione a nova turma pastoral de destino.');
      return;
    }

    if (Number(novaTurmaId) === matricula.idTurma) {
      setErro('A turma de destino deve ser diferente da turma atual.');
      return;
    }

    setIsSubmitting(true);
    try {
      await matriculaService.atualizar({
        id: matricula.id,
        statusMatricula: 'TRANSFERIDA',
      });

      await matriculaService.cadastrar({
        matriculaCatequizando: matricula.matriculaCatequizando,
        idTurma: Number(novaTurmaId),
        statusMatricula: 'ATIVA',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carmel-950/60 backdrop-blur-[2px] animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-carmel-200 rounded-2xl p-6 sm:p-7 shadow-modal space-y-5">
        <div className="flex items-center justify-between border-b border-carmel-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-carmel-100 text-carmel-800 border border-carmel-200 flex items-center justify-center">
              {modo === 'STATUS' ? (
                <RefreshCw className="w-5 h-5" />
              ) : (
                <ArrowRightLeft className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl text-carmel-950 font-heading">
                {modo === 'STATUS' ? 'Alterar Status da Matrícula' : 'Transferir de Turma'}
              </h2>
              <p className="text-xs text-carmel-600">
                {matricula.nomeCatequizando || `Catequizando #${matricula.matriculaCatequizando}`}
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

        <div className="flex gap-1.5 p-1 bg-carmel-50 rounded-xl border border-carmel-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setModo('STATUS')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              modo === 'STATUS'
                ? 'bg-carmel-800 text-carmel-50 shadow-sm'
                : 'text-carmel-700 hover:text-carmel-950 hover:bg-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Situação</span>
          </button>
          <button
            type="button"
            onClick={() => setModo('TRANSFERIR')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              modo === 'TRANSFERIR'
                ? 'bg-carmel-800 text-carmel-50 shadow-sm'
                : 'text-carmel-700 hover:text-carmel-950 hover:bg-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transferir de Turma</span>
          </button>
        </div>

        {erro && <ApiErrorAlert error={erro} />}

        {modo === 'STATUS' ? (
          <form onSubmit={handleSalvarStatus} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-carmel-50 border border-carmel-200 text-xs space-y-1">
              <div className="text-carmel-600">
                Turma atual:{' '}
                <strong className="text-carmel-950">
                  {matricula.nomeTurma || `Turma #${matricula.idTurma}`}
                </strong>
              </div>
              <div className="text-carmel-600">
                Situação atual:{' '}
                <span className="font-semibold text-gold-700">{matricula.statusMatricula}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-700" />
                <span>Nova Situação Cadastral *</span>
              </label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                required
              >
                <option value="ATIVA">ATIVA (Participando dos encontros)</option>
                <option value="TRANCADA">TRANCADA (Afastamento temporário)</option>
                <option value="CONCLUIDA">CONCLUÍDA (Ciclo pastoral finalizado)</option>
                <option value="TRANSFERIDA">TRANSFERIDA (Transferido de turma/paróquia)</option>
              </select>
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
        ) : (
          <form onSubmit={handleTransferirTurma} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-carmel-50 border border-carmel-200 text-xs space-y-1">
              <div className="text-carmel-600">
                Turma de Origem:{' '}
                <strong className="text-carmel-950">
                  {matricula.nomeTurma || `Turma #${matricula.idTurma}`}
                </strong>
              </div>
              <p className="text-[11px] text-carmel-600 mt-1">
                A matrícula atual será marcada como <strong>TRANSFERIDA</strong> e uma nova
                matrícula ativa será criada na turma escolhida.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-carmel-800 mb-1.5 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-gold-700" />
                <span>Nova Turma de Destino *</span>
              </label>
              <select
                value={novaTurmaId}
                onChange={(e) => setNovaTurmaId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 bg-carmel-50/70 border border-carmel-200 rounded-lg text-sm text-carmel-950 focus:bg-white focus:border-gold-500"
                required
              >
                <option value="">Selecione a turma de destino...</option>
                {turmas
                  .filter((t) => t.id !== matricula.idTurma)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nomeTurma} (Ano {t.anoLetivo} • ID #{t.id})
                    </option>
                  ))}
              </select>
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
                    <span>Transferindo...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Confirmar Transferência</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
