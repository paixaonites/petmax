import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Customer, CustomerInput, InventoryMovement, Manifest, Order, Product, ProductInput, ProductUpdateInput } from '../types';
import { useAuth } from './AuthContext';

// ==========================================
// TIPAGENS (TYPES)
// ==========================================
// Define o formato dos dados enviados para adicionar um item em um pedido
type OrderItemInput = {
  productId: string;
  quantity: number;
};

// Define o formato dos dados enviados para registrar uma movimentação manual de estoque
type MovementInput = {
  productId: string;
  type: string;
  quantity: number;
  reason: string;
  note?: string;
};

// Define o formato completo do contexto de dados (Data Context) disponibilizado para a aplicação
type DataContextValue = {
  products: Product[];                                                    // Lista de produtos cadastrados
  customers: Customer[];                                                  // Lista de clientes cadastrados
  orders: Order[];                                                        // Lista de pedidos realizados
  manifests: Manifest[];                                                  // Lista de romaneios criados
  movements: InventoryMovement[];                                         // Histórico de movimentações de estoque
  loading: boolean;                                                       // Indica se os dados estão sendo carregados pela primeira vez
  refreshing: boolean;                                                    // Indica se os dados estão sendo atualizados em segundo plano
  error: string;                                                          // Mensagem de erro caso ocorra falha ao carregar os dados
  refresh: () => Promise<void>;                                           // Função para atualizar/recarregar os dados
  createProduct: (input: ProductInput) => Promise<void>;                  // Função para cadastrar um novo produto
  updateProduct: (id: string, input: ProductUpdateInput) => Promise<void>;// Função para editar um produto existente
  deleteProduct: (id: string) => Promise<void>;                           // Função para excluir/desativar um produto
  createCustomer: (input: CustomerInput) => Promise<void>;                // Função para cadastrar um novo cliente
  registerMovement: (input: MovementInput) => Promise<void>;              // Função para registrar movimentação de estoque
  createOrder: (customerId: string, items: OrderItemInput[], notes?: string) => Promise<string>; // Função para criar um pedido
  createManifest: (orderIds: string[], notes?: string) => Promise<string>; // Função para criar um novo romaneio
  finishManifest: (id: string) => Promise<void>;                          // Função para concluir um romaneio
};

// ==========================================
// CRIAÇÃO DO CONTEXTO
// ==========================================
const Context = createContext<DataContextValue | null>(null);

// ==========================================
// PROVEDOR DE DADOS: DataProvider
// ==========================================
// Componente responsável por buscar, armazenar e gerenciar o estado global de produtos, clientes, ordens e estoque.
export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, configured } = useAuth();
  
  // Estados para armazenar as listas de dados da aplicação
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [manifests, setManifests] = useState<Manifest[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  
  // Estados de controle de carregamento e erros
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Função centralizada para carregar todos os dados da API em lote
  const loadAll = useCallback(async (silent = false) => {
    // Se o usuário não estiver logado ou a API não estiver configurada, interrompe a busca
    if (!user || !configured) return;

    // Define se o carregamento será silencioso (atualização em segundo plano) ou principal (com tela de loading)
    silent ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      // Faz requisição para a rota '/data' que retorna todos os dados consolidados do sistema
      const data = await api<{
        products: Product[];
        customers: Customer[];
        orders: Order[];
        manifests?: Manifest[];
        movements: InventoryMovement[];
      }>('/data');

      setProducts(data.products);
      setCustomers(data.customers);
      setOrders(data.orders);
      setManifests(data.manifests ?? []);
      setMovements(data.movements);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de conexão');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, configured]);

  // Dispara o carregamento dos dados sempre que o status de autenticação (user/configured) muda
  useEffect(() => {
    if (user && configured) {
      void loadAll();
    } else {
      // Se deslogado, limpa todos os dados da memória
      setProducts([]);
      setCustomers([]);
      setOrders([]);
      setManifests([]);
      setMovements([]);
    }
  }, [user, configured, loadAll]);

  // Memoriza o valor do contexto e as funções de mutação (criação, edição, exclusão, movimentações, pedidos e romaneios)
  const value = useMemo<DataContextValue>(() => ({
    products,
    customers,
    orders,
    manifests,
    movements,
    loading,
    refreshing,
    error,
    refresh: () => loadAll(true),
    
    // Cadastra um novo produto e atualiza os dados em seguida
    createProduct: async input => {
      await api('/products', { method: 'POST', body: input });
      await loadAll(true);
    },

    // Atualiza os dados de um produto existente e recarrega os dados em seguida
    updateProduct: async (id, input) => {
      await api(`/products/${id}`, { method: 'PATCH', body: input });
      await loadAll(true);
    },

    // Desativa/exclui um produto do catálogo ativo e recarrega os dados em seguida
    deleteProduct: async id => {
      await api(`/products/${id}`, { method: 'DELETE' });
      await loadAll(true);
    },
    
    // Cadastra um novo cliente e atualiza os dados em seguida
    createCustomer: async input => {
      await api('/customers', { method: 'POST', body: input });
      await loadAll(true);
    },
    
    // Registra uma movimentação de estoque e atualiza os dados em seguida
    registerMovement: async input => {
      await api('/movements', { method: 'POST', body: input });
      await loadAll(true);
    },
    
    // Cria um novo pedido de venda/saída e atualiza os dados em seguida
    createOrder: async (customerId, items, notes) => {
      const result = await api<{ id: string }>('/orders', {
        method: 'POST',
        body: { customerId, items, notes }
      });
      await loadAll(true);
      return result.id;
    },

    // Cria um novo romaneio agrupando pedidos e atualiza os dados em seguida
    createManifest: async (orderIds, notes) => {
      const result = await api<{ id: string }>('/manifests', {
        method: 'POST',
        body: { orderIds, notes }
      });
      await loadAll(true);
      return result.id;
    },

    // Finaliza um romaneio existente e atualiza os dados em seguida
    finishManifest: async id => {
      await api(`/manifests/${id}/finish`, { method: 'PATCH' });
      await loadAll(true);
    }
  }), [products, customers, orders, manifests, movements, loading, refreshing, error, loadAll]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

// ==========================================
// HOOK PERSONALIZADO: useData
// ==========================================
// Facilita o consumo do contexto de dados em qualquer componente, garantindo que ele esteja dentro de um DataProvider.
export function useData() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('DataProvider ausente');
  return ctx;
}