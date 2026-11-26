import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useData } from '../contexts/DataContext';
import { colors } from '../theme/colors';

// ==========================================
// TIPAGENS (TYPES)
// ==========================================
// Define os tipos de filtros de estoque disponíveis na tela
type Filter = 'Todos' | 'Normal' | 'Baixo' | 'Sem estoque';

// ==========================================
// COMPONENTE PRINCIPAL: InventoryScreen
// ==========================================
// Tela de gerenciamento e consulta de estoque em tempo real, com suporte a busca textual, filtros por status e puxar para atualizar (pull-to-refresh).
export function InventoryScreen() {
  const { products, refreshing, refresh, error } = useData();
  
  // Estados para controlar o texto de busca (query) e o filtro de status selecionado
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');

  // Filtra e busca os produtos dinamicamente com base no texto digitado e no filtro de status selecionado
  const list = useMemo(() => products.filter((product) => {
    const search = query.toLowerCase();
    
    // Verifica se o termo de busca corresponde a nome, marca, categoria, código interno ou código de barras
    const matches = [product.name, product.brand, product.category, product.code, product.barcode].some((value) => value.toLowerCase().includes(search));
    
    // Classifica o status do estoque do produto
    const status = product.quantity === 0 ? 'Sem estoque' : product.quantity <= product.minimum ? 'Baixo' : 'Normal';
    
    return matches && (filter === 'Todos' || filter === status);
  }), [filter, query, products]);

  return (
    <ScrollView 
      style={styles.page} 
      contentContainerStyle={styles.content} 
      keyboardShouldPersistTaps="handled" 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
    >
      
      {/* Barra de Pesquisa */}
      <View style={styles.search}>
        <Ionicons name="search-outline" size={21} color={colors.textMuted} />
        <TextInput 
          value={query} 
          onChangeText={setQuery} 
          style={styles.searchInput} 
          placeholder="Nome, código, marca ou categoria" 
          placeholderTextColor="#949FB1" 
        />
        {/* Botão para limpar a busca rapidamente se houver texto digitado */}
        {query ? (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Lista Horizontal de Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {(['Todos', 'Normal', 'Baixo', 'Sem estoque'] as Filter[]).map((item) => (
          <Pressable 
            key={item} 
            style={[styles.filter, filter === item && styles.filterActive]} 
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Cabeçalho de resumo da contagem e indicador de sincronização */}
      <View style={styles.summary}>
        <Text style={styles.result}>
          {list.length} produto{list.length === 1 ? '' : 's'} encontrado{list.length === 1 ? '' : 's'}
        </Text>
        <Text style={styles.sync}>
          <Ionicons name="sync" size={12} /> atualizado agora
        </Text>
      </View>

      {/* Exibição de mensagem de erro, caso ocorra falha ao carregar os dados */}
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de Produtos Encontrados */}
      <View style={styles.list}>
        {list.map((product) => {
          const status = product.quantity === 0 ? 'Sem estoque' : product.quantity <= product.minimum ? 'Baixo' : 'Normal';
          const available = product.quantity - product.reserved; // Quantidade disponível deduzindo reservas pendentes

          return (
            <Pressable key={product.id} style={styles.card}>
              
              {/* Ícone ilustrativo do produto */}
              <View style={styles.productIcon}>
                <Ionicons name="paw-outline" size={24} color={colors.primary} />
              </View>

              {/* Informações principais do produto */}
              <View style={styles.productMain}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.meta}>{product.brand} • {product.weight}</Text>
                <Text style={styles.code}>Cód. {product.code}{product.barcode ? ` • EAN ${product.barcode}` : ''}</Text>
                
                {/* Linha de detalhamento das quantidades (Físico, Reservado e Disponível) */}
                <View style={styles.stockRow}>
                  <View>
                    <Text style={styles.stockLabel}>Físico</Text>
                    <Text style={styles.stockValue}>{product.quantity}</Text>
                  </View>
                  <View>
                    <Text style={styles.stockLabel}>Reservado</Text>
                    <Text style={styles.stockValue}>{product.reserved}</Text>
                  </View>
                  <View>
                    <Text style={styles.stockLabel}>Disponível</Text>
                    <Text style={[styles.stockValue, available <= 0 && { color: colors.accent }]}>{available}</Text>
                  </View>
                </View>
              </View>

              {/* Lado direito do cartão: Badge de status e seta de navegação */}
              <View style={styles.cardRight}>
                <StatusBadge label={status} />
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>

            </Pressable>
          );
        })}

        {/* Componente de estado vazio exibido caso nenhum produto corresponda à busca/filtro */}
        {!list.length && (
          <EmptyState 
            title="Nenhum produto encontrado" 
            description="Tente outro termo de busca ou altere o filtro selecionado." 
          />
        )}
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
    paddingBottom: 34 
  }, 
  search: { 
    height: 54, 
    backgroundColor: colors.white, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 9, 
    paddingHorizontal: 14 
  }, 
  searchInput: { 
    flex: 1, 
    color: colors.text, 
    fontSize: 14 
  }, 
  filters: { 
    gap: 8, 
    paddingVertical: 14 
  }, 
  filter: { 
    paddingHorizontal: 15, 
    paddingVertical: 9, 
    borderRadius: 999, 
    borderWidth: 1, 
    borderColor: colors.border, 
    backgroundColor: colors.white 
  }, 
  filterActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary 
  }, 
  filterText: { 
    color: colors.textMuted, 
    fontSize: 12, 
    fontWeight: '700' 
  }, 
  filterTextActive: { 
    color: colors.white 
  },
  summary: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  }, 
  result: { 
    color: colors.text, 
    fontWeight: '800', 
    fontSize: 13 
  }, 
  sync: { 
    color: colors.success, 
    fontSize: 10 
  }, 
  list: { 
    gap: 10 
  }, 
  card: { 
    backgroundColor: colors.white, 
    borderRadius: 18, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: colors.border, 
    flexDirection: 'row', 
    gap: 12 
  }, 
  productIcon: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    backgroundColor: colors.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }, 
  productMain: { 
    flex: 1 
  }, 
  productName: { 
    color: colors.text, 
    fontWeight: '900', 
    fontSize: 14, 
    lineHeight: 18 
  }, 
  meta: { 
    color: colors.textMuted, 
    fontSize: 11, 
    marginTop: 4 
  }, 
  code: { 
    color: '#929BAC', 
    fontSize: 9, 
    marginTop: 3 
  }, 
  stockRow: { 
    flexDirection: 'row', 
    gap: 22, 
    marginTop: 13, 
    paddingTop: 11, 
    borderTopWidth: 1, 
    borderTopColor: colors.border 
  }, 
  stockLabel: { 
    color: colors.textMuted, 
    fontSize: 9 
  }, 
  stockValue: { 
    color: colors.text, 
    fontSize: 14, 
    fontWeight: '900', 
    marginTop: 2 
  }, 
  cardRight: { 
    alignItems: 'flex-end', 
    justifyContent: 'space-between' 
  },
  errorBox: { 
    padding: 12, 
    borderRadius: 13, 
    backgroundColor: colors.accentLight, 
    marginBottom: 10 
  }, 
  errorText: { 
    color: colors.accent, 
    fontSize: 11 
  },
});