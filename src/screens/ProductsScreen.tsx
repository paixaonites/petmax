import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormInput } from '../components/ui/FormInput';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';

const initialForm = { name: '', internalCode: '', barcode: '', brand: '', category: '', weight: '', unit: 'UN', price: '', minimum: '', initial: '' };

export function ProductsScreen() {
  const { user } = useAuth();
  const { products, createProduct } = useData();
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const change = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function save() {
    setSaving(true);
    try {
      await createProduct({ name: form.name, internalCode: form.internalCode, barcode: form.barcode, brand: form.brand, category: form.category, weight: form.weight, unit: form.unit, price: Number(form.price.replace(',', '.')) || 0, minimumStock: Number.parseInt(form.minimum, 10) || 0, initialStock: Number.parseInt(form.initial, 10) || 0 });
      setVisible(false); setForm(initialForm); Alert.alert('Produto cadastrado', 'O produto e seu estoque já estão disponíveis nos outros celulares.');
    } catch (error) { Alert.alert('Não foi possível cadastrar', error instanceof Error ? error.message : 'Tente novamente.'); }
    finally { setSaving(false); }
  }

  return <View style={styles.page}>
    <ScrollView contentContainerStyle={styles.content}>
      {user?.role === 'admin' && <Pressable style={styles.primary} onPress={() => setVisible(true)}><Ionicons name="add" size={22} color={colors.white} /><Text style={styles.primaryText}>Cadastrar produto</Text></Pressable>}
      {user?.role !== 'admin' && <View style={styles.info}><Ionicons name="lock-closed-outline" size={18} color={colors.primary} /><Text style={styles.infoText}>Somente administradores podem cadastrar produtos.</Text></View>}
      <Text style={styles.heading}>{products.length} produto{products.length === 1 ? '' : 's'} cadastrado{products.length === 1 ? '' : 's'}</Text>
      {products.map((product) => <View key={product.id} style={styles.card}><View style={styles.icon}><Ionicons name="cube-outline" size={23} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{product.name}</Text><Text style={styles.meta}>{product.brand} • {product.category} • {product.weight}</Text><Text style={styles.code}>Código {product.code}</Text></View><View style={styles.stock}><Text style={styles.stockValue}>{product.quantity}</Text><Text style={styles.stockLabel}>unidades</Text></View></View>)}
      {!products.length && <View style={styles.empty}><Ionicons name="cube-outline" size={34} color={colors.primary} /><Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text><Text style={styles.emptyText}>Cadastre o primeiro produto para começar a controlar o estoque.</Text></View>}
    </ScrollView>
    <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
      <SafeAreaView style={styles.modal}><View style={styles.modalHead}><Pressable onPress={() => setVisible(false)}><Ionicons name="close" size={25} color={colors.text} /></Pressable><Text style={styles.modalTitle}>Novo produto</Text><View style={{ width: 25 }} /></View><ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled"><FormInput label="Nome do produto *" value={form.name} onChangeText={change('name')} placeholder="Ex.: Golden Adultos Frango" /><View style={styles.row}><View style={{ flex: 1 }}><FormInput label="Código interno *" value={form.internalCode} onChangeText={change('internalCode')} placeholder="001" /></View><View style={{ flex: 1 }}><FormInput label="Código de barras" value={form.barcode} onChangeText={change('barcode')} keyboardType="number-pad" /></View></View><View style={styles.row}><View style={{ flex: 1 }}><FormInput label="Marca *" value={form.brand} onChangeText={change('brand')} placeholder="Golden" /></View><View style={{ flex: 1 }}><FormInput label="Categoria *" value={form.category} onChangeText={change('category')} placeholder="Cães" /></View></View><View style={styles.row}><View style={{ flex: 1 }}><FormInput label="Peso" value={form.weight} onChangeText={change('weight')} placeholder="15 kg" /></View><View style={{ flex: 1 }}><FormInput label="Unidade" value={form.unit} onChangeText={change('unit')} placeholder="UN" /></View></View><View style={styles.row}><View style={{ flex: 1 }}><FormInput label="Preço" value={form.price} onChangeText={change('price')} keyboardType="decimal-pad" placeholder="149,90" /></View><View style={{ flex: 1 }}><FormInput label="Estoque mínimo" value={form.minimum} onChangeText={change('minimum')} keyboardType="number-pad" placeholder="10" /></View></View><FormInput label="Quantidade inicial" value={form.initial} onChangeText={change('initial')} keyboardType="number-pad" placeholder="0" /><Pressable style={styles.save} onPress={save} disabled={saving}>{saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveText}>Salvar produto</Text>}</Pressable></ScrollView></SafeAreaView>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { padding: 17, paddingBottom: 35 }, primary: { height: 53, borderRadius: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, primaryText: { color: colors.white, fontWeight: '900', fontSize: 14 }, info: { flexDirection: 'row', gap: 9, padding: 14, backgroundColor: colors.primaryLight, borderRadius: 15 }, infoText: { color: colors.primaryDark, flex: 1, fontSize: 11 }, heading: { color: colors.text, fontSize: 16, fontWeight: '900', marginVertical: 17 }, card: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 13, marginBottom: 9 }, icon: { width: 45, height: 45, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, name: { color: colors.text, fontSize: 13, fontWeight: '900' }, meta: { color: colors.textMuted, fontSize: 10, marginTop: 3 }, code: { color: '#929BAC', fontSize: 9, marginTop: 3 }, stock: { alignItems: 'center' }, stockValue: { color: colors.primary, fontWeight: '900', fontSize: 19 }, stockLabel: { color: colors.textMuted, fontSize: 8 }, empty: { backgroundColor: colors.white, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 30, alignItems: 'center' }, emptyTitle: { color: colors.text, fontWeight: '900', marginTop: 12 }, emptyText: { color: colors.textMuted, textAlign: 'center', fontSize: 11, lineHeight: 17, marginTop: 5 }, modal: { flex: 1, backgroundColor: colors.background }, modalHead: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border }, modalTitle: { color: colors.text, fontSize: 18, fontWeight: '900' }, form: { padding: 18, gap: 14, paddingBottom: 40 }, row: { flexDirection: 'row', gap: 10 }, save: { height: 54, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 5 }, saveText: { color: colors.white, fontSize: 14, fontWeight: '900' } });
