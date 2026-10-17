import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TabsAnosProps {
  anos: string[];
  anoSelecionado: string;
  onSelectAno: (ano: string) => void;
}

export const TabsAnos: React.FC<TabsAnosProps> = ({ anos, anoSelecionado, onSelectAno }) => {
  return (
    <div className="border-b border-slate-800 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {anos.map((ano) => {
            const isSelected = ano === anoSelecionado;
            return (
              <button
                key={ano}
                onClick={() => onSelectAno(ano)}
                className={`px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                  isSelected
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ano}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-parish-500 rounded-t-full shadow-[0_0_8px_rgba(14,134,229,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        <button 
          className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/60 hidden sm:flex items-center justify-center transition-colors"
          title="Ver mais anos"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
