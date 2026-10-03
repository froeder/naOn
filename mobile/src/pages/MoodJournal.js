import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Calendar, Plus } from 'lucide-react-native';
import { storeService } from '../services/storeService';
import { MOOD_OPTIONS, TRIGGER_TAGS } from '../services/mockData';

export default function MoodJournal() {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[1]);
  const [cravingLevel, setCravingLevel] = useState(1);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadJournal = async () => setEntries(await storeService.getJournalEntries());

  useEffect(() => {
    loadJournal();
    return storeService.subscribe((e) => e === 'journal_updated' && loadJournal());
  }, []);

  const handleToggleTrigger = (tag) => {
    setSelectedTriggers(
      selectedTriggers.includes(tag) ? selectedTriggers.filter((t) => t !== tag) : [...selectedTriggers, tag]
    );
  };

  const handleSaveEntry = async () => {
    if (!selectedMood) return;
    await storeService.addJournalEntry({
      id: `entry_${Date.now()}`,
      date: new Date().toISOString(),
      mood: selectedMood.id,
      cravingLevel,
      triggers: selectedTriggers,
      note: note.trim(),
    });
    setNote('');
    setSelectedTriggers([]);
    setShowForm(false);
  };

  const getMood = (id) => MOOD_OPTIONS.find((m) => m.id === id) || MOOD_OPTIONS[2];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Diário de Emoções</Text>
            <Text style={styles.subtitle}>Monitore gatilhos e sentimentos</Text>
          </View>
          <TouchableOpacity style={styles.newEntryBtn} onPress={() => setShowForm(!showForm)}>
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.newEntryBtnText}>{showForm ? 'Fechar' : 'Check-in'}</Text>
          </TouchableOpacity>
        </View>
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Como você está agora?</Text>
            <View style={styles.moodGrid}>
              {MOOD_OPTIONS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.moodItem, selectedMood?.id === m.id && { borderColor: m.color, backgroundColor: `${m.color}15` }]}
                  onPress={() => setSelectedMood(m)}
                >
                  <Text style={styles.moodIcon}>{m.icon}</Text>
                  <Text style={[styles.moodLabel, selectedMood?.id === m.id && { color: m.color, fontWeight: '700' }]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Nível de fissura (1 a 5):</Text>
            <View style={styles.cravingRow}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.cravingBtn, cravingLevel === lvl && styles.cravingBtnActive]}
                  onPress={() => setCravingLevel(lvl)}
                >
                  <Text style={[styles.cravingBtnText, cravingLevel === lvl && styles.cravingBtnTextActive]}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Gatilhos presentes:</Text>
            <View style={styles.tagsWrap}>
              {TRIGGER_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, selectedTriggers.includes(tag) && styles.tagChipActive]}
                  onPress={() => handleToggleTrigger(tag)}
                >
                  <Text style={[styles.tagText, selectedTriggers.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Reflexão do dia:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="O que te desafiou hoje?"
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
              multiline
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEntry}>
              <Text style={styles.saveBtnText}>Salvar Check-in</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.historyTitle}>Histórico de Registros</Text>

        {entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Calendar size={26} color="#94A3B8" />
            <Text style={styles.emptyText}>Nenhum registro ainda.</Text>
          </View>
        ) : (
          entries.map((item) => (
            <View key={item.id} style={styles.entryCard}>
              <View style={styles.entryTop}>
                <View style={styles.entryMoodRow}>
                  <Text style={styles.entryMoodIcon}>{getMood(item.mood).icon}</Text>
                  <View>
                    <Text style={styles.entryMoodLabel}>{getMood(item.mood).label}</Text>
                    <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
                  </View>
                </View>
                <View style={styles.cravingPill}>
                  <Text style={styles.cravingPillText}>Fissura: {item.cravingLevel}/5</Text>
                </View>
              </View>
              {item.triggers?.length > 0 && (
                <View style={styles.entryTagsRow}>
                  {item.triggers.map((t) => (
                    <View key={t} style={styles.entryTagBadge}><Text style={styles.entryTagText}>{t}</Text></View>
                  ))}
                </View>
              )}
              {item.note ? <Text style={styles.entryNote}>"{item.note}"</Text> : null}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 90 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B' },
  newEntryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#27AE60', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  newEntryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 10 },
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  moodItem: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1.5, borderColor: '#F1F5F9', minWidth: 55 },
  moodIcon: { fontSize: 22, marginBottom: 4 },
  moodLabel: { fontSize: 10, color: '#64748B' },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 10, marginBottom: 6 },
  cravingRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  cravingBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  cravingBtnActive: { backgroundColor: '#EF4444', borderColor: '#DC2626' },
  cravingBtnText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  cravingBtnTextActive: { color: '#FFFFFF' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tagChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  tagChipActive: { backgroundColor: '#E8F8F0', borderColor: '#27AE60' },
  tagText: { fontSize: 11, color: '#64748B' },
  tagTextActive: { color: '#27AE60', fontWeight: '700' },
  textArea: { backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', padding: 10, minHeight: 60, textAlignVertical: 'top', fontSize: 13 },
  saveBtn: { backgroundColor: '#27AE60', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { fontSize: 13, color: '#94A3B8', marginTop: 6 },
  entryCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  entryMoodRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  entryMoodIcon: { fontSize: 24 },
  entryMoodLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  entryDate: { fontSize: 11, color: '#94A3B8' },
  cravingPill: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  cravingPillText: { fontSize: 10, fontWeight: '700', color: '#DC2626' },
  entryTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  entryTagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  entryTagText: { fontSize: 10, color: '#475569' },
  entryNote: { fontSize: 12, fontStyle: 'italic', color: '#475569', marginTop: 4 },
});

