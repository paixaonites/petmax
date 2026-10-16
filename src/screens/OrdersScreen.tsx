import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';

export function OrdersScreen({ navigate }: { navigate: (screen: ScreenKey) => void }) {
  const { orders } = useData();
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Pressable style={styles.primary} onPress={() => navigate('newOrder')}><Ionicons name="add" size={22} color={colors.white} /><Text style={styles.primaryText}>Criar novo pedido</Text></Pressable>
      <View style={styles.tabs}><View style={styles.tabActive}><Text style={styles.tabActiveText}>Todos</Text></View><Text style={styles.tab}>Novos</Text><Text style={styles.tab}>Separando</Text><Text style={styles.tab}>Finalizados</Text></View>
      <Text style={styles.heading}>Pedidos recentes</Text>
      {orders.map((order) => <View key={order.id} style={styles.card}><View style={styles.top}><View><Text style={styles.id}>Pedido #{String(order.number).padStart(4, '0')}</Text><Text style={styles.date}>{new Date(order.createdAt).toLocaleString('pt-BR')}</Text></View><StatusBadge label={order.status.replaceAll('_', ' ')} /></View><View style={styles.customer}><Ionicons name="storefront-outline" size={18} color={colors.primary} /><Text style={styles.customerText}>{order.customerName}</Text></View><View style={styles.bottom}><Text style={styles.items}>Estoque reservado</Text><Text style={styles.total}>R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text></View></View>)}
      {!orders.length && <View style={styles.empty}><Ionicons name="receipt-outline" size={31} color={colors.primary} /><Text style={styles.emptyTitle}>Nenhum pedido ainda</Text><Text style={styles.emptyText}>Crie o primeiro pedido pelo botão acima.</Text></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background }, content: { padding: 17, paddingBottom: 35 }, primary: { height: 53, borderRadius: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, primaryText: { color: colors.white, fontSize: 14, fontWeight: '900' }, tabs: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16 }, tabActive: { backgroundColor: colors.primaryLight, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 99 }, tabActiveText: { color: colors.primary, fontWeight: '800', fontSize: 11 }, tab: { color: colors.textMuted, fontWeight: '600', fontSize: 11 }, heading: { color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: 11 }, card: { backgroundColor: colors.white, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: colors.border, marginBottom: 10 }, top: { flexDirection: 'row', justifyContent: 'space-between' }, id: { color: colors.text, fontSize: 14, fontWeight: '900' }, date: { color: colors.textMuted, fontSize: 10, marginTop: 3 }, customer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 15 }, customerText: { color: colors.text, fontSize: 13, fontWeight: '600' }, bottom: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }, items: { color: colors.textMuted, fontSize: 10 }, total: { color: colors.primary, fontWeight: '900', fontSize: 13 },
  empty: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 28 }, emptyTitle: { color: colors.text, fontWeight: '900', marginTop: 10 }, emptyText: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
});
