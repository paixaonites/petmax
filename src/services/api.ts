import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// CONFIGURAÇÃO DA URL BASE DA API
// ==========================================
// Obtém a URL base do ambiente (Expo) e remove a barra final (slash) caso exista para padronizar as requisições.
const BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

// Valida se a URL base configurada começa com http:// ou https://, indicando que está pronta para uso.
export const configured = /^https?:\/\//.test(BASE);

// ==========================================
// FUNÇÃO CENTRALIZADA DE REQUISIÇÕES (api)
// ==========================================
// Função genérica assíncrona para comunicação com o backend (GET, POST, PATCH, DELETE, etc.) com suporte a timeout e autenticação JWT.
export async function api<T = any>(
  path: string, 
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  // Se a API não estiver configurada corretamente no arquivo .env, interrompe a execução com um erro explicativo.
  if (!configured) {
    throw new Error('Configure EXPO_PUBLIC_API_URL no arquivo .env.');
  }

  // Recupera o token JWT salvo localmente no AsyncStorage (se houver sessão ativa)
  const token = await AsyncStorage.getItem('petstock_token');

  // Configura um mecanismo de timeout (15 segundos) utilizando AbortController para evitar travamentos de rede
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    // Executa a requisição HTTP utilizando a Fetch API nativa
    const response = await fetch(`${BASE}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}) // Adiciona o token no cabeçalho se o usuário estiver autenticado
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal
    });

    const data = await response.json();

    // Se o servidor retornar um status de erro HTTP (ex: 400, 401, 500), lança uma exceção
    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    return data as T;
  } catch (error) {
    // Trata especificamente o erro de estouro de tempo limite (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite de conexão com o servidor.');
    }
    throw error;
  } finally {
    // Garante que o temporizador de timeout seja limpo após a conclusão da requisição (sucesso ou erro)
    clearTimeout(timeout);
  }
}

// ==========================================
// GERENCIAMENTO DE SESSÃO (session)
// ==========================================
// Objeto utilitário para salvar, remover e recuperar o token de autenticação localmente via AsyncStorage.
export const session = {
  save: (token: string) => AsyncStorage.setItem('petstock_token', token),
  clear: () => AsyncStorage.removeItem('petstock_token'),
  get: () => AsyncStorage.getItem('petstock_token')
};