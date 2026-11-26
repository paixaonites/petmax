import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Extrai automaticamente os nomes de ícones válidos da biblioteca @expo/vector-icons para o Ionicons
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Define as propriedades aceitas pelo componente StatCard (cartão de estatística/métrica)
type StatCardProps = {
  label: string;                                    // Rótulo descritivo da estatística (ex: "Total de Vendas")
  value: string;                                    // Valor numérico ou texto principal exibido em destaque (ex: "152")
  icon: IconName;                                   // Nome do ícone do Ionicons a ser exibido no cartão
  tone?: 'blue' | 'red' | 'orange' | 'green';       // Tema de cores do ícone e fundo (opcional, padrão é 'blue')
};

// ==========================================
// COMPONENTE PRINCIPAL: StatCard
// ==========================================
// Componente de cartão visualizado no dashboard para exibir métricas importantes com ícones coloridos baseados em 'tone'.
export function StatCard({ label, value, icon, tone = 'blue' }: StatCardProps) {
  
  // Mapeia o tom escolhido (tone) para um par de cores: [Cor de Fundo do Ícone, Cor do Ícone]
  const palette = {
    blue: [colors.primaryLight, colors.primary],
    red: [colors.accentLight, colors.accent],
    orange: [colors.warningLight, colors.warning],
    green: [colors.successLight, colors.success],
  }[tone];

  return (
    // Container principal do cartão com fundo branco, bordas arredondadas e sombra sutil
    <View style={styles.card}>
      
      {/* Container dinâmico do ícone (aplica a cor de fundo com base na paleta selecionada) */}
      <View style={[styles.icon, { backgroundColor: palette[0] }]}>
        <Ionicons name={icon} size={22} color={palette[1]} />
      </View>

      {/* Valor principal da estatística em destaque (fonte grande e negrito forte) */}
      <Text style={styles.value}>{value}</Text>

      {/* Rótulo descritivo logo abaixo do valor */}
      <Text style={styles.label}>{label}</Text>

    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Estilo do cartão geral (flexível, largura mínima, fundo branco, bordas arredondadas, espaçamento interno e sombra para Android/iOS)
  card: { 
    flex: 1, 
    minWidth: 145, 
    backgroundColor: colors.white, 
    borderRadius: 18, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: colors.border, 
    shadowColor: colors.dark, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 3 }, 
    elevation: 2 
  },

  // Estilo do bloco que envolve o ícone (tamanho fixo, bordas arredondadas e centralização)
  icon: { 
    width: 40, 
    height: 40, 
    borderRadius: 13, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },

  // Estilo do texto do valor numérico (cor escura, tamanho grande e peso extra-bold)
  value: { 
    color: colors.text, 
    fontSize: 24, 
    fontWeight: '900' 
  },

  // Estilo do rótulo/descrição (cor suave, tamanho menor, margem superior e altura de linha ajustada)
  label: { 
    color: colors.textMuted, 
    fontSize: 12, 
    marginTop: 3, 
    lineHeight: 17 
  },
});