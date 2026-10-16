import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  title: string;
  subtitle?: string;
  onMenu: () => void;
  onNotifications?: () => void;
};

export function ScreenHeader({ title, subtitle, onMenu, onNotifications }: Props) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.iconButton} onPress={onMenu} accessibilityLabel="Abrir menu">
        <Ionicons name="menu" size={25} color={colors.white} />
      </Pressable>
      <View style={styles.titleArea}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>
      <Pressable style={styles.iconButton} onPress={onNotifications} accessibilityLabel="Notificações">
        <Ionicons name="notifications-outline" size={23} color={colors.white} />
        <View style={styles.dot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 76, paddingHorizontal: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 13 },
  iconButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  titleArea: { flex: 1 },
  title: { color: colors.white, fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#D5E3FF', fontSize: 12, marginTop: 2 },
  dot: { position: 'absolute', right: 10, top: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF6B66', borderWidth: 1.5, borderColor: colors.primary },
});
