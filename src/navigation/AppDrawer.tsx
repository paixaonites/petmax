import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type Item = { key: ScreenKey; label: string; icon: IconName; adminOnly?: boolean };

const items: Item[] = [
  { key: 'dashboard', label: 'Início', icon: 'grid-outline' },
  { key: 'inventory', label: 'Estoque', icon: 'cube-outline' },
  { key: 'products', label: 'Produtos', icon: 'pricetags-outline' },
  { key: 'orders', label: 'Pedidos', icon: 'cart-outline' },
  { key: 'manifests', label: 'Romaneios', icon: 'clipboard-outline' },
  { key: 'customers', label: 'Clientes', icon: 'people-outline' },
  { key: 'movements', label: 'Movimentações', icon: 'swap-horizontal-outline' },
  { key: 'employees', label: 'Funcionários', icon: 'id-card-outline', adminOnly: true },
  { key: 'reports', label: 'Relatórios', icon: 'bar-chart-outline', adminOnly: true },
  { key: 'profile', label: 'Perfil', icon: 'person-circle-outline' },
  { key: 'settings', label: 'Configurações', icon: 'settings-outline' },
];

type Props = { visible: boolean; active: ScreenKey; onClose: () => void; onSelect: (key: ScreenKey) => void };

export function AppDrawer({ visible, active, onClose, onSelect }: Props) {
  const { user, signOut } = useAuth();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modal}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <SafeAreaView style={styles.drawer} edges={['top', 'bottom']}>
          <View style={styles.brand}>
            <View style={styles.logo}><Ionicons name="paw" size={25} color={colors.white} /></View>
            <View><Text style={styles.brandName}>PetStock</Text><Text style={styles.brandSub}>Gestão interna</Text></View>
            <Pressable style={styles.close} onPress={onClose}><Ionicons name="close" size={22} color={colors.textMuted} /></Pressable>
          </View>
          <View style={styles.userCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name.slice(0, 2).toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.userName}>{user?.name}</Text><Text style={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</Text></View>
            <View style={styles.online} />
          </View>
          <ScrollView contentContainerStyle={styles.items} showsVerticalScrollIndicator={false}>
            <Text style={styles.section}>NAVEGAÇÃO</Text>
            {items.filter((item) => !item.adminOnly || user?.role === 'admin').map((item) => {
              const selected = item.key === active;
              return (
                <Pressable key={item.key} style={[styles.item, selected && styles.itemActive]} onPress={() => { onSelect(item.key); onClose(); }}>
                  <Ionicons name={item.icon} size={21} color={selected ? colors.primary : colors.textMuted} />
                  <Text style={[styles.itemText, selected && styles.itemTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.logout} onPress={signOut}><Ionicons name="log-out-outline" size={21} color={colors.accent} /><Text style={styles.logoutText}>Sair da conta</Text></Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, flexDirection: 'row' }, backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  drawer: { width: '84%', maxWidth: 340, backgroundColor: colors.white, height: '100%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 14 },
  brand: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { width: 45, height: 45, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  brandName: { fontSize: 19, fontWeight: '900', color: colors.dark }, brandSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  close: { marginLeft: 'auto', width: 38, height: 38, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  userCard: { margin: 16, padding: 13, borderRadius: 17, backgroundColor: colors.primaryLight, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.white, fontWeight: '900' },
  userName: { fontSize: 14, fontWeight: '800', color: colors.text }, userRole: { fontSize: 11, color: colors.primary, marginTop: 2, fontWeight: '600' }, online: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success },
  items: { paddingHorizontal: 13, paddingBottom: 18 }, section: { fontSize: 10, fontWeight: '800', color: '#9AA4B5', letterSpacing: 1, margin: 9 },
  item: { height: 47, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, marginBottom: 2 }, itemActive: { backgroundColor: colors.primaryLight },
  itemText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' }, itemTextActive: { color: colors.primary, fontWeight: '800' },
  logout: { margin: 15, borderTopWidth: 1, borderTopColor: colors.border, height: 52, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13 }, logoutText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
});
