import React, { createContext, useContext, useState, useEffect } from 'react';
import { UsuarioAutenticado } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      // Restaurar usuário da sessão
      setUsuario({
        nome: "Catequista João Paulo",
        email: "catequista@paroquia.org",
        token,
        perfil: "CATEQUISTA"
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const { token, nome } = await api.login(email, senha);
      api.setToken(token);
      setUsuario({
        nome: nome || "Catequista",
        email,
        token,
        perfil: "CATEQUISTA"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
