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
import { NewOrderScreen } from '../screens/NewOrderScreen';
import { EmployeesScreen } from '../screens/EmployeesScreen';

// ==========================================
// TIPAGENS (TYPES)
// ==========================================
// Extrai os nomes de ícones válidos do Ionicons
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Define a estrutura de configuração para as telas genéricas (módulos)
type ModuleConfig = { 
  title: string;          // Título principal do módulo
  subtitle: string;       // Subtítulo descritivo
  description: string;    // Texto explicativo sobre a funcionalidade
  icon: IconName;         // Ícone representativo
  action?: string;        // Texto de um botão de ação principal (opcional)
  features: string[];     // Lista de recursos/funcionalidades do módulo
};

// ==========================================
// CONFIGURAÇÕES DOS MÓDULOS GENÉRICOS
// ==========================================
// Mapeia chaves de tela específicas para suas respectivas configurações e descrições detalhadas
const moduleConfigs: Partial<Record<ScreenKey, ModuleConfig>> = {
  products: { 
    title: 'Produtos', 
    subtitle: 'Catálogo da distribuidora', 
    description: 'Cadastre e organize rações, acessórios e produtos por marca e categoria.', 
    icon: 'pricetags-outline', 
    action: 'Cadastrar produto', 
    features: ['Cadastro com foto, preço, peso e código de barras', 'Categorias, marcas e estoque mínimo', 'Edição e desativação com controle de permissão'] 
  },
  scanner: { 
    title: 'Leitor de código', 
    subtitle: 'Localização rápida', 
    description: 'Use a câmera para encontrar produtos e registrar operações sem digitação.', 
    icon: 'barcode-outline', 
    action: 'Abrir câmera', 
    features: ['Leitura de EAN e códigos compatíveis', 'Entrada ou saída após leitura', 'Aviso para códigos ainda não cadastrados'] 
  },
  movements: { 
    title: 'Movimentações', 
    subtitle: 'Entradas, saídas e ajustes', 
    description: 'Registre toda alteração de estoque com motivo, responsável e horário.', 
    icon: 'swap-horizontal-outline', 
    action: 'Nova movimentação', 
    features: ['Entrada, saída, ajuste, devolução e perda', 'Validação de quantidade disponível', 'Histórico automático e não apagável'] 
  },
  history: { 
    title: 'Histórico', 
    subtitle: 'Auditoria de ações', 
    description: 'Consulte quem fez cada operação e quando ela aconteceu.', 
    icon: 'time-outline', 
    features: ['Filtro por funcionário e período', 'Antes e depois de alterações', 'Registro protegido para administradores'] 
  },
  newOrder: { 
    title: 'Novo pedido', 
    subtitle: 'Carrinho interno', 
    description: 'Selecione o cliente, inclua produtos e confirme o estoque antes de finalizar.', 
    icon: 'cart-outline', 
    action: 'Selecionar cliente', 
    features: ['Pesquisa e inclusão por código de barras', 'Quantidade, preço unitário e subtotal', 'Reserva segura do estoque ao confirmar'] 
  },
  newManifest: { 
    title: 'Novo romaneio', 
    subtitle: 'Separação e conferência', 
    description: 'Agrupe pedidos prontos e consolide automaticamente as quantidades.', 
    icon: 'clipboard-outline', 
    action: 'Selecionar pedidos', 
    features: ['Agrupamento de produtos repetidos', 'Conferência por botão ou código de barras', 'Progresso e finalização somente em 100%'] 
  },
  reports: { 
    title: 'Relatórios', 
    subtitle: 'Indicadores operacionais', 
    description: 'Acompanhe movimentações, pedidos, romaneios e alertas de estoque.', 
    icon: 'bar-chart-outline', 
    features: ['Filtros por data e tipo de operação', 'Produtos mais movimentados', 'Resumo de entradas, saídas e cancelamentos'] 
  },
  profile: { 
    title: 'Perfil', 
    subtitle: 'Sua conta', 
    description: 'Consulte seus dados e as permissões disponíveis para sua função.', 
    icon: 'person-circle-outline', 
    features: ['Dados pessoais e contato', 'Função e nível de acesso', 'Alteração segura de senha'] 
  },
};

// ==========================================
// TÍTULOS DO CABEÇALHO POR TELA
// ==========================================
// Dicionário que traduz a chave da tela atual em um par [Título, Subtítulo] exibido no ScreenHeader
const headerTitles: Record<ScreenKey, [string, string]> = {
  dashboard: ['Visão geral', 'Painel operacional'], 
  inventory: ['Estoque', 'Consulta em tempo real'], 
  products: ['Produtos', 'Catálogo da distribuidora'], 
  scanner: ['Leitor', 'Código de barras'], 
  movements: ['Movimentações', 'Controle de estoque'], 
  history: ['Histórico', 'Auditoria de ações'], 
  customers: ['Clientes', 'Cadastro e consulta'], 
  orders: ['Pedidos', 'Venda interna'], 
  newOrder: ['Novo pedido', 'Carrinho interno'], 
  manifests: ['Romaneios', 'Separação e conferência'], 
  newManifest: ['Novo romaneio', 'Agrupar pedidos'], 
  employees: ['Funcionários', 'Acesso administrativo'], 
  reports: ['Relatórios', 'Indicadores operacionais'], 
  profile: ['Perfil', 'Sua conta'], 
  settings: ['Configurações', 'Preferências do aplicativo'],
};

// ==========================================
// COMPONENTE PRINCIPAL: RootApp
// ==========================================
// Componente raiz que gerencia o roteamento de telas da aplicação, o estado do menu lateral (Drawer) e a autenticação.
export function RootApp() {
  const { user } = useAuth();
  
  // Estado que controla qual tela está sendo exibida no momento (padrão é o dashboard)
  const [screen, setScreen] = useState<ScreenKey>('dashboard');
  
  // Estado que controla se o menu lateral (drawer) está visível ou fechado
  const [drawer, setDrawer] = useState(false);

  // Memoriza e renderiza dinamicamente o componente da tela atual com base no estado 'screen'
  const content = useMemo(() => {
    if (screen === 'dashboard') return <DashboardScreen navigate={setScreen} />;
    if (screen === 'inventory') return <InventoryScreen />;
    if (screen === 'products') return <ProductsScreen />;
    if (screen === 'movements') return <MovementsScreen />;
    if (screen === 'orders') return <OrdersScreen navigate={setScreen} />;
    if (screen === 'newOrder') return <NewOrderScreen navigate={setScreen} />;
    if (screen === 'manifests') return <ManifestsScreen navigate={setScreen} />;
    if (screen === 'settings') return <SettingsScreen />;
    
    // Se a tela for genérica, busca a configuração correspondente
    const config = moduleConfigs[screen];
    return config ? <GenericModuleScreen {...config} /> : null;
  }, [screen]);

  // Se o usuário não estiver autenticado, exibe imediatamente a tela de login
  if (!user) return <LoginScreen />;

  // Recupera o título e subtítulo correspondentes à tela ativa
  const [title, subtitle] = headerTitles[screen];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      
      {/* Cabeçalho superior com botão para abrir o menu lateral */}
      <ScreenHeader 
        title={title} 
        subtitle={subtitle} 
        onMenu={() => setDrawer(true)} 
      />

      {/* Corpo principal onde o conteúdo da tela ativa é renderizado */}
      <View style={styles.body}>
        {content}
      </View>

      {/* Menu lateral deslizante (Drawer) */}
      <AppDrawer 
        visible={drawer} 
        active={screen} 
        onClose={() => setDrawer(false)} 
        onSelect={setScreen} 
      />
      
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: colors.primary 
  }, 
  body: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
});