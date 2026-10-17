import { api } from '../../../lib/api';
import { DadosLogin, DadosTokenJWT } from '../types';

export const authService = {
  async login(credenciais: DadosLogin): Promise<DadosTokenJWT> {
    const response = await api.post<DadosTokenJWT>('/login', credenciais);
    return response.data;
  },

  salvarToken(token: string) {
    localStorage.setItem('catequiza_token', token);
  },

  obterToken(): string | null {
    return localStorage.getItem('catequiza_token');
  },

  limparSessao() {
    localStorage.removeItem('catequiza_token');
    localStorage.removeItem('catequiza_user');
  },
};
