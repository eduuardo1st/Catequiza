import React, { useState } from 'react';
import { Turma } from '../types';
import { Users, Clock, MapPin, Radio, KeyRound, Trash2, Loader2, Church } from 'lucide-react';

interface TurmaCardProps {
  turma: Turma;
  onOpen: (turma: Turma) => void;
  onDelete?: (id: number, nome: string) => void;
  isDeleting?: boolean;
}

export const TurmaCard: React.FC<TurmaCardProps> = ({ turma, onOpen, onDelete, isDeleting }) => {
  const isAulaAtiva = !!turma.aulaAtiva;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onOpen(turma)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(turma);
        }
      }}
      className="group relative bg-white hover:bg-white border border-carmel-200 hover:border-gold-500 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative h-40 w-full overflow-hidden bg-carmel-900">
        {!imgError && turma.bannerUrl ? (
          <img
            src={turma.bannerUrl}
            alt={turma.nomeTurma}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-carmel-900 flex items-center justify-center">
            <Church className="w-12 h-12 text-gold-400/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-carmel-950/80 via-carmel-950/25 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-carmel-900/90 text-gold-200 border border-gold-400/40">
            {turma.sacramento}
          </span>

          {isAulaAtiva && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3 h-3 animate-pulse" />
              AO VIVO: {turma.aulaAtiva?.pin}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 border border-carmel-200 text-xs font-semibold text-carmel-900 tabular-nums shadow-sm">
          <Users className="w-3.5 h-3.5 text-gold-700" />
          <span>{turma.totalAlunos} catequizandos</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-sans font-bold text-base text-carmel-950 leading-snug line-clamp-2 group-hover:text-carmel-800 transition-colors">
            {turma.nomeTurma}
          </h3>

          <div className="text-xs font-semibold text-gold-700 mt-1 tabular-nums">
            Ano Letivo {turma.anoLetivo}
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-carmel-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{turma.horario}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{turma.sala}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-carmel-100 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-carmel-600 truncate max-w-[155px]">
            {turma.catequistaNome || 'Equipe de Catequistas'}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(turma.id, turma.nomeTurma);
                }}
                disabled={isDeleting}
                className="p-1.5 text-carmel-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                title="Excluir turma"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-700" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold text-carmel-800 group-hover:text-gold-700 transition-colors">
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isAulaAtiva ? 'Gerenciar Aula' : 'Abrir Turma'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
