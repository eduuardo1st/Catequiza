import { api } from '../../../lib/api';
import {
  DadosCadastroMatricula,
  DadosAtualizacaoMatricula,
  DadosDetalhamentoMatricula,
} from '../types/matricula';

export const matriculaService = {
  async listar(): Promise<DadosDetalhamentoMatricula[]> {
    const response = await api.get<DadosDetalhamentoMatricula[]>('/matriculas');
    return response.data;
  },

  async obterPorId(id: number): Promise<DadosDetalhamentoMatricula> {
    const response = await api.get<DadosDetalhamentoMatricula>(`/matriculas/${id}`);
    return response.data;
  },

  async cadastrar(dados: DadosCadastroMatricula): Promise<DadosDetalhamentoMatricula> {
    const response = await api.post<DadosDetalhamentoMatricula>('/matriculas', dados);
    return response.data;
  },

  async atualizar(dados: DadosAtualizacaoMatricula): Promise<DadosDetalhamentoMatricula> {
    const response = await api.put<DadosDetalhamentoMatricula>('/matriculas', dados);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/matriculas/${id}`);
  },
};
