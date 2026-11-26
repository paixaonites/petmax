import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { colors } from '../theme/colors';

// ==========================================
// TIPAGENS (TYPES)
// ==========================================
// Extrai os nomes de ícones válidos do Ionicons
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Define as propriedades aceitas pelo componente genérico de módulo
type Props = { 
  title: string;          // Título principal exibido na tela
  description: string;    // Texto descritivo do módulo
  icon: IconName;         // Ícone ilustrativo do topo
  action?: string;        // Texto do botão de ação principal (opcional)
  features: string[];     // Lista de funcionalidades/recursos do módulo
};

// ==========================================
// COMPONENTE PRINCIPAL: GenericModuleScreen
// ==========================================
// Tela genérica flexível que serve para múltiplos módulos do sistema, contando inclusive com integração de câmera para leitura de códigos de barras.
export function GenericModuleScreen({ title, description, icon, action, features }: Props) {
  // Estados para gerenciar permissões da câmera e o estado de ativação/leitura
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Identifica automaticamente se este módulo específico é o leitor de código de barras
  const isScanner = title.toLowerCase().includes('leitor');

  // Solicita permissão de uso da câmera assim que o componente é montado (caso seja o leitor)
  useEffect(() => {
    if (isScanner) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [isScanner]);

  // Função disparada quando um código de barras é lido com sucesso pela câmera
  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setCameraActive(false);
    Alert.alert("Código Lido com Sucesso!", `Tipo: ${type}\nDado: ${data}`, [
      { text: "Escanear outro", onPress: () => setScanned(false) }
    ]);
  };

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL: CÂMERA ATIVA
  // ==========================================
  // Se o usuário clicou para abrir a câmera no leitor, exibe a visualização em tela cheia da câmera nativa
  if (isScanner && cameraActive) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128"],
          }}
          style={StyleSheet.absoluteFillObject}
        >
          {/* Botão flutuante para fechar a câmera */}
          <Pressable style={styles.closeButton} onPress={() => setCameraActive(false)}>
            <Ionicons name="close" size={22} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar Câmera</Text>
          </Pressable>
        </CameraView>
      </View>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO PADRÃO DO MÓDULO
  // ==========================================
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      
      {/* Bloco Hero (cabeçalho visual do módulo com ícone, título, descrição e botão de ação) */}
      <View style={styles.hero}>
        <View style={styles.icon}>
          <Ionicons name={icon} size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {/* Renderização condicional do botão de ação principal */}
        {action && (
          <Pressable 
            style={styles.button} 
            onPress={() => {
              if (isScanner) {
                // Valida se o usuário permitiu o uso da câmera antes de abrir
                if (hasPermission === false) {
                  Alert.alert('Permissão negada', 'Você precisa permitir o uso da câmera nas configurações do celular.');
                  return;
                }
                setCameraActive(true);
              } else {
                Alert.alert('Ação', `Clicou em: ${action}`);
              }
            }}
          >
            <Ionicons name={isScanner ? "camera-outline" : "add"} size={20} color={colors.white} />
            <Text style={styles.buttonText}>{action}</Text>
          </Pressable>
        )}
      </View>

      {/* Lista de funcionalidades / recursos preparados do módulo */}
      <Text style={styles.heading}>Funcionalidades preparadas</Text>
      {features.map((feature) => (
        <View key={feature} style={styles.feature}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={17} color={colors.success} />
          </View>
          <Text style={styles.featureText}>{feature}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      ))}

      {/* Caixa de aviso informativa no rodapé */}
      <View style={styles.note}>
        <Ionicons name="construct-outline" size={20} color={colors.warning} />
        <Text style={styles.noteText}>Esta tela já faz parte da navegação. O leitor de código já está integrado à câmera nativa.</Text>
      </View>

    </ScrollView>
  );
}

// ==========================================
// ESTILOS DO COMPONENTE (StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  page: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  content: { 
    padding: 17, 
    paddingBottom: 35 
  },
  hero: { 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: colors.white, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  icon: { 
    width: 68, 
    height: 68, 
    borderRadius: 22, 
    backgroundColor: colors.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: { 
    color: colors.text, 
    fontSize: 22, 
    fontWeight: '900', 
    marginTop: 15 
  },
  description: { 
    color: colors.textMuted, 
    fontSize: 13, 
    lineHeight: 20, 
    textAlign: 'center', 
    marginTop: 7 
  },
  button: { 
    marginTop: 18, 
    minHeight: 48, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  buttonText: { 
    color: colors.white, 
    fontWeight: '800', 
    fontSize: 13 
  },
  heading: { 
    color: colors.text, 
    fontSize: 16, 
    fontWeight: '900', 
    marginTop: 23, 
    marginBottom: 10 
  },
  feature: { 
    minHeight: 59, 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: colors.border, 
    paddingHorizontal: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 11, 
    marginBottom: 8 
  },
  check: { 
    width: 31, 
    height: 31, 
    borderRadius: 10, 
    backgroundColor: colors.successLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  featureText: { 
    flex: 1, 
    color: colors.text, 
    fontSize: 12, 
    fontWeight: '600' 
  },
  note: { 
    flexDirection: 'row', 
    gap: 10, 
    padding: 14, 
    borderRadius: 16, 
    backgroundColor: colors.warningLight, 
    marginTop: 12 
  },
  noteText: { 
    flex: 1, 
    color: '#795A20', 
    fontSize: 11, 
    lineHeight: 17 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    flexDirection: 'row', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    gap: 8, 
    zIndex: 999 
  }
});