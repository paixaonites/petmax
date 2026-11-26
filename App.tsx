// ==========================================
// IMPORTAÇÕES DE POLIFILLS E BIBLIOTECAS
// ==========================================
// Importa polyfill para URL (necessário para compatibilidade de rede no React Native)
import 'react-native-url-polyfill/auto';
// Importa provedor de área segura para dispositivos com notch/ilha dinâmica
import 'react-native-safe-area-context';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ==========================================
// IMPORTAÇÕES DOS CONTEXTOS E COMPONENTE RAIZ
// ==========================================
import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import { RootApp } from './src/navigation/RootApp';

// ==========================================
// COMPONENTE PRINCIPAL: App (Ponto de Entrada)
// ==========================================
// Componente raiz da aplicação PetStock, responsável por envolver todo o app 
// com os provedores globais de área segura, autenticação e dados.
export default function App() {
  return (
    // Provedor de margens seguras para SafeAreaView
    <SafeAreaProvider>
      
      {/* Provedor de Autenticação (Gerencia login, token JWT e dados do usuário logado) */}
      <AuthProvider>
        
        {/* Provedor de Dados (Gerencia estoque, produtos, pedidos e sincronização) */}
        <DataProvider>
          
          {/* Barra de status do sistema com texto claro */}
          <StatusBar style="light" />
          
          {/* Componente principal de roteamento e navegação do app */}
          <RootApp />
          
        </DataProvider>
      </AuthProvider>
      
    </SafeAreaProvider>
  );
}