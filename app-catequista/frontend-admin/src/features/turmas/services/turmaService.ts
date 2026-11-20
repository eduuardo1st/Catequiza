import { api } from '../../../lib/api';
import {
  DadosCadastroTurma,
  DadosAtualizacaoTurma,
  DadosDetalhamentoTurma,
  DadosDetalhamentoCatequista,
} from '../types/turma';

export const CATEQUISTAS_PADRAO: DadosDetalhamentoCatequista[] = [
  { id: 1, nome: 'Catequista Coordenador', email: 'admin@paroquia.org', telefone: '(11) 98888-0001' },
  { id: 2, nome: 'Maria Helena Silva', email: 'maria.silva@paroquia.org', telefone: '(11) 98888-0002' },
  { id: 3, nome: 'João Paulo Santos', email: 'joao.paulo@paroquia.org', telefone: '(11) 98888-0003' },
  { id: 4, nome: 'Ana Clara Souza', email: 'ana.clara@paroquia.org', telefone: '(11) 98888-0004' },
];

export const turmaService = {
  async listar(): Promise<DadosDetalhamentoTurma[]> {
    const response = await api.get<DadosDetalhamentoTurma[]>('/turmas');
    return response.data;
  },

  async listarCatequistas(): Promise<DadosDetalhamentoCatequista[]> {
    try {
      const response = await api.get<DadosDetalhamentoCatequista[]>('/catequistas');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // Fallback para catequistas padrão enquanto o endpoint /catequistas não estiver publicado
    }
    return CATEQUISTAS_PADRAO;
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
