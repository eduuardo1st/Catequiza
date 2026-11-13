import { api } from '../../../lib/api';
import { FilaEsperaItem, AtualizarFilaDTO } from '../types/filaEspera';

export const filaEsperaService = {
  async listar(): Promise<FilaEsperaItem[]> {
    const response = await api.get<FilaEsperaItem[]>('/fila-espera');
    return response.data;
  },

  async atualizarStatus(dados: AtualizarFilaDTO): Promise<FilaEsperaItem> {
    const response = await api.put<FilaEsperaItem>('/fila-espera', dados);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/fila-espera/${id}`);
  },
};
