import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Define que o componente aceita um texto 'label' (rótulo/status) a ser exibido dentro da badge
type StatusBadgeProps = {
  label: string;
};

// ==========================================
// COMPONENTE PRINCIPAL: StatusBadge
// ==========================================
// Componente de etiqueta de status (badge) que muda de cor dinamicamente com base no texto recebido.
export function StatusBadge({ label }: StatusBadgeProps) {
  
  // Normaliza o texto para letras minúsculas para facilitar a comparação de termos
  const normalized = label.toLowerCase();
  
  // Define regras baseadas em palavras-chave para identificar se o status é de perigo/erro
  const isDanger = normalized.includes('sem') || normalized.includes('cancel');
  
  // Define regras para identificar se o status é de aviso/atenção (ex: estoque baixo, em separação)
  const isWarning = normalized.includes('baixo') || normalized.includes('separando') || normalized.includes('prepar');
  
  // Define regras para identificar se o status é de sucesso/concluído (ex: normal, pronto, finalizado)
  const isSuccess = normalized.includes('normal') || normalized.includes('pronto') || normalized.includes('finalizado') || normalized.includes('separado');
  
  // Seleciona a cor de fundo dinamicamente com base no tipo de status identificado
  const backgroundColor = isDanger 
    ? colors.accentLight 
    : isWarning 
    ? colors.warningLight 
    : isSuccess 
    ? colors.successLight 
    : colors.primaryLight;

  // Seleciona a cor do texto correspondente ao fundo para garantir contraste e legibilidade
  const color = isDanger 
    ? colors.accent 
    : isWarning 
    ? colors.warning 
    : isSuccess 
    ? colors.success 
    : colors.primary;

  return (
    // Container da badge com cantos totalmente arredondados (pílula) e cores dinâmicas aplicadas via estilo em linha
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Estilo base da badge (alinhamento automático à esquerda, formato de pílula com borderRadius 999 e espaçamentos internos)
  badge: { 
    alignSelf: 'flex-start', 
    borderRadius: 999, 
    paddingHorizontal: 10, 
    paddingVertical: 5 
  },

  // Estilo do texto interno da badge (tamanho pequeno e peso forte/negrito)
  text: { 
    fontSize: 11, 
    fontWeight: '800' 
  },
});