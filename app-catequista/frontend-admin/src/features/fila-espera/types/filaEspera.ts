export type FilaStatus =
  | 'PENDENTE'
  | 'CHAMADO'
  | 'EM_ANALISE'
  | 'MATRICULADO'
  | 'CONCLUIDA'
  | 'CANCELADO'
  | 'CANCELADA'
  | string;

export interface FilaEsperaItem {
  id: number;
  matriculaCatequizando: number;
  sacramentoDesejado: string;
  dataSolicitacao: string;
  status: FilaStatus;
  nomeCatequizando?: string;
  cpfCatequizando?: string;
  telefoneCatequizando?: string;
}

export interface CadastrarFilaDTO {
  matriculaCatequizando: number;
  sacramentoDesejado: string;
}

export interface AtualizarFilaDTO {
  id: number;
  status: string;
}
