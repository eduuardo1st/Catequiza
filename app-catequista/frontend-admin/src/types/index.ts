export type Sacramento = '1ª Eucaristia' | 'Crisma' | 'Batismo' | 'Perseverança' | 'Adultos';

export interface Turma {
  id: number;
  nomeTurma: string;
  anoLetivo: number;
  catequistaId?: number;
  catequistaNome?: string;
  sacramento: Sacramento;
  horario: string;
  sala: string;
  bannerUrl: string;
  totalAlunos: number;
  aulaAtiva?: {
    id: number;
    pin: string;
    horarioExpiracao: string;
    descricao?: string;
    presencasCount: number;
  } | null;
  aulasHistorico?: AulaHistorico[];
}

export interface AulaHistorico {
  id: number;
  data: string;
  tema: string;
  descricao?: string;
  totalPresentes: number;
  totalFaltas: number;
  alunosFaltantes: {
    matricula: number;
    nome: string;
    motivoJustificativa?: string;
  }[];
}

export interface Catequizando {
  matricula: number;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  statusMatricula?: 'ATIVA' | 'TRANCADA' | 'TRANSFERIDA';
  presencaNaAula?: boolean;
  origemPresenca?: 'PIN' | 'MANUAL' | 'NENHUMA';
  totalFaltas: number;
  totalPresencas: number;
  limiteFaltas?: number;
}

export interface FilaEsperaItem {
  id: number;
  matriculaCatequizando: number;
  nomeCatequizando: string;
  sacramentoDesejado: string;
  dataSolicitacao: string;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
}

export interface UsuarioAutenticado {
  nome: string;
  email: string;
  token: string;
  perfil: 'CATEQUISTA' | 'SECRETARIA';
}
