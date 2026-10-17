import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search, Church } from 'lucide-react';

interface HeaderProps {
  busca: string;
  onBuscaChange: (v: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ busca, onBuscaChange }) => {
  const { usuario, logout } = useAuth();

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-parish-600 to-parish-800 flex items-center justify-center shadow-md shadow-parish-900/40 text-white">
            <Church className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center">
              Catequiza<span className="text-parish-400">.</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Gestão de Encontros & Turmas
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              placeholder="Buscar turma, sacramento ou catequista..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-parish-500/50 focus:border-parish-500 transition-all"
            />
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Conectado como</div>
            <div className="text-sm font-semibold text-slate-200">{usuario?.nome || 'Catequista'}</div>
          </div>
          
          <button
            onClick={logout}
            title="Encerrar Sessão"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700/60 hover:border-red-500/40 text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

      </div>
    </header>
  );
};
