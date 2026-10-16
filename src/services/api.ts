import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
export const configured = /^https?:\/\//.test(BASE);
export async function api<T = any>(path: string, options: {method?: string; body?: unknown} = {}): Promise<T> {
  if (!configured) throw new Error('Configure EXPO_PUBLIC_API_URL no arquivo .env.');
  const token = await AsyncStorage.getItem('petstock_token');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${BASE}${path}`, {method: options.method || 'GET', headers: {'Content-Type':'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}, body: options.body === undefined ? undefined : JSON.stringify(options.body), signal: controller.signal});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Erro HTTP ${response.status}`);
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Tempo limite de conexão com o servidor.');
    throw error;
  } finally { clearTimeout(timeout); }
}
export const session = {save: (token: string) => AsyncStorage.setItem('petstock_token',token), clear: () => AsyncStorage.removeItem('petstock_token'), get: () => AsyncStorage.getItem('petstock_token')};
