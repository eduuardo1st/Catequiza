import { Turma, Catequizando, FilaEsperaItem } from '../types';
import { INITIAL_TURMAS, INITIAL_ALUNOS_TURMA_1, INITIAL_FILA_ESPERA } from './mockData';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://catequiza-backend-dev.onrender.com';

// Gerenciamento de estado em memória com persistência local
const STORAGE_KEY_TURMAS = 'catequiza_turmas_v1';
const STORAGE_KEY_FILA = 'catequiza_fila_v1';

function getStoredTurmas(): Turma[] {
  const data = localStorage.getItem(STORAGE_KEY_TURMAS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return INITIAL_TURMAS;
}

function saveStoredTurmas(turmas: Turma[]) {
  localStorage.setItem(STORAGE_KEY_TURMAS, JSON.stringify(turmas));
}

export const api = {
  // Obter token JWT armazenado
  getToken(): string | null {
    return localStorage.getItem('catequiza_jwt_token');
  },

  setToken(token: string) {
    localStorage.setItem('catequiza_jwt_token', token);
  },

  clearToken() {
    localStorage.removeItem('catequiza_jwt_token');
  },

  // Autenticação com Fallback elegante
  async login(email: string, senha: string):Promise<{ token: string; nome: string }> {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (res.ok) {
        const data = await res.json();
        return { token: data.token || 'jwt-simulated', nome: email.split('@')[0] };
      }
    } catch {
      // Modo offline / demonstração
    }
    // Fallback de demonstração rápida
    return { token: 'demo-token-catequista', nome: 'Catequista João Paulo' };
  },

  // Listar todas as turmas
  async getTurmas(): Promise<Turma[]> {
    try {
      const res = await fetch(`${BASE_URL}/turmas`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Normalizar campos da API com fallback para banners e horários
          const stored = getStoredTurmas();
          return data.map((t: any, index: number) => ({
            id: t.id,
            nomeTurma: t.nomeTurma,
            anoLetivo: t.anoLetivo,
            catequistaNome: t.nomeCatequista || 'Catequista Responsável',
            sacramento: t.nomeTurma.includes('Crisma') ? 'Crisma' : t.nomeTurma.includes('Batismo') ? 'Batismo' : '1ª Eucaristia',
            horario: stored[index % stored.length]?.horario || 'Sábados às 15:00',
            sala: stored[index % stored.length]?.sala || 'Sala de Catequese',
            bannerUrl: stored[index % stored.length]?.bannerUrl || INITIAL_TURMAS[0].bannerUrl,
            totalAlunos: stored[index % stored.length]?.totalAlunos || 20,
            aulaAtiva: stored[index % stored.length]?.aulaAtiva || null
          }));
        }
      }
    } catch {
      // offline / mock
    }
    return getStoredTurmas();
  },

  // Iniciar aula e gerar PIN dinâmico
  async iniciarAula(turmaId: number, descricao: string, minutosValidade: number = 60): Promise<Turma> {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const horarioExpiracao = new Date(Date.now() + minutosValidade * 60 * 1000).toISOString();

    try {
      await fetch(`${BASE_URL}/aulas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          idTurma: turmaId,
          data: new Date().toISOString().split('T')[0],
          descricaoConteudo: descricao,
          pin,
          horarioExpiracao
        })
      });
    } catch {
      // offline
    }

    const turmas = getStoredTurmas();
    const updated = turmas.map(t => {
      if (t.id === turmaId) {
        return {
          ...t,
          aulaAtiva: {
            id: Date.now(),
            pin,
            horarioExpiracao,
            descricao,
            presencasCount: 1
          }
        };
      }
      return t;
    });
    saveStoredTurmas(updated);
    return updated.find(t => t.id === turmaId)!;
  },

  // Encerrar aula
  async encerrarAula(turmaId: number): Promise<Turma> {
    const turmas = getStoredTurmas();
    const updated = turmas.map(t => {
      if (t.id === turmaId) {
        return { ...t, aulaAtiva: null };
      }
      return t;
    });
    saveStoredTurmas(updated);
    return updated.find(t => t.id === turmaId)!;
  },

  // Buscar alunos da turma
  async getAlunosTurma(_turmaId: number): Promise<Catequizando[]> {
    return INITIAL_ALUNOS_TURMA_1;
  },

  // Alternar presença manual
  async togglePresenca(_matricula: number, presenteAtual: boolean): Promise<boolean> {
    return !presenteAtual;
  },

  // Fila de espera
  async getFilaEspera(): Promise<FilaEsperaItem[]> {
    const stored = localStorage.getItem(STORAGE_KEY_FILA);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_FILA_ESPERA;
  },

  async atualizarStatusFila(id: number, status: 'APROVADO' | 'RECUSADO'): Promise<FilaEsperaItem[]> {
    const fila = await this.getFilaEspera();
    const updated = fila.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(STORAGE_KEY_FILA, JSON.stringify(updated));
    return updated;
  }
};
