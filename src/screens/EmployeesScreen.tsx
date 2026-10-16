import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

type Employee = { id: string; full_name: string; email: string; role: 'admin' | 'employee'; active: boolean };

export function EmployeesScreen() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {setLoading(true);try{setEmployees(await api<Employee[]>('/employees'));}catch(e){Alert.alert('Erro',e instanceof Error?e.message:'Falha ao carregar');}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();},[load]);
  async function toggle(employee:Employee){if(employee.id===user?.id)return Alert.alert('Ação bloqueada','Você não pode desativar o próprio acesso.');try{await api(`/employees/${employee.id}`,{method:'PATCH',body:{active:!employee.active}});await load();}catch(e){Alert.alert('Erro',e instanceof Error?e.message:'Falha ao atualizar');}}
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}><View style={styles.help}><Ionicons name="information-circle-outline" size={21} color={colors.primary} /><Text style={styles.helpText}>O funcionário deve tocar em “Criar acesso” na tela de login. O cadastro aparecerá aqui aguardando sua liberação.</Text></View><View style={styles.titleRow}><Text style={styles.heading}>Equipe</Text><Pressable style={styles.refresh} onPress={load}><Ionicons name="refresh" size={20} color={colors.primary} /></Pressable></View>{loading ? <ActivityIndicator color={colors.primary} /> : employees.map((employee) => <View key={employee.id} style={styles.card}><View style={[styles.avatar, !employee.active && styles.avatarInactive]}><Text style={styles.avatarText}>{employee.full_name.slice(0, 2).toUpperCase()}</Text></View><View style={{ flex: 1 }}><Text style={styles.name}>{employee.full_name}</Text><Text style={styles.email}>{employee.email}</Text><Text style={[styles.role, employee.active ? styles.active : styles.pending]}>{employee.role === 'admin' ? 'Administrador' : employee.active ? 'Funcionário ativo' : 'Aguardando liberação'}</Text></View><Switch value={employee.active} onValueChange={() => toggle(employee)} disabled={employee.id === user?.id} trackColor={{ false: '#D7DDE6', true: '#8EB3F3' }} thumbColor={employee.active ? colors.primary : colors.white} /></View>)}</ScrollView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { padding: 17, paddingBottom: 35 }, help: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.primaryLight }, helpText: { flex: 1, color: colors.primaryDark, fontSize: 11, lineHeight: 17 }, titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 11 }, heading: { color: colors.text, fontSize: 17, fontWeight: '900' }, refresh: { width: 39, height: 39, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, card: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, marginBottom: 8 }, avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, avatarInactive: { backgroundColor: colors.textMuted }, avatarText: { color: colors.white, fontWeight: '900' }, name: { color: colors.text, fontSize: 13, fontWeight: '900' }, email: { color: colors.textMuted, fontSize: 9, marginTop: 3 }, role: { fontSize: 9, fontWeight: '800', marginTop: 4 }, active: { color: colors.success }, pending: { color: colors.warning } });
