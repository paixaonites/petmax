import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';
import { AppDrawer } from './AppDrawer';
import { DashboardScreen } from '../screens/DashboardScreen';
import { GenericModuleScreen } from '../screens/GenericModuleScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ManifestsScreen } from '../screens/ManifestsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { MovementsScreen } from '../screens/MovementsScreen';
import { CustomersScreen } from '../screens/CustomersScreen';
import { NewOrderScreen } from '../screens/NewOrderScreen';
import { EmployeesScreen } from '../screens/EmployeesScreen';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type ModuleConfig = { title: string; subtitle: string; description: string; icon: IconName; action?: string; features: string[] };

const moduleConfigs: Partial<Record<ScreenKey, ModuleConfig>> = {
  products: { title: 'Produtos', subtitle: 'Catálogo da distribuidora', description: 'Cadastre e organize rações, acessórios e produtos por marca e categoria.', icon: 'pricetags-outline', action: 'Cadastrar produto', features: ['Cadastro com foto, preço, peso e código de barras', 'Categorias, marcas e estoque mínimo', 'Edição e desativação com controle de permissão'] },
  scanner: { title: 'Leitor de código', subtitle: 'Localização rápida', description: 'Use a câmera para encontrar produtos e registrar operações sem digitação.', icon: 'barcode-outline', action: 'Abrir câmera', features: ['Leitura de EAN e códigos compatíveis', 'Entrada ou saída após leitura', 'Aviso para códigos ainda não cadastrados'] },
  movements: { title: 'Movimentações', subtitle: 'Entradas, saídas e ajustes', description: 'Registre toda alteração de estoque com motivo, responsável e horário.', icon: 'swap-horizontal-outline', action: 'Nova movimentação', features: ['Entrada, saída, ajuste, devolução e perda', 'Validação de quantidade disponível', 'Histórico automático e não apagável'] },
  history: { title: 'Histórico', subtitle: 'Auditoria de ações', description: 'Consulte quem fez cada operação e quando ela aconteceu.', icon: 'time-outline', features: ['Filtro por funcionário e período', 'Antes e depois de alterações', 'Registro protegido para administradores'] },
  customers: { title: 'Clientes', subtitle: 'Cadastro e consulta', description: 'Encontre rapidamente os clientes antes de criar um novo pedido.', icon: 'people-outline', action: 'Cadastrar cliente', features: ['Dados de contato e endereço', 'Pesquisa por nome, CPF ou CNPJ', 'Pedidos anteriores do cliente'] },
  newOrder: { title: 'Novo pedido', subtitle: 'Carrinho interno', description: 'Selecione o cliente, inclua produtos e confirme o estoque antes de finalizar.', icon: 'cart-outline', action: 'Selecionar cliente', features: ['Pesquisa e inclusão por código de barras', 'Quantidade, preço unitário e subtotal', 'Reserva segura do estoque ao confirmar'] },
  newManifest: { title: 'Novo romaneio', subtitle: 'Separação e conferência', description: 'Agrupe pedidos prontos e consolide automaticamente as quantidades.', icon: 'clipboard-outline', action: 'Selecionar pedidos', features: ['Agrupamento de produtos repetidos', 'Conferência por botão ou código de barras', 'Progresso e finalização somente em 100%'] },
  employees: { title: 'Funcionários', subtitle: 'Acesso administrativo', description: 'Gerencie usuários, funções e permissões de acesso ao sistema.', icon: 'id-card-outline', action: 'Cadastrar funcionário', features: ['Perfis de administrador e funcionário', 'Ativação e desativação de acesso', 'Permissões aplicadas no app e no backend'] },
  reports: { title: 'Relatórios', subtitle: 'Indicadores operacionais', description: 'Acompanhe movimentações, pedidos, romaneios e alertas de estoque.', icon: 'bar-chart-outline', features: ['Filtros por data e tipo de operação', 'Produtos mais movimentados', 'Resumo de entradas, saídas e cancelamentos'] },
  profile: { title: 'Perfil', subtitle: 'Sua conta', description: 'Consulte seus dados e as permissões disponíveis para sua função.', icon: 'person-circle-outline', features: ['Dados pessoais e contato', 'Função e nível de acesso', 'Alteração segura de senha'] },
};

const headerTitles: Record<ScreenKey, [string, string]> = {
  dashboard: ['Visão geral', 'Painel operacional'], inventory: ['Estoque', 'Consulta em tempo real'], products: ['Produtos', 'Catálogo da distribuidora'], scanner: ['Leitor', 'Código de barras'], movements: ['Movimentações', 'Controle de estoque'], history: ['Histórico', 'Auditoria de ações'], customers: ['Clientes', 'Cadastro e consulta'], orders: ['Pedidos', 'Venda interna'], newOrder: ['Novo pedido', 'Carrinho interno'], manifests: ['Romaneios', 'Separação e conferência'], newManifest: ['Novo romaneio', 'Agrupar pedidos'], employees: ['Funcionários', 'Acesso administrativo'], reports: ['Relatórios', 'Indicadores operacionais'], profile: ['Perfil', 'Sua conta'], settings: ['Configurações', 'Preferências do aplicativo'],
};

export function RootApp() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<ScreenKey>('dashboard');
  const [drawer, setDrawer] = useState(false);
  const content = useMemo(() => {
    if (screen === 'dashboard') return <DashboardScreen navigate={setScreen} />;
    if (screen === 'inventory') return <InventoryScreen />;
    if (screen === 'products') return <ProductsScreen />;
    if (screen === 'movements') return <MovementsScreen />;
    if (screen === 'customers') return <CustomersScreen />;
    if (screen === 'employees') return <EmployeesScreen />;
    if (screen === 'orders') return <OrdersScreen navigate={setScreen} />;
    if (screen === 'newOrder') return <NewOrderScreen navigate={setScreen} />;
    if (screen === 'manifests') return <ManifestsScreen navigate={setScreen} />;
    if (screen === 'settings') return <SettingsScreen />;
    const config = moduleConfigs[screen];
    return config ? <GenericModuleScreen {...config} /> : null;
  }, [screen]);

  if (!user) return <LoginScreen />;
  const [title, subtitle] = headerTitles[screen];
  return <SafeAreaView style={styles.safe} edges={['top']}><ScreenHeader title={title} subtitle={subtitle} onMenu={() => setDrawer(true)} /><View style={styles.body}>{content}</View><AppDrawer visible={drawer} active={screen} onClose={() => setDrawer(false)} onSelect={setScreen} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.primary }, body: { flex: 1, backgroundColor: colors.background } });
