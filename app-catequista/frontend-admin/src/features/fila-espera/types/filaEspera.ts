export type FilaStatus = 'PENDENTE' | 'EM_ANALISE' | 'CONCLUIDA' | 'CANCELADA' | string;

export interface FilaEsperaItem {
  id: number;
  matriculaCatequizando: number;
  sacramentoDesejado: string;
  dataSolicitacao: string;
  status: FilaStatus;
}

export interface AtualizarFilaDTO {
  id: number;
  status: string;
}
