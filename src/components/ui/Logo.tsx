import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Define que o componente aceita opcionalmente um parâmetro 'compact' (booleano) para alternar o modo de exibição.
type LogoProps = {
  compact?: boolean; // Se true, exibe uma versão menor do logo (sem o nome e subtítulo, ideal para cabeçalhos reduzidos)
};

// ==========================================
// COMPONENTE PRINCIPAL: Logo
// ==========================================
// Componente que exibe a marca/logotipo da aplicação (ícone de pata e opcionalmente o nome e subtítulo da distribuidora).
export function Logo({ compact = false }: LogoProps) {
  return (
    // Container principal em linha (flexDirection: row) que alinha o ícone e os textos horizontalmente
    <View style={styles.row}>
      
      {/* Bloco do ícone (pata): altera o tamanho e o arredondamento se a prop 'compact' for verdadeira */}
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Ionicons name="paw" size={compact ? 22 : 32} color={colors.white} />
      </View>

      {/* Renderização condicional: se 'compact' for falso, exibe o nome e o subtítulo ao lado do ícone */}
      {!compact && (
        <View>
          <Text style={styles.name}>SouzaPet</Text>
          <Text style={styles.subtitle}>Gestão da distribuidora</Text>
        </View>
      )}

    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Organiza o layout em linha com um espaçamento padrão (gap) de 12 pixels entre os elementos internos
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },

  // Estilo padrão do ícone (tamanho fixo de 56x56, bordas arredondadas e cor de fundo primária)
  mark: { 
    width: 56, 
    height: 56, 
    borderRadius: 18, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  // Modificação de estilo para o modo compacto (reduz as dimensões para 42x42 e o raio da borda)
  markCompact: { 
    width: 42, 
    height: 42, 
    borderRadius: 13 
  },

  // Estilo do nome principal da marca ("SouzaPet") com cor escura, tamanho grande e peso máximo (bold/extra-bold)
  name: { 
    color: colors.dark, 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: -0.5 
  },

  // Estilo do subtítulo descritivo ("Gestão da distribuidora") com cor mais suave e tamanho menor
  subtitle: { 
    color: colors.textMuted, 
    fontSize: 12, 
    marginTop: 1 
  },
});