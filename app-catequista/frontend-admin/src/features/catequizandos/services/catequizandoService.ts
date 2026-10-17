import { api } from '../../../lib/api';
import {
  DadosCadastroCatequizando,
  DadosAtualizacaoCatequizando,
  DadosDetalhamentoCatequizando,
} from '../types/catequizando';

export const catequizandoService = {
  async listar(): Promise<DadosDetalhamentoCatequizando[]> {
    const response = await api.get<DadosDetalhamentoCatequizando[]>('/catequizandos');
    return response.data;
  },

  async obterPorMatricula(matricula: number): Promise<DadosDetalhamentoCatequizando> {
    const response = await api.get<DadosDetalhamentoCatequizando>(`/catequizandos/${matricula}`);
    return response.data;
  },

  async cadastrar(dados: DadosCadastroCatequizando): Promise<DadosDetalhamentoCatequizando> {
    const response = await api.post<DadosDetalhamentoCatequizando>('/catequizandos', dados);
    return response.data;
  },

  async atualizar(dados: DadosAtualizacaoCatequizando): Promise<DadosDetalhamentoCatequizando> {
    const response = await api.put<DadosDetalhamentoCatequizando>('/catequizandos', dados);
    return response.data;
  },

  async excluir(matricula: number): Promise<void> {
    await api.delete(`/catequizandos/${matricula}`);
  },
};
