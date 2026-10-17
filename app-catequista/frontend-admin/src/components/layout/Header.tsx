import React from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Alternar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-xs text-slate-400 hidden sm:block">
          Paróquia São José • <span className="text-slate-300 font-medium">Secretaria Paroquial</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Perfil do Usuário */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-200">{usuario?.nome || 'Catequista'}</div>
            <div className="text-[11px] text-slate-500">{usuario?.email}</div>
          </div>
        </div>

        {/* Botão Sair */}
        <button
          onClick={logout}
          title="Encerrar Sessão"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 text-xs font-medium transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
