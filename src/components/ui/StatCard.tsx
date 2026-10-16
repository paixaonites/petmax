import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function StatCard({ label, value, icon, tone = 'blue' }: { label: string; value: string; icon: IconName; tone?: 'blue' | 'red' | 'orange' | 'green' }) {
  const palette = {
    blue: [colors.primaryLight, colors.primary],
    red: [colors.accentLight, colors.accent],
    orange: [colors.warningLight, colors.warning],
    green: [colors.successLight, colors.success],
  }[tone];
  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: palette[0] }]}>
        <Ionicons name={icon} size={22} color={palette[1]} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 145, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.dark, shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  value: { color: colors.text, fontSize: 24, fontWeight: '900' },
  label: { color: colors.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 },
});
