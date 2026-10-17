import React from 'react';
import { 
  ClipboardList, 
  UserPlus, 
  PlusCircle, 
  ExternalLink, 
  Calendar, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface SidebarAtalhosProps {
  onOpenFila: () => void;
  onNovaTurma: () => void;
  onNovoAluno: () => void;
  filaCount: number;
}

export const SidebarAtalhos: React.FC<SidebarAtalhosProps> = ({
  onOpenFila,
  onNovaTurma,
  onNovoAluno,
  filaCount
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      
      {/* Bloco 1: Ações Rápidas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3 px-1 text-slate-300">
          Ações Rápidas
        </h3>

        <div className="space-y-1.5">
          <button
            onClick={onOpenFila}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-xs font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-parish-400 group-hover:scale-110 transition-transform" />
              <span>Fila de Espera</span>
            </div>
            {filaCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {filaCount} pendentes
              </span>
            )}
          </button>

          <button
            onClick={onNovaTurma}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-xs font-medium group"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Cadastrar Nova Turma</span>
          </button>

          <button
            onClick={onNovoAluno}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-xs font-medium group"
          >
            <UserPlus className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Matricular Catequizando</span>
          </button>
        </div>
      </div>

      {/* Bloco 2: Links e Orientações Pastorais (estilo referência) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3 px-1 text-slate-300">
          Links Importantes
        </h3>

        <div className="space-y-1">
          <a
            href="https://catequiza-aluno.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg text-slate-400 hover:text-parish-300 hover:bg-slate-800/60 transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-parish-400" />
              <span>Portal do Catequizando (Aluno)</span>
            </div>
          </a>

          <a
            href="#calendario"
            onClick={(e) => { e.preventDefault(); alert("Datas dos Sacramentos 2026: Batismos em Maio e Novembro; 1ª Eucaristia em Outubro; Crisma em Dezembro."); }}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-xs group"
          >
            <Calendar className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            <span>Calendário Paroquial 2026</span>
          </a>

          <a
            href="#guia"
            onClick={(e) => { e.preventDefault(); alert("Instruções: Abra a turma, clique em 'Iniciar Aula & Gerar PIN'. Os catequizandos digitam o código gerado no celular deles."); }}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-xs group"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
            <span>Como funciona a chamada via PIN</span>
          </a>

          <a
            href="#diretrizes"
            onClick={(e) => { e.preventDefault(); alert("Diretriz Pastoral: Alunos com mais de 25% de faltas devem ser encaminhados para conversa com a coordenação."); }}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-xs group"
          >
            <FileText className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            <span>Regulamento & Critérios de Falta</span>
          </a>
        </div>
      </div>

    </aside>
  );
};
