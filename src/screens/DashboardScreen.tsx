import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function DashboardScreen({ navigate }: { navigate: (screen: ScreenKey) => void }) {
  const { user } = useAuth();
  const { products, orders } = useData();
  const total = products.reduce((sum, product) => sum + product.quantity, 0);
  const low = products.filter((product) => product.quantity > 0 && product.quantity <= product.minimum).length;
  const out = products.filter((product) => product.quantity === 0).length;
  const shortcuts: { label: string; icon: IconName; screen: ScreenKey; red?: boolean }[] = [
    { label: 'Novo pedido', icon: 'add-circle-outline', screen: 'newOrder' },
    { label: 'Consultar estoque', icon: 'search-outline', screen: 'inventory' },
    { label: 'Ler código', icon: 'barcode-outline', screen: 'scanner' },
    { label: 'Novo romaneio', icon: 'clipboard-outline', screen: 'newManifest', red: true },
    { label: 'Entrada', icon: 'download-outline', screen: 'movements' },
  ];
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View><Text style={styles.greeting}>Olá, {user?.name.split(' ')[0]}! 👋</Text><Text style={styles.subtitle}>Aqui está o resumo da distribuidora hoje.</Text></View>
      <View style={styles.statGrid}>
        <StatCard label="Produtos cadastrados" value={String(products.length)} icon="pricetags-outline" />
        <StatCard label="Unidades em estoque" value={String(total)} icon="cube-outline" tone="green" />
        <StatCard label="Estoque baixo" value={String(low)} icon="alert-circle-outline" tone="orange" />
        <StatCard label="Sem estoque" value={String(out)} icon="close-circle-outline" tone="red" />
      </View>

      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Acesso rápido</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcuts}>
        {shortcuts.map((item) => (
          <Pressable key={item.label} style={styles.shortcut} onPress={() => navigate(item.screen)}>
            <View style={[styles.shortcutIcon, item.red && styles.shortcutIconRed]}><Ionicons name={item.icon} size={23} color={item.red ? colors.accent : colors.primary} /></View>
            <Text style={styles.shortcutText}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.alert}>
        <View style={styles.alertIcon}><Ionicons name="warning-outline" size={23} color={colors.accent} /></View>
        <View style={{ flex: 1 }}><Text style={styles.alertTitle}>Atenção ao estoque</Text><Text style={styles.alertText}>{out > 0 ? `${out} produto(s) estão sem estoque.` : low > 0 ? `${low} produto(s) estão próximos do mínimo.` : 'Todos os produtos estão com saldo saudável.'}</Text></View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>

      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Pedidos recentes</Text><Pressable onPress={() => navigate('orders')}><Text style={styles.link}>Ver todos</Text></Pressable></View>
      <View style={styles.listCard}>
        {orders.slice(0, 3).map((order, index, visibleOrders) => (
          <View key={order.id} style={[styles.order, index < visibleOrders.length - 1 && styles.divider]}>
            <View style={styles.orderIcon}><Ionicons name="receipt-outline" size={20} color={colors.primary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.orderId}>Pedido #{String(order.number).padStart(4, '0')}</Text><Text style={styles.customer} numberOfLines={1}>{order.customerName}</Text></View>
            <View style={styles.orderRight}><Text style={styles.total}>R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text><StatusBadge label={order.status.replaceAll('_', ' ')} /></View>
          </View>
        ))}
        {!orders.length && <View style={styles.noOrders}><Text style={styles.noOrdersText}>Nenhum pedido criado ainda.</Text></View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background }, content: { padding: 18, paddingBottom: 36 }, greeting: { fontSize: 24, color: colors.text, fontWeight: '900' }, subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 5 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 20 }, sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 12 }, sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900' }, link: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  shortcuts: { gap: 10, paddingRight: 10 }, shortcut: { width: 112, minHeight: 108, backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 13, justifyContent: 'space-between' }, shortcutIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, shortcutIconRed: { backgroundColor: colors.accentLight }, shortcutText: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: '700', marginTop: 12 },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 18, backgroundColor: colors.accentLight, borderWidth: 1, borderColor: '#F7CECC', marginTop: 20 }, alertIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, alertTitle: { color: colors.accent, fontWeight: '900', fontSize: 13 }, alertText: { color: '#754845', fontSize: 11, marginTop: 3 },
  listCard: { backgroundColor: colors.white, borderRadius: 19, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15 }, order: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 11 }, divider: { borderBottomWidth: 1, borderBottomColor: colors.border }, orderIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, orderId: { color: colors.text, fontSize: 13, fontWeight: '800' }, customer: { color: colors.textMuted, fontSize: 11, marginTop: 3 }, orderRight: { alignItems: 'flex-end', gap: 5 }, total: { color: colors.text, fontSize: 11, fontWeight: '800' },
  noOrders: { paddingVertical: 22, alignItems: 'center' }, noOrdersText: { color: colors.textMuted, fontSize: 12 },
});
