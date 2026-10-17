import React, { useState } from 'react';
import { Turma, Sacramento } from '../types';
import { X, PlusCircle } from 'lucide-react';

interface NovaTurmaModalProps {
  onClose: () => void;
  onCreated: (turma: Turma) => void;
}

export const NovaTurmaModal: React.FC<NovaTurmaModalProps> = ({ onClose, onCreated }) => {
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState(2026);
  const [sacramento, setSacramento] = useState<Sacramento>('1ª Eucaristia');
  const [horario, setHorario] = useState('Sábados às 15:00');
  const [sala, setSala] = useState('Sala 01 - Centro Pastoral');
  const [catequista, setCatequista] = useState('Catequista João Paulo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const nova: Turma = {
      id: Date.now(),
      nomeTurma: nome.toUpperCase(),
      anoLetivo: Number(ano),
      sacramento,
      horario,
      sala,
      catequistaNome: catequista,
      bannerUrl: sacramento === 'Crisma'
        ? "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
        : sacramento === 'Batismo'
        ? "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      totalAlunos: 0,
      aulaAtiva: null
    };

    onCreated(nova);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Cadastrar Nova Turma
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome da Turma
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: 1ª EUCARISTIA - ETAPA 1 (SÁB 15H)"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-parish-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ano Letivo
              </label>
              <select
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sacramento / Etapa
              </label>
              <select
                value={sacramento}
                onChange={(e) => setSacramento(e.target.value as Sacramento)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
              >
                <option value="1ª Eucaristia">1ª Eucaristia</option>
                <option value="Crisma">Crisma</option>
                <option value="Batismo">Batismo</option>
                <option value="Perseverança">Perseverança</option>
                <option value="Adultos">Adultos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Horário dos Encontros
              </label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Local / Sala
              </label>
              <input
                type="text"
                value={sala}
                onChange={(e) => setSala(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Catequista de Referência
            </label>
            <input
              type="text"
              value={catequista}
              onChange={(e) => setCatequista(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-parish-600 hover:bg-parish-500 text-white font-semibold text-xs shadow-md shadow-parish-900/40"
            >
              Salvar Turma
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
