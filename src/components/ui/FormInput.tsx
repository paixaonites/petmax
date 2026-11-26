import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';

// ==========================================
// TIPAGEM DOS PROPS (PROPRIEDADES) DO COMPONENTE
// ==========================================
// Define todas as propriedades aceitas pelo FormInput, especificando quais são obrigatórias e quais são opcionais (?)
type Props = {
  label: string;                  // Rótulo/Título exibido acima do campo de texto
  value: string;                  // Valor atual digitado no input
  onChangeText: (value: string) => void; // Função chamada sempre que o texto é alterado
  placeholder?: string;           // Texto de dica exibido quando o input está vazio (opcional)
  keyboardType?: KeyboardTypeOptions; // Tipo de teclado a ser exibido (ex: 'numeric', 'email-address') (opcional)
  multiline?: boolean;            // Define se o input aceita múltiplas linhas (ex: para observações/descrições) (opcional)
};

// ==========================================
// COMPONENTE PRINCIPAL: FormInput
// ==========================================
// Componente reutilizável de campo de formulário contendo um rótulo (label) e um campo de entrada de texto (TextInput).
export function FormInput({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType, 
  multiline 
}: Props) {
  return (
    // Container principal que agrupa o rótulo e o input, aplicando um espaçamento automático entre eles (gap)
    <View style={styles.group}>
      
      {/* Rótulo descritivo do campo */}
      <Text style={styles.label}>{label}</Text>

      {/* Campo de entrada de texto com suporte a múltiplas linhas e tipos de teclado personalizados */}
      <TextInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor="#98A2B3" 
        keyboardType={keyboardType} 
        multiline={multiline} 
        style={[styles.input, multiline && styles.multiline]} 
      />
      
    </View>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  // Estilo do grupo que envolve o label e o input (espaçamento interno/gap)
  group: { 
    gap: 6 
  }, 

  // Estilo do texto do rótulo (cor, tamanho da fonte menor e peso forte/negrito)
  label: { 
    color: colors.text, 
    fontSize: 12, 
    fontWeight: '800' 
  },
  
  // Estilo padrão do campo de texto (altura mínima, bordas arredondadas, cor de fundo, espaçamento horizontal e cor do texto)
  input: { 
    minHeight: 50, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: colors.border, 
    backgroundColor: colors.white, 
    paddingHorizontal: 13, 
    color: colors.text, 
    fontSize: 14 
  },
  
  // Estilo aplicado condicionalmente quando o input é multiline (aumenta a altura mínima, padding superior e alinhamento do texto no topo)
  multiline: { 
    minHeight: 88, 
    paddingTop: 13, 
    textAlignVertical: 'top' 
  },
});