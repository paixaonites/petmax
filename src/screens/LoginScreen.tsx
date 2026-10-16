import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

export function LoginScreen() {
  const { signIn, signUp, configured } = useAuth();
  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleLogin() {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      if (registerMode) {
        const result = await signUp(name, email, password);
        if (result.needsEmailConfirmation || result.pendingApproval) {
          setSuccess(result.pendingApproval ? 'Cadastro realizado. Aguarde a liberação do administrador.' : 'Cadastro realizado. Aguarde a liberação do administrador.');
          setRegisterMode(false);
        }
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.decorOne} /><View style={styles.decorTwo} />
        <View style={styles.content}>
          <Logo />
          <View style={styles.heading}>
            <Text style={styles.title}>{registerMode ? 'Criar primeiro acesso' : 'Bem-vindo de volta'}</Text>
            <Text style={styles.subtitle}>{registerMode ? 'O primeiro cadastro do sistema será o administrador.' : 'Entre para acessar estoque, pedidos e romaneios.'}</Text>
          </View>

          <View style={styles.form}>
            {registerMode && <><Text style={styles.label}>Nome completo</Text><View style={styles.inputWrap}><Ionicons name="person-outline" size={20} color={colors.textMuted} /><TextInput value={name} onChangeText={setName} autoCapitalize="words" style={styles.input} placeholder="Nome do funcionário" placeholderTextColor="#9AA4B5" /></View></>}
            <Text style={styles.label}>E-mail ou usuário</Text>
            <View style={[styles.inputWrap, !!error && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={colors.textMuted} />
              <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholder="seu@email.com" placeholderTextColor="#9AA4B5" />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrap, !!error && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.input} placeholder="Sua senha" placeholderTextColor="#9AA4B5" />
              <Pressable onPress={() => setShowPassword((value) => !value)} hitSlop={10}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={colors.textMuted} />
              </Pressable>
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}
            {!!success && <Text style={styles.success}>{success}</Text>}
            {!registerMode && <Pressable style={styles.forgot}><Text style={styles.forgotText}>Esqueci minha senha</Text></Pressable>}
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, !configured && styles.buttonDisabled]} onPress={handleLogin} disabled={submitting || !configured}>
              {submitting ? <ActivityIndicator color={colors.white} /> : <><Text style={styles.buttonText}>{registerMode ? 'Criar conta' : 'Entrar'}</Text><Ionicons name="arrow-forward" size={20} color={colors.white} /></>}
            </Pressable>
            <Pressable style={styles.switchMode} onPress={() => { setRegisterMode((value) => !value); setError(''); setSuccess(''); }} disabled={!configured}><Text style={styles.switchText}>{registerMode ? 'Já tenho conta • Entrar' : 'Primeiro acesso • Criar administrador'}</Text></Pressable>
          </View>
          <View style={[styles.demo, !configured && styles.setup]}><Ionicons name={configured ? 'shield-checkmark-outline' : 'construct-outline'} size={18} color={configured ? colors.success : colors.warning} /><Text style={[styles.demoText, !configured && styles.setupText]}>{configured ? 'Conexão segura com o banco configurada.' : 'API ainda não configurada. Consulte GUIA-MYSQL.md.'}</Text></View>
          <Text style={styles.version}>Correção 2.0.1</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', overflow: 'hidden' },
  content: { paddingHorizontal: 26, width: '100%', maxWidth: 480, alignSelf: 'center' },
  decorOne: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#E4EDFF', top: -120, right: -100 },
  decorTwo: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: '#FCE7E7', bottom: -90, left: -70 },
  heading: { marginTop: 42, marginBottom: 28 },
  title: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  subtitle: { fontSize: 14, color: colors.textMuted, lineHeight: 21, marginTop: 8, maxWidth: 360 },
  form: { gap: 9 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 5 },
  inputWrap: { height: 55, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 15 },
  inputError: { borderColor: '#F0A7A5' },
  input: { flex: 1, color: colors.text, fontSize: 15 },
  error: { color: colors.accent, fontSize: 12, lineHeight: 17 },
  success: { color: colors.success, fontSize: 12, lineHeight: 17 },
  forgot: { alignSelf: 'flex-end', paddingVertical: 6 },
  forgotText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  button: { height: 56, marginTop: 5, borderRadius: 17, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: colors.primary, shadowOpacity: 0.26, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  buttonPressed: { backgroundColor: colors.primaryDark, transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  switchMode: { alignItems: 'center', paddingVertical: 10 },
  switchText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  demo: { flexDirection: 'row', gap: 7, alignItems: 'center', marginTop: 22, padding: 12, borderRadius: 13, backgroundColor: colors.primaryLight },
  demoText: { flex: 1, color: colors.primaryDark, fontSize: 11, lineHeight: 16 },
  setup: { backgroundColor: colors.warningLight },
  setupText: { color: '#795A20' },
  version: { marginTop: 10, textAlign: 'center', color: colors.textMuted, fontSize: 10 },
});
