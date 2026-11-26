// ==========================================
// TIPOS DE CARGO (Role)
// ==========================================
// Define os níveis de permissão permitidos no sistema (Administrador ou Funcionário)
export type Role = 'admin' | 'employee';

// ==========================================
// TIPAGEM DE USUÁRIO (User)
// ==========================================
// Representa a estrutura de dados de um usuário autenticado no sistema
export type User = {
  id: string;       // Identificador único do usuário
  name: string;     // Nome completo
  email: string;    // E-mail de login
  role: Role;       // Cargo/permissão (admin ou employee)
  active: boolean;  // Status indicando se o cadastro está ativo
};

// ==========================================
// CHAVES DE TELA (ScreenKey)
// ==========================================
// Lista literal de todas as chaves/rotas de telas suportadas pela navegação do aplicativo
export type ScreenKey =
  | 'dashboard'
  | 'inventory'
  | 'products'
  | 'scanner'
  | 'movements'
  | 'history'
  | 'customers'
  | 'orders'
  | 'newOrder'
  | 'manifests'
  | 'newManifest'
  | 'employees'
  | 'reports'
  | 'profile'
  | 'settings';

// ==========================================
// STATUS DE ESTOQUE (ProductStatus)
// ==========================================
// Classificação do nível de estoque de um produto
export type ProductStatus = 'normal' | 'low' | 'out';

// ==========================================
// TIPAGEM DE PRODUTO (Product)
// ==========================================
// Estrutura completa de um produto cadastrado no catálogo e estoque da distribuidora
export type Product = {
  id: string;         // ID único
  name: string;       // Nome descritivo (ex: ração, areia)
  brand: string;      // Marca do produto
  category: string;   // Categoria (ex: Cães, Gatos, Higiene)
  weight: string;     // Peso ou volumetria (ex: 15 kg)
  unit: string;       // Unidade de medida (ex: UN)
  code: string;       // Código interno de referência
  barcode: string;    // Código de barras (EAN)
  quantity: number;   // Quantidade física atual em estoque
  minimum: number;    // Estoque mínimo de segurança
  reserved: number;   // Quantidade reservada por pedidos em andamento
  price: number;      // Preço de venda unitário
  active: boolean;    // Se o produto está ativo no catálogo
};

// ==========================================
// TIPAGEM DE CLIENTE (Customer)
// ==========================================
// Representa os dados básicos de um cliente (pet shop ou distribuidor parceiro)
export type Customer = {
  id: string;         // ID único
  name: string;       // Nome / Razão social
  document: string;   // CNPJ ou CPF
  phone: string;      // Telefone de contato
  city: string;       // Cidade de localização
};

// ==========================================
// TIPAGEM DE PEDIDO (Order)
// ==========================================
// Representa um pedido de venda realizado dentro do sistema
export type Order = {
  id: string;           // ID único
  number: number;       // Número sequencial legível do pedido
  customerName: string; // Nome do cliente associado
  total: number;        // Valor financeiro total do pedido
  status: string;       // Status atual (ex: Novo, Separando, Finalizado)
  createdAt: string;    // Data e hora de criação
};

// ==========================================
// TIPAGEM DE ROMANEIO (Manifest)
// ==========================================
// Representa um romaneio/carga de separação e expedição de pedidos
export type Manifest = {
  id: string;           // ID único
  number: number;       // Número sequencial legível do romaneio
  ordersCount: number;  // Quantidade de pedidos agrupados
  totalItems: number;   // Quantidade total de unidades/itens a conferir
  checkedItems: number; // Quantidade já conferida
  progress: number;     // Percentual de progresso (0 a 100)
  status: string;       // Status atual do romaneio
  createdAt: string;    // Data e hora de criação
};

// ==========================================
// TIPAGEM DE MOVIMENTAÇÃO DE ESTOQUE (InventoryMovement)
// ==========================================
// Registro detalhado de auditoria de alterações no estoque (entradas, saídas, ajustes)
export type InventoryMovement = {
  id: string;           // ID único
  productName: string;  // Nome do produto movimentado
  type: string;         // Tipo de operação (entrada, saida, ajuste, devolucao, perda)
  quantityDelta: number;// Variação na quantidade (positivo ou negativo)
  balanceAfter: number; // Saldo resultante no estoque após a operação
  reason: string;       // Motivo informado pelo operador
  employeeName: string; // Nome do funcionário responsável pela ação
  createdAt: string;    // Data e hora do registro
};

// ==========================================
// TIPAGEM DE ENTRADA PARA NOVO PRODUTO (ProductInput)
// ==========================================
// Dados necessários enviados ao cadastrar um novo produto no sistema
export type ProductInput = {
  name: string;         // Nome do produto
  internalCode: string; // Código interno
  barcode?: string;     // Código de barras (opcional)
  brand: string;        // Marca
  category: string;     // Categoria
  weight: string;       // Peso
  unit: string;         // Unidade
  price: number;        // Preço unitário
  minimumStock: number; // Estoque mínimo
  initialStock: number; // Saldo de quantidade inicial
};

// ==========================================
// TIPAGEM DE EDIÇÃO DE PRODUTO (ProductUpdateInput)
// ==========================================
// Dados aceitos ao editar um produto já existente (sem alterar estoque inicial diretamente)
export type ProductUpdateInput = Omit<ProductInput, 'initialStock'>;

// ==========================================
// TIPAGEM DE ENTRADA PARA NOVO CLIENTE (CustomerInput)
// ==========================================
// Dados aceitos ao cadastrar um novo cliente
export type CustomerInput = {
  name: string;       // Nome / Razão social
  document?: string;  // Documento (opcional)
  phone?: string;     // Telefone (opcional)
  city?: string;      // Cidade (opcional)
};