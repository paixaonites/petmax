import 'react-native-url-polyfill/auto';
import 'react-native-safe-area-context';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import { RootApp } from './src/navigation/RootApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="light" />
          <RootApp />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
