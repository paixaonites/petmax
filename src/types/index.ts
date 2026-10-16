export type Role = 'admin' | 'employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

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

export type ProductStatus = 'normal' | 'low' | 'out';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  weight: string;
  unit: string;
  code: string;
  barcode: string;
  quantity: number;
  minimum: number;
  reserved: number;
  price: number;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string;
  city: string;
};

export type Order = {
  id: string;
  number: number;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
};

export type InventoryMovement = {
  id: string;
  productName: string;
  type: string;
  quantityDelta: number;
  balanceAfter: number;
  reason: string;
  employeeName: string;
  createdAt: string;
};

export type ProductInput = {
  name: string;
  internalCode: string;
  barcode?: string;
  brand: string;
  category: string;
  weight: string;
  unit: string;
  price: number;
  minimumStock: number;
  initialStock: number;
};

export type CustomerInput = {
  name: string;
  document?: string;
  phone?: string;
  city?: string;
};
