export interface DadosCadastroTurma {
  idCatequista: number;
  nomeTurma: string;
  anoLetivo: number;
}

export interface DadosAtualizacaoTurma {
  id: number;
  idCatequista?: number;
  nomeTurma?: string;
  anoLetivo?: number;
}

export interface DadosDetalhamentoTurma {
  id: number;
  idCatequista: number;
  nomeTurma: string;
  anoLetivo: number;
}
