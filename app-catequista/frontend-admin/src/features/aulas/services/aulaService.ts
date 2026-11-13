import { api } from '../../../lib/api';
import {
  DadosCadastroAula,
  DadosAtualizacaoAula,
  DadosDetalhamentoAula,
} from '../types/aula';

export const aulaService = {
  async listar(): Promise<DadosDetalhamentoAula[]> {
    const response = await api.get<DadosDetalhamentoAula[]>('/aulas');
    return response.data;
  },

  async obterPorId(id: number): Promise<DadosDetalhamentoAula> {
    const response = await api.get<DadosDetalhamentoAula>(`/aulas/${id}`);
    return response.data;
  },

  async cadastrar(dados: DadosCadastroAula): Promise<DadosDetalhamentoAula> {
    const response = await api.post<DadosDetalhamentoAula>('/aulas', dados);
    return response.data;
  },

  async atualizar(dados: DadosAtualizacaoAula): Promise<DadosDetalhamentoAula> {
    const response = await api.put<DadosDetalhamentoAula>('/aulas', dados);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/aulas/${id}`);
  },
};
