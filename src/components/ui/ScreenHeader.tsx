import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Define as propriedades aceitas pelo cabeçalho da tela (ScreenHeader)
type Props = {
  title: string;                 // Título principal exibido no cabeçalho (obrigatório)
  subtitle?: string;             // Subtítulo descritivo exibido abaixo do título (opcional)
  onMenu: () => void;            // Função acionada ao clicar no botão de menu (obrigatório)
  onNotifications?: () => void;  // Função acionada ao clicar no botão de notificações (opcional)
};

// ==========================================
// COMPONENTE PRINCIPAL: ScreenHeader
// ==========================================
// Componente de cabeçalho padrão para as telas, contendo botão de menu, título/subtítulo e botão de notificações com indicador (ponto vermelho).
export function ScreenHeader({ title, subtitle, onMenu, onNotifications }: Props) {
  return (
    // Container principal do cabeçalho em linha (flexDirection: row), com altura fixa, cor primária e espaçamento
    <View style={styles.header}>
      
      {/* Botão interativo do menu lateral */}
      <Pressable style={styles.iconButton} onPress={onMenu} accessibilityLabel="Abrir menu">
        <Ionicons name="menu" size={25} color={colors.white} />
      </Pressable>

      {/* Área central contendo o título e o subtítulo */}
      <View style={styles.titleArea}>
        <Text style={styles.title}>{title}</Text>
        {/* Renderização condicional: exibe o subtítulo apenas se ele for informado */}
        {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>

      {/* Botão interativo de notificações (contém também um ponto indicador de alerta) */}
      <Pressable style={styles.iconButton} onPress={onNotifications} accessibilityLabel="Notificações">
        <Ionicons name="notifications-outline" size={23} color={colors.white} />
        {/* Ponto indicador de notificações não lidas */}
        <View style={styles.dot} />
      </Pressable>

    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Estilo do container geral do cabeçalho (altura, preenchimento lateral, cor de fundo primária e alinhamento)
  header: { 
    height: 76, 
    paddingHorizontal: 16, 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 13 
  },

  // Estilo dos botões de ícone (largura, altura fixa, bordas arredondadas e fundo semitransparente)
  iconButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: 'rgba(255,255,255,0.13)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  // Área flexível reservada para os textos (ocupa o espaço disponível entre os botões)
  titleArea: { 
    flex: 1 
  },

  // Estilo do título principal (cor branca, tamanho grande e peso forte/negrito)
  title: { 
    color: colors.white, 
    fontSize: 20, 
    fontWeight: '800' 
  },

  // Estilo do subtítulo (cor azul claro/suave, tamanho menor e margem superior)
  subtitle: { 
    color: '#D5E3FF', 
    fontSize: 12, 
    marginTop: 2 
  },

  // Estilo do ponto indicador de notificação (posicionado absolutamente no canto superior direito do botão)
  dot: { 
    position: 'absolute', 
    right: 10, 
    top: 9, 
    width: 7, 
    height: 7, 
    borderRadius: 4, 
    backgroundColor: '#FF6B66', 
    borderWidth: 1.5, 
    borderColor: colors.primary 
  },
});