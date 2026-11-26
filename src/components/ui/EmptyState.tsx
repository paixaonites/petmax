import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Define que o componente aceita obrigatoriamente um 'title' e uma 'description', ambos do tipo texto (string).
type EmptyStateProps = {
  title: string;
  description: string;
};

// ==========================================
// COMPONENTE PRINCIPAL: EmptyState
// ==========================================
// Este componente é utilizado para exibir um estado vazio na interface (ex: quando uma busca não retorna resultados).
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    // Container principal que centraliza o conteúdo, aplica margens internas, fundo branco e bordas arredondadas.
    <View style={styles.wrap}>
      
      {/* Container circular/arredondado que abriga o ícone de busca */}
      <View style={styles.icon}>
        <Ionicons name="search-outline" size={27} color={colors.primary} />
      </View>

      {/* Título principal do estado vazio (em destaque) */}
      <Text style={styles.title}>{title}</Text>

      {/* Descrição detalhada orientando o usuário sobre o que aconteceu ou o que fazer */}
      <Text style={styles.description}>{description}</Text>

    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Estilo do container geral do componente (espaçamento interno, alinhamento central, fundo e bordas)
  wrap: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Estilo do bloco que envolve o ícone (tamanho fixo, formato arredondado, cor de fundo clara e centralização)
  icon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  // Estilo do título (cor do texto, tamanho da fonte e peso forte/negrito)
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },

  // Estilo da descrição (cor mais suave, fonte menor, centralizada e com espaçamento superior e entre linhas)
  description: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
});