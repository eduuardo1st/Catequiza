import React from 'react';
import { Turma } from '../types';
import { Users, Clock, MapPin, Radio, KeyRound } from 'lucide-react';

interface TurmaCardProps {
  turma: Turma;
  onOpen: (turma: Turma) => void;
}

export const TurmaCard: React.FC<TurmaCardProps> = ({ turma, onOpen }) => {
  const isAulaAtiva = !!turma.aulaAtiva;

  return (
    <div
      onClick={() => onOpen(turma)}
      className="group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-parish-500/60 rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {/* Banner da Turma */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        <img
          src={turma.bannerUrl}
          alt={turma.nomeTurma}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Tag Superior (inspirado na imagem de referência) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-parish-900/90 text-parish-200 border border-parish-700/50 backdrop-blur-md">
            {turma.sacramento}
          </span>

          {isAulaAtiva && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500/90 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 animate-pulse">
              <Radio className="w-3 h-3 animate-spin" />
              AULA AO VIVO: PIN {turma.aulaAtiva?.pin}
            </span>
          )}
        </div>

        {/* Total de Alunos */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 text-xs text-slate-300">
          <Users className="w-3.5 h-3.5 text-parish-400" />
          <span>{turma.totalAlunos} catequizandos</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Título da Turma */}
          <h3 className="font-heading font-bold text-base text-white tracking-tight line-clamp-2 group-hover:text-parish-300 transition-colors">
            {turma.nomeTurma}
          </h3>

          <div className="text-xs font-semibold text-parish-400 mt-1">
            Ano {turma.anoLetivo}
          </div>

          {/* Detalhes de Horário e Sala */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{turma.horario}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{turma.sala}</span>
            </div>
          </div>
        </div>

        {/* Footer do Card com CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 truncate max-w-[170px]">
            {turma.catequistaNome || 'Equipe de Catequistas'}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-parish-400 group-hover:text-parish-300">
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isAulaAtiva ? 'Gerenciar Aula' : 'Abrir Turma'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
