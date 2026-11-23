import React from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario, logout } = useAuth();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-carmel-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-carmel-700 hover:text-carmel-950 rounded-lg hover:bg-carmel-100 transition-colors"
          title="Alternar Menu"
          aria-label="Alternar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-carmel-600 truncate">
          <span className="font-medium text-gold-700">Arquidiocese de Brasília</span>
          <span className="text-carmel-300" aria-hidden="true">•</span>
          <span className="font-semibold text-carmel-900">Paróquia Nossa Senhora do Carmo</span>
          <span className="text-carmel-300 hidden md:inline" aria-hidden="true">•</span>
          <span className="text-carmel-500 hidden md:inline">Secretaria de Catequese</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-carmel-100 border border-carmel-200 flex items-center justify-center text-carmel-800">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-xs font-semibold text-carmel-950">
              {usuario?.nome || 'Catequista'}
            </div>
            <div className="text-[11px] text-carmel-500">{usuario?.email}</div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Encerrar Sessão"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carmel-50 hover:bg-red-50 text-carmel-700 hover:text-red-700 border border-carmel-200 hover:border-red-200 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
