import React, { createContext, useContext, useState, useEffect } from 'react';
import { DadosLogin, UsuarioSession } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  usuario: UsuarioSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credenciais: DadosLogin) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioSession | null>({
    email: 'catequista@paroquia.org',
    nome: 'Catequista Teste',
  });
  const isLoading = false;

  useEffect(() => {
    const storedUser = localStorage.getItem('catequiza_user');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch {}
    }
  }, []);

  const login = async (credenciais: DadosLogin) => {
    const data = await authService.login(credenciais);
    authService.salvarToken(data.token);
    
    const sessionUser: UsuarioSession = {
      email: credenciais.email,
      nome: credenciais.email.split('@')[0],
    };
    
    localStorage.setItem('catequiza_user', JSON.stringify(sessionUser));
    setUsuario(sessionUser);
  };

  const logout = () => {
    authService.limparSessao();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: true,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
