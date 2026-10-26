import { api } from '../../../lib/api';
import {
  DadosCadastroTurma,
  DadosAtualizacaoTurma,
  DadosDetalhamentoTurma,
} from '../types/turma';

export const turmaService = {
  async listar(): Promise<DadosDetalhamentoTurma[]> {
    const response = await api.get<DadosDetalhamentoTurma[]>('/turmas');
    return response.data;
  },

  async obterPorId(id: number): Promise<DadosDetalhamentoTurma> {
    const response = await api.get<DadosDetalhamentoTurma>(`/turmas/${id}`);
    return response.data;
  },

  async cadastrar(dados: DadosCadastroTurma): Promise<DadosDetalhamentoTurma> {
    const response = await api.post<DadosDetalhamentoTurma>('/turmas', dados);
    return response.data;
  },

  async atualizar(dados: DadosAtualizacaoTurma): Promise<DadosDetalhamentoTurma> {
    const response = await api.put<DadosDetalhamentoTurma>('/turmas', dados);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/turmas/${id}`);
  },
};
