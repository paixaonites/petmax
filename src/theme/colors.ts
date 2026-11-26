// ==========================================
// PALETA DE CORES DO SISTEMA (Theme / Colors)
// ==========================================
// Define o dicionário de cores padrão utilizado em toda a interface do aplicativo PetStock,
// garantindo consistência visual e suporte a tons primários, secundários, de alerta e estados.
export const colors = {
  primary: '#0B4DBA',        // Cor primária oficial (Azul principal da marca)
  primaryDark: '#073783',    // Tom escuro da cor primária (usado em estados pressionados ou contrastes fortes)
  primaryLight: '#E9F1FF',   // Tom claro da cor primária (usado em fundos de destaque e seleções)
  accent: '#E53935',         // Cor de destaque/alerta grave (Vermelho para erros, exclusões e saídas)
  accentLight: '#FDECEC',    // Tom claro da cor de destaque (usado em caixas de aviso/erro)
  success: '#159A63',        // Cor de sucesso (Verde para saldos saudáveis, confirmações e entradas)
  successLight: '#E6F7F0',   // Tom claro da cor de sucesso (fundo para indicativos positivos)
  warning: '#E69017',        // Cor de aviso / atenção (Amarelo/Laranja para estoques baixos)
  warningLight: '#FFF5DE',   // Tom claro da cor de aviso (fundo para alertas moderados)
  white: '#FFFFFF',          // Branco puro (usado em cartões, fundos e textos contrastantes)
  background: '#F4F7FB',     // Cor de fundo padrão das telas e containers gerais
  surface: '#FFFFFF',        // Cor de superfície para elementos elevados (cards, modais)
  text: '#172033',           // Cor principal de textos (grafite escuro para alta legibilidade)
  textMuted: '#687386',      // Cor de texto secundária/suave (cinza para legendas e metadados)
  border: '#E4E9F1',         // Cor padrão de bordas, divisores e linhas separadoras
  dark: '#0C244B',           // Tom escuro profundo (usado em títulos de destaque e marcas)
  overlay: 'rgba(8, 23, 48, 0.46)', // Cor de sobreposição semitransparente (usada em fundos de Modais/Drawers)
};