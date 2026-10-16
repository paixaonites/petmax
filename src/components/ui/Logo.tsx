import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Ionicons name="paw" size={compact ? 22 : 32} color={colors.white} />
      </View>
      {!compact && (
        <View>
          <Text style={styles.name}>PetStock</Text>
          <Text style={styles.subtitle}>Gestão da distribuidora</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  markCompact: { width: 42, height: 42, borderRadius: 13 },
  name: { color: colors.dark, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
});
