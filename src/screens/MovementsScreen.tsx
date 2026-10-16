import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormInput } from '../components/ui/FormInput';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';

const labels: Record<string, string> = { entrada: 'Entrada', saida: 'Saída', ajuste: 'Ajuste', devolucao: 'Devolução', perda: 'Perda' };

export function MovementsScreen() {
  const { user } = useAuth();
  const { products, movements, registerMovement } = useData();
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('entrada');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const types = user?.role === 'admin' ? ['entrada', 'saida', 'ajuste', 'devolucao', 'perda'] : ['entrada', 'saida', 'devolucao', 'perda'];

  async function save() {
    setSaving(true);
    try {
      let amount = Number.parseInt(quantity, 10);
      if (type === 'ajuste' && !quantity.startsWith('-') && !quantity.startsWith('+')) amount = Number.parseInt(quantity, 10);
      await registerMovement({ productId, type, quantity: amount, reason, note });
      setQuantity(''); setReason(''); setNote('');
      Alert.alert('Estoque atualizado', 'A movimentação foi registrada no histórico.');
    } catch (error) { Alert.alert('Não foi possível registrar', error instanceof Error ? error.message : 'Tente novamente.'); }
    finally { setSaving(false); }
  }

  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.formCard}><Text style={styles.heading}>Nova movimentação</Text><Text style={styles.label}>Produto</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{products.map((product) => <Pressable key={product.id} style={[styles.productChoice, productId === product.id && styles.choiceActive]} onPress={() => setProductId(product.id)}><Text numberOfLines={1} style={[styles.choiceText, productId === product.id && styles.choiceTextActive]}>{product.name}</Text><Text style={[styles.choiceStock, productId === product.id && styles.choiceTextActive]}>Saldo: {product.quantity}</Text></Pressable>)}</ScrollView>{!products.length && <Text style={styles.emptyText}>Cadastre um produto antes de movimentar o estoque.</Text>}<Text style={styles.label}>Tipo</Text><View style={styles.typeWrap}>{types.map((item) => <Pressable key={item} style={[styles.type, type === item && styles.typeActive]} onPress={() => setType(item)}><Text style={[styles.typeText, type === item && styles.typeTextActive]}>{labels[item]}</Text></Pressable>)}</View><FormInput label={type === 'ajuste' ? 'Quantidade (+ entrada / - saída)' : 'Quantidade'} value={quantity} onChangeText={setQuantity} keyboardType={type === 'ajuste' ? 'numbers-and-punctuation' : 'number-pad'} placeholder={type === 'ajuste' ? 'Ex.: -3 ou 5' : 'Ex.: 10'} /><FormInput label="Motivo *" value={reason} onChangeText={setReason} placeholder="Ex.: Compra do fornecedor" /><FormInput label="Observação" value={note} onChangeText={setNote} placeholder="Informação opcional" multiline /><Pressable style={styles.primary} onPress={save} disabled={saving || !products.length}>{saving ? <ActivityIndicator color={colors.white} /> : <><Ionicons name="checkmark-circle-outline" size={21} color={colors.white} /><Text style={styles.primaryText}>Confirmar movimentação</Text></>}</Pressable></View>
    <Text style={styles.listTitle}>Últimas movimentações</Text>{movements.slice(0, 20).map((movement) => <View key={movement.id} style={styles.movement}><View style={[styles.movementIcon, movement.quantityDelta < 0 && styles.outIcon]}><Ionicons name={movement.quantityDelta > 0 ? 'arrow-down' : 'arrow-up'} size={20} color={movement.quantityDelta > 0 ? colors.success : colors.accent} /></View><View style={{ flex: 1 }}><Text style={styles.movementName}>{movement.productName}</Text><Text style={styles.movementMeta}>{labels[movement.type] ?? movement.type} • {movement.reason}</Text><Text style={styles.movementEmployee}>{movement.employeeName} • {new Date(movement.createdAt).toLocaleString('pt-BR')}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={[styles.delta, movement.quantityDelta < 0 && { color: colors.accent }]}>{movement.quantityDelta > 0 ? '+' : ''}{movement.quantityDelta}</Text><Text style={styles.balance}>Saldo {movement.balanceAfter}</Text></View></View>)}
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { padding: 17, paddingBottom: 40 }, formCard: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 12 }, heading: { color: colors.text, fontSize: 18, fontWeight: '900' }, label: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 2 }, choices: { gap: 8 }, productChoice: { width: 145, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 11 }, choiceActive: { backgroundColor: colors.primary, borderColor: colors.primary }, choiceText: { color: colors.text, fontSize: 11, fontWeight: '800' }, choiceTextActive: { color: colors.white }, choiceStock: { color: colors.textMuted, fontSize: 9, marginTop: 4 }, emptyText: { color: colors.textMuted, fontSize: 11 }, typeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, type: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: colors.border }, typeActive: { backgroundColor: colors.primaryLight, borderColor: '#B8CFF7' }, typeText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' }, typeTextActive: { color: colors.primary }, primary: { height: 52, borderRadius: 15, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, primaryText: { color: colors.white, fontWeight: '900', fontSize: 13 }, listTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 23, marginBottom: 10 }, movement: { flexDirection: 'row', gap: 11, padding: 13, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, marginBottom: 8, alignItems: 'center' }, movementIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center' }, outIcon: { backgroundColor: colors.accentLight }, movementName: { color: colors.text, fontSize: 12, fontWeight: '900' }, movementMeta: { color: colors.textMuted, fontSize: 9, marginTop: 3 }, movementEmployee: { color: '#929BAC', fontSize: 8, marginTop: 3 }, delta: { color: colors.success, fontSize: 17, fontWeight: '900' }, balance: { color: colors.textMuted, fontSize: 8, marginTop: 2 } });
