import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}><Ionicons name="search-outline" size={27} color={colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 32, alignItems: 'center', backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  icon: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  description: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
});
