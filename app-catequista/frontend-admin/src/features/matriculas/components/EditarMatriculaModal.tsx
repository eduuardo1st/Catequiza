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
      // 1. Atualizar a matrícula atual como TRANSFERIDA
      await matriculaService.atualizar({
        id: matricula.id,
        statusMatricula: 'TRANSFERIDA',
      });

      // 2. Criar a nova matrícula como ATIVA na turma de destino
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-parish-600/20 text-parish-400 border border-parish-500/30 flex items-center justify-center">
              {modo === 'STATUS' ? <RefreshCw className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {modo === 'STATUS' ? 'Alterar Status da Matrícula' : 'Transferir Aluno de Turma'}
              </h2>
              <p className="text-xs text-slate-400">
                {matricula.nomeCatequizando || `Catequizando #${matricula.matriculaCatequizando}`}
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

        {/* Abas internas: Alterar Status vs Transferir */}
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setModo('STATUS')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              modo === 'STATUS'
                ? 'bg-parish-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Situação</span>
          </button>
          <button
            type="button"
            onClick={() => setModo('TRANSFERIR')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              modo === 'TRANSFERIR'
                ? 'bg-parish-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transferir de Turma</span>
          </button>
        </div>

        {erro && <ApiErrorAlert error={erro} />}

        {modo === 'STATUS' ? (
          <form onSubmit={handleSalvarStatus} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">
                Turma atual: <strong className="text-white">{matricula.nomeTurma || `Turma #${matricula.idTurma}`}</strong>
              </div>
              <div className="text-slate-400">
                Situação atual: <span className="font-semibold text-parish-300">{matricula.statusMatricula}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-parish-400" />
                <span>Nova Situação Cadastral *</span>
              </label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
                required
              >
                <option value="ATIVA">ATIVA (Participando dos encontros)</option>
                <option value="TRANCADA">TRANCADA (Afastamento temporário)</option>
                <option value="CONCLUIDA">CONCLUÍDA (Ciclo pastoral finalizado)</option>
                <option value="TRANSFERIDA">TRANSFERIDA (Transferido de turma/paróquia)</option>
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
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">
                Turma de Origem: <strong className="text-white">{matricula.nomeTurma || `Turma #${matricula.idTurma}`}</strong>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ao transferir, a matrícula de origem será registrada como <strong>TRANSFERIDA</strong> e uma nova matrícula ativa será criada na turma escolhida abaixo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-parish-400" />
                <span>Nova Turma de Destino *</span>
              </label>
              <select
                value={novaTurmaId}
                onChange={(e) => setNovaTurmaId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
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
