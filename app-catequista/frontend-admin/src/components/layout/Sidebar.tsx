import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Church, 
  Layers, 
  Users, 
  UserPlus, 
  Sparkles, 
  ClipboardList, 
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { to: '/turmas', label: 'Turmas', icon: Layers },
    { to: '/catequizandos', label: 'Catequizandos', icon: Users },
    { to: '/matriculas', label: 'Matrículas', icon: UserPlus },
    { to: '/aulas', label: 'Aulas & PIN', icon: Sparkles },
    { to: '/fila-espera', label: 'Fila de Espera', icon: ClipboardList },
  ];

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-parish-600 text-white flex items-center justify-center shadow-sm">
              <Church className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-white tracking-tight">
              Catequiza<span className="text-parish-400">.</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Gestão Paroquial
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-parish-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Link Externo para Portal do Aluno */}
        <div className="p-4 border-t border-slate-800/80">
          <a
            href="https://catequiza-aluno.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-parish-300 hover:border-parish-500/40 text-[11px] transition-all group"
          >
            <span>Portal do Aluno</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-parish-400" />
          </a>
        </div>
      </aside>
    </>
  );
};
