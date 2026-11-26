import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, configured, session } from '../services/api';
import { User } from '../types';

// ==========================================
// TIPAGENS (TYPES)
// ==========================================
// Define o formato do resultado retornado ao realizar o cadastro (sign up)
type SignUpResult = {
  needsEmailConfirmation: boolean;
  pendingApproval: boolean;
};

// Define o formato dos dados e funções que o contexto de autenticação disponibilizará para toda a aplicação
type AuthContextValue = {
  user: User | null;                                    // Dados do usuário logado atualmente (ou null se deslogado)
  loading: boolean;                                     // Indica se o aplicativo ainda está verificando a sessão salva
  configured: boolean;                                  // Status de configuração da API
  signIn: (email: string, password: string) => Promise<void>;                  // Função para realizar login
  signUp: (name: string, email: string, password: string) => Promise<SignUpResult>; // Função para registrar novo usuário
  signOut: () => Promise<void>;                         // Função para encerrar a sessão (logout)
  refreshProfile: () => Promise<void>;                  // Função para atualizar os dados do perfil do usuário logado
};

// ==========================================
// CRIAÇÃO DO CONTEXTO
// ==========================================
const Context = createContext<AuthContextValue | null>(null);

// ==========================================
// PROVEDOR DO CONTEXTO: AuthProvider
// ==========================================
// Componente responsável por gerenciar o estado global de autenticação e disponibilizá-lo aos componentes filhos.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar e atualizar os dados do perfil do usuário autenticado no servidor
  async function refreshProfile() {
    const token = await session.get();
    
    // Se não houver token salvo, limpa o usuário e encerra
    if (!token) {
      setUser(null);
      return;
    }

    try {
      // Faz requisição para a rota '/auth/me' para recuperar os dados do usuário atual
      setUser((await api<{ user: User }>('/auth/me')).user);
    } catch {
      // Se houver erro (token expirado/inválido), limpa a sessão e desloga o usuário
      await session.clear();
      setUser(null);
    }
  }

  // Executa a verificação de perfil assim que o componente é montado na aplicação
  useEffect(() => {
    void refreshProfile().finally(() => setLoading(false));
  }, []);

  // Memoriza o valor do contexto para evitar renderizações desnecessárias dos componentes consumidores
  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    configured,
    
    // Função de Login: envia credenciais para a API, salva o token retornado e define o usuário no estado
    signIn: async (email, password) => {
      const result = await api<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      await session.save(result.token);
      setUser(result.user);
    },
    
    // Função de Cadastro: envia dados para a API e retorna o resultado indicando pendências de aprovação
    signUp: async (name, email, password) => {
      const result = await api<SignUpResult>('/auth/register', {
        method: 'POST',
        body: { name, email, password }
      });
      return result;
    },
    
    // Função de Logout: limpa o token salvo e remove o usuário do estado
    signOut: async () => {
      await session.clear();
      setUser(null);
    },
    
    refreshProfile
  }), [user, loading]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

// ==========================================
// HOOK PERSONALIZADO: useAuth
// ==========================================
// Facilita o consumo do contexto de autenticação em qualquer componente, garantindo que ele esteja dentro de um AuthProvider.
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error('AuthProvider ausente');
  return value;
}