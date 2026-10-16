import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function StatusBadge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const isDanger = normalized.includes('sem') || normalized.includes('cancel');
  const isWarning = normalized.includes('baixo') || normalized.includes('separando') || normalized.includes('prepar');
  const isSuccess = normalized.includes('normal') || normalized.includes('pronto') || normalized.includes('finalizado') || normalized.includes('separado');
  const backgroundColor = isDanger ? colors.accentLight : isWarning ? colors.warningLight : isSuccess ? colors.successLight : colors.primaryLight;
  const color = isDanger ? colors.accent : isWarning ? colors.warning : isSuccess ? colors.success : colors.primary;
  return <View style={[styles.badge, { backgroundColor }]}><Text style={[styles.text, { color }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  text: { fontSize: 11, fontWeight: '800' },
});
