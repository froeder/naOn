import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { Plus, ShieldAlert, Sparkles, TrendingUp, DollarSign, Award } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/storeService';
import SubstanceCard from '../components/SubstanceCard';
import AddSubstanceModal from '../components/AddSubstanceModal';

export default function Dashboard({ onOpenSOS }) {
  const { user } = useAuth();
  const [substances, setSubstances] = useState([]);
  const [quote, setQuote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const subList = await storeService.getSubstances();
    setSubstances(subList);
    const dailyQuote = await storeService.getDailyQuote();
    setQuote(dailyQuote);
  };

  useEffect(() => {
    loadData();
    const unsub = storeService.subscribe((event) => {
      if (['substance_added', 'substance_reset', 'substance_deleted'].includes(event)) {
        loadData();
      }
    });
    return unsub;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddSubstance = async (data) => {
    await storeService.addSubstance(data);
    await loadData();
  };

  const handleReset = async (id, reason, notes) => {
    await storeService.resetSubstance(id, reason, notes);
    await loadData();
  };

  const handleDelete = async (id) => {
    await storeService.deleteSubstance(id);
    await loadData();
  };

  let totalSavings = 0;
  let maxDays = 0;
  substances.forEach((s) => {
    const diffDays = Math.max(0, Math.floor((Date.now() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24)));
    if (diffDays > maxDays) maxDays = diffDays;
    if (s.dailyCost) totalSavings += diffDays * s.dailyCost;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#27AE60']} />}
      >
        <View style={styles.topBar}>
          <Text style={styles.greeting}>Olá, {user?.displayName?.split(' ')[0] || 'Guerreiro(a)'} 👋</Text>
          <Text style={styles.subGreeting}>Um dia de cada vez. Você é mais forte que o vício.</Text>
        </View>

        {quote && (
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <Sparkles size={16} color="#27AE60" />
              <Text style={styles.quoteTag}>Sabedoria do Dia</Text>
            </View>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <View style={styles.statBox}>
            <Award size={18} color="#27AE60" />
            <Text style={styles.statNumber}>{maxDays}</Text>
            <Text style={styles.statLabel}>Maior Sequência (dias)</Text>
          </View>
          <View style={styles.statBox}>
            <DollarSign size={18} color="#10B981" />
            <Text style={styles.statNumber}>R$ {Math.floor(totalSavings)}</Text>
            <Text style={styles.statLabel}>Total Economizado</Text>
          </View>
          <View style={styles.statBox}>
            <TrendingUp size={18} color="#3B82F6" />
            <Text style={styles.statNumber}>{substances.length}</Text>
            <Text style={styles.statLabel}>Rastreadores Ativos</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seus Rastreadores</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.8}>
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Novo</Text>
          </TouchableOpacity>
        </View>

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  topBar: {
    marginBottom: 14,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subGreeting: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  quoteTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#27AE60',
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#27AE60',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
    gap: 10,
  },
  sosIconBox: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 10,
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  sosDesc: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
});


        {substances.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum rastreador ativo</Text>
            <Text style={styles.emptyDesc}>Adicione o que deseja superar hoje!</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowAddModal(true)}>
              <Plus size={15} color="#FFFFFF" />
              <Text style={styles.emptyAddBtnText}>Criar Rastreador</Text>
            </TouchableOpacity>
          </View>
        ) : (
          substances.map((item) => (
            <SubstanceCard key={item.id} substance={item} onReset={handleReset} onDelete={handleDelete} />
          ))
        )}

        <TouchableOpacity style={styles.sosCard} onPress={onOpenSOS} activeOpacity={0.85}>
          <View style={styles.sosIconBox}><ShieldAlert size={20} color="#FFFFFF" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>Em crise ou fissura?</Text>
            <Text style={styles.sosDesc}>Acesse o SOS: respiração guiada e linhas de apoio 24h.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <AddSubstanceModal visible={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddSubstance} />
    </SafeAreaView>
  );
}
