import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
};

export function FormInput({ label, value, onChangeText, placeholder, keyboardType, multiline }: Props) {
  return <View style={styles.group}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#98A2B3" keyboardType={keyboardType} multiline={multiline} style={[styles.input, multiline && styles.multiline]} /></View>;
}

const styles = StyleSheet.create({
  group: { gap: 6 }, label: { color: colors.text, fontSize: 12, fontWeight: '800' },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 13, color: colors.text, fontSize: 14 },
  multiline: { minHeight: 88, paddingTop: 13, textAlignVertical: 'top' },
});
