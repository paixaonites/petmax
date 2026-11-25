import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';
import { ScreenKey } from '../types';

export function NewOrderScreen({ navigate }: { navigate: (screen: ScreenKey) => void }) {
  const { products, createOrder } = useData();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const totalItems = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const total = useMemo(() => products.reduce((sum, product) => sum + (quantities[product.id] ?? 0) * product.price, 0), [products, quantities]);

  function change(productId: string, difference: number, available: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, Math.min(available, (current[productId] ?? 0) + difference))
    }));
  }

  async function finish() {
    if (!totalItems) return Alert.alert('Adicione ao menos um produto');
    setSaving(true);
    try {
      // Passando uma string vazia ou ID padrão para o cliente, já que a aba foi removida
      await createOrder('default_customer', Object.entries(quantities).map(([productId, quantity]) => ({ productId, quantity })), notes);
      Alert.alert('Pedido criado', 'O estoque foi reservado automaticamente.');
      navigate('orders');
    } catch (error) {
      Alert.alert('Não foi possível criar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>1. Adicione os produtos</Text>
        {products.map((product) => {
          const available = product.quantity - product.reserved;
          const quantity = quantities[product.id] ?? 0;
          return (
            <View key={product.id} style={styles.product}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>Disponível: {available} • R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable style={styles.stepButton} onPress={() => change(product.id, -1, available)}>
                  <Ionicons name="remove" size={18} color={colors.primary} />
                </Pressable>
                <Text style={styles.quantity}>{quantity}</Text>
                <Pressable style={[styles.stepButton, available <= quantity && styles.disabled]} onPress={() => change(product.id, 1, available)} disabled={available <= quantity}>
                  <Ionicons name="add" size={18} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          );
        })}

        <Text style={styles.section}>2. Observações</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Informações opcionais do pedido"
          placeholderTextColor="#98A2B3"
          style={styles.notes}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.items}>{totalItems} item(ns)</Text>
          <Text style={styles.total}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
        </View>
        <Pressable style={[styles.finish, !totalItems && styles.disabled]} onPress={finish} disabled={saving || !totalItems}>
          {saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.finishText}>Finalizar pedido</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: 17, paddingBottom: 120 },
  section: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 6, marginBottom: 11 },
  product: { minHeight: 73, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, padding: 13, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  productName: { color: colors.text, fontSize: 12, fontWeight: '900' },
  productMeta: { color: colors.textMuted, fontSize: 9, marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepButton: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  quantity: { color: colors.text, minWidth: 19, textAlign: 'center', fontWeight: '900' },
  disabled: { opacity: 0.4 },
  notes: { minHeight: 86, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, color: colors.text, padding: 13, textAlignVertical: 'top' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 88, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 8 },
  items: { color: colors.textMuted, fontSize: 10 },
  total: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 2 },
  finish: { minWidth: 158, height: 51, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  finishText: { color: colors.white, fontSize: 13, fontWeight: '900' }
});