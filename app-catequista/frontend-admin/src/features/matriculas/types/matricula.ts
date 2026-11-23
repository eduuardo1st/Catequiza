export type StatusMatricula = 'ATIVA' | 'TRANCADA' | 'TRANSFERIDA' | 'CONCLUIDA';

export interface DadosCadastroMatricula {
  matriculaCatequizando: number;
  idTurma: number;
  statusMatricula: string;
}

export interface DadosAtualizacaoMatricula {
  id: number;
  statusMatricula: string;
}

export interface DadosDetalhamentoMatricula {
  id: number;
  matriculaCatequizando: number;
  idTurma: number;
  statusMatricula: string;
  nomeCatequizando?: string;
  cpfCatequizando?: string;
  nomeTurma?: string;
  anoLetivoTurma?: number;
}

export interface MatriculaComDetalhes extends DadosDetalhamentoMatricula {
  nomeCatequizando?: string;
  cpfCatequizando?: string;
  nomeTurma?: string;
  anoLetivoTurma?: number;
}
