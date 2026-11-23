import React from 'react';
import { NavLink } from 'react-router-dom';
import brasaoCarmo from '../../assets/brasao-carmo.png';
import {
  Layers,
  Users,
  UserPlus,
  Sparkles,
  ClipboardList,
  X,
  ExternalLink,
  Phone,
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
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-carmel-950/60 z-30 lg:hidden backdrop-blur-[2px] transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-carmel-900 border-r border-gold-500/20 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 lg:static shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Marca Institucional + Brasão Paroquial */}
        <div className="px-5 py-4 border-b border-gold-500/20 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-carmel-50 p-1 ring-1 ring-gold-400/50 shadow-sm flex items-center justify-center shrink-0">
              <img
                src={brasaoCarmo}
                alt="Brasão da Paróquia Nossa Senhora do Carmo"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="min-w-0">
              <div className="font-heading text-xl text-carmel-50 tracking-wide leading-tight">
                Catequiza<span className="text-gold-300">.</span>
              </div>
              <div className="text-[11px] text-gold-300/90 font-medium truncate">
                Paróquia N. Sra. do Carmo
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-carmel-300 hover:text-white rounded-lg hover:bg-carmel-800 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Navegação principal">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-300/75 px-3 mb-2.5">
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-carmel-800 text-carmel-50 ring-1 ring-gold-400/35 shadow-sm'
                      : 'text-carmel-200/85 hover:text-carmel-50 hover:bg-carmel-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-gold-300' : 'text-gold-400/75'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Rodapé Institucional e Portal do Aluno */}
        <div className="p-4 border-t border-gold-500/20 space-y-3">
          <a
            href="https://catequiza-aluno.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-carmel-950/50 border border-gold-500/25 text-carmel-100 hover:bg-carmel-800 hover:border-gold-400/50 text-xs font-medium transition-colors group"
          >
            <span>Portal do Aluno</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-300 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <div className="px-1 text-[11px] text-carmel-300/80 space-y-0.5 leading-snug">
            <div className="font-medium text-carmel-200">Arquidiocese de Brasília</div>
            <div>QSF 05/07 AE 2 • Taguatinga Sul</div>
            <div className="inline-flex items-center gap-1 text-gold-300/90 tabular-nums">
              <Phone className="w-3 h-3" />
              <span>(61) 3356-7489</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
