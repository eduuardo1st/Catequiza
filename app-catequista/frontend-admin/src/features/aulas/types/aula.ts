export interface DadosCadastroAula {
  idTurma: number;
  data: string;
  descricaoConteudo?: string;
}

export interface DadosAtualizacaoAula {
  id: number;
  data?: string;
  descricaoConteudo?: string;
}

export interface DadosDetalhamentoAula {
  id: number;
  idTurma: number;
  data: string;
  pin: string;
  horarioExpiracao: string;
  descricaoConteudo: string;
}

export interface AulaComDetalhes extends DadosDetalhamentoAula {
  nomeTurma?: string;
  anoLetivoTurma?: number;
  isAtiva?: boolean;
}
