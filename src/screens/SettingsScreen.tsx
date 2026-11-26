import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme/colors';

// ==========================================
// COMPONENTE PRINCIPAL: SettingsScreen
// ==========================================
// Tela de configurações e preferências do aplicativo (notificações, sons, biometria e informações da versão).
export function SettingsScreen() {
  // Estados locais para controlar as opções de preferências do usuário
  const [notifications, setNotifications] = useState(true); 
  const [sound, setSound] = useState(true); 
  const [biometrics, setBiometrics] = useState(false);

  // Lista de itens de configuração com chaves, rótulos, ícones e estados vinculados
  const preferenceItems = [
    { label: 'Notificações internas', description: 'Alertas de estoque e pedidos', icon: 'notifications-outline' as const, value: notifications, set: setNotifications },
    { label: 'Sons e feedback', description: 'Som ao confirmar operações', icon: 'volume-high-outline' as const, value: sound, set: setSound },
    { label: 'Entrada por biometria', description: 'Usar a segurança do aparelho', icon: 'finger-print-outline' as const, value: biometrics, set: setBiometrics },
  ];

  return (
    <View style={styles.page}>
      
      {/* Seção de Preferências */}
      <Text style={styles.heading}>Preferências do aplicativo</Text>
      
      {preferenceItems.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={styles.icon}>
            <Ionicons name={item.icon} size={21} color={colors.primary} />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          
          {/* Chave seletora (Switch) para alternar o estado da preferência */}
          <Switch 
            value={item.value} 
            onValueChange={item.set} 
            trackColor={{ false: '#D7DDE6', true: '#8EB3F3' }} 
            thumbColor={item.value ? colors.primary : colors.white} 
          />
        </View>
      ))}

      {/* Seção Informações do Aplicativo */}
      <Text style={styles.heading}>Aplicativo</Text>
      
      <Pressable style={styles.row}>
        <View style={styles.icon}>
          <Ionicons name="information-circle-outline" size={21} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Sobre o PetStock</Text>
          <Text style={styles.description}>Versão 2.0.0 • Supabase conectado</Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={colors.textMuted} />
      </Pressable>

    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({ 
  page: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 17 
  }, 
  heading: { 
    color: colors.text, 
    fontSize: 16, 
    fontWeight: '900', 
    marginTop: 8, 
    marginBottom: 11 
  }, 
  row: { 
    minHeight: 72, 
    backgroundColor: colors.white, 
    borderRadius: 17, 
    borderWidth: 1, 
    borderColor: colors.border, 
    padding: 13, 
    marginBottom: 9, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  }, 
  icon: { 
    width: 42, 
    height: 42, 
    borderRadius: 13, 
    backgroundColor: colors.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }, 
  label: { 
    color: colors.text, 
    fontSize: 13, 
    fontWeight: '800' 
  }, 
  description: { 
    color: colors.textMuted, 
    fontSize: 10, 
    marginTop: 4 
  },
});