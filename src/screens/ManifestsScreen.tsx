import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from '../components/ui/StatusBadge';
import { manifests } from '../data/mockData';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';

export function ManifestsScreen({ navigate }: { navigate: (screen: ScreenKey) => void }) {
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Pressable style={styles.primary} onPress={() => navigate('newManifest')}><Ionicons name="add" size={22} color={colors.white} /><Text style={styles.primaryText}>Criar novo romaneio</Text></Pressable>
    <Text style={styles.heading}>Romaneios em andamento</Text>
    {manifests.map((manifest) => <View style={styles.card} key={manifest.id}><View style={styles.top}><View><Text style={styles.id}>Romaneio {manifest.id}</Text><Text style={styles.meta}>{manifest.orders} pedidos • criado hoje</Text></View><StatusBadge label={manifest.status} /></View><View style={styles.progressHead}><Text style={styles.progressLabel}>Conferência</Text><Text style={styles.percent}>{manifest.progress}%</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${manifest.progress}%` }]} /></View><View style={styles.footer}><Text style={styles.units}>23 de 30 produtos conferidos</Text><Ionicons name="chevron-forward" size={19} color={colors.textMuted} /></View></View>)}
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { padding: 17, paddingBottom: 35 }, primary: { height: 53, borderRadius: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, primaryText: { color: colors.white, fontSize: 14, fontWeight: '900' }, heading: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 11 }, card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 11 }, top: { flexDirection: 'row', justifyContent: 'space-between' }, id: { color: colors.text, fontWeight: '900', fontSize: 15 }, meta: { color: colors.textMuted, fontSize: 10, marginTop: 4 }, progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 19 }, progressLabel: { color: colors.textMuted, fontSize: 11 }, percent: { color: colors.primary, fontSize: 12, fontWeight: '900' }, track: { height: 8, borderRadius: 5, backgroundColor: colors.primaryLight, marginTop: 7, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 }, footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, alignItems: 'center' }, units: { color: colors.textMuted, fontSize: 10 } });
