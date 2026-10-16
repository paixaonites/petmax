import { Product } from '../types';

export const products: Product[] = [
  { id: '1', name: 'Golden Adultos Frango', brand: 'Golden', weight: '15 kg', unit: 'UN', code: '001', barcode: '7890000000017', quantity: 37, minimum: 10, reserved: 5, price: 149.9, category: 'Cães', active: true },
  { id: '2', name: 'Premier Filhotes', brand: 'Premier', weight: '10,1 kg', unit: 'UN', code: '002', barcode: '7890000000024', quantity: 8, minimum: 12, reserved: 2, price: 172.5, category: 'Cães', active: true },
  { id: '3', name: 'GranPlus Gatos Castrados', brand: 'GranPlus', weight: '10,1 kg', unit: 'UN', code: '003', barcode: '7890000000031', quantity: 0, minimum: 8, reserved: 0, price: 165.0, category: 'Gatos', active: true },
  { id: '4', name: 'Areia Higiênica Pipicat', brand: 'Pipicat', weight: '4 kg', unit: 'UN', code: '004', barcode: '7890000000048', quantity: 54, minimum: 15, reserved: 10, price: 17.9, category: 'Higiene', active: true },
  { id: '5', name: 'Special Dog Prime', brand: 'Special Dog', weight: '15 kg', unit: 'UN', code: '005', barcode: '7890000000055', quantity: 11, minimum: 10, reserved: 4, price: 126.9, category: 'Cães', active: true },
];

export const recentOrders = [
  { id: '#1058', customer: 'Pet Shop Amigo Fiel', total: 1840.5, status: 'Separando' },
  { id: '#1057', customer: 'Mundo Animal', total: 976.8, status: 'Novo' },
  { id: '#1056', customer: 'Casa das Rações', total: 2314.9, status: 'Separado' },
];

export const manifests = [
  { id: '#032', orders: 4, progress: 76, status: 'Separando' },
  { id: '#031', orders: 6, progress: 100, status: 'Pronto' },
  { id: '#030', orders: 3, progress: 100, status: 'Finalizado' },
];
