import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Sparkles, X } from 'lucide-react-native';

const PRESETS = [
  { name: 'Álcool', category: 'Bebidas Alcoólicas', color: '#27AE60', defaultCost: '25' },
  { name: 'Cigarro / Nicotina', category: 'Fumo', color: '#3498DB', defaultCost: '15' },
  { name: 'Vape / Pod', category: 'Fumo', color: '#9B59B6', defaultCost: '20' },
  { name: 'Apostas / Bet', category: 'Comportamental', color: '#E67E22', defaultCost: '50' },
  { name: 'Redes Sociais', category: 'Digital', color: '#E74C3C', defaultCost: '0' },
  { name: 'Pornografia', category: 'Comportamental', color: '#16A085', defaultCost: '0' },
];

const COLORS = ['#27AE60', '#3498DB', '#9B59B6', '#E67E22', '#E74C3C', '#16A085'];

export default function AddSubstanceModal({ visible, onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [dailyCost, setDailyCost] = useState('');
  const [reason, setReason] = useState('');
  const [color, setColor] = useState('#27AE60');
  const [daysAgo, setDaysAgo] = useState('0');

  const handleSelectPreset = (p) => {
    setName(p.name);
    setCategory(p.category);
    setColor(p.color);
    if (p.defaultCost && !dailyCost) setDailyCost(p.defaultCost);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do hábito ou substância.');
      return;
    }
    const pastDays = Math.max(0, parseInt(daysAgo, 10) || 0);
    const startDate = new Date(Date.now() - pastDays * 24 * 60 * 60 * 1000).toISOString();

    onSave({
      name: name.trim(),
      category: category.trim() || 'Geral',
      dailyCost: parseFloat(dailyCost.replace(',', '.')) || 0,
      reason: reason.trim(),
      color,
      startDate,
    });

    setName('');
    setCategory('');
    setDailyCost('');
    setReason('');
    setDaysAgo('0');
    setColor('#27AE60');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Novo Rastreador</Text>
              <Text style={styles.subtitle}>Acompanhe sua sobriedade</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Sugestões rápidas:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {PRESETS.map((p) => (
                <TouchableOpacity
                  key={p.name}
                  style={[styles.presetChip, name === p.name && styles.presetChipActive]}
                  onPress={() => handleSelectPreset(p)}
                >
                  <Text style={[styles.presetText, name === p.name && styles.presetTextActive]}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Álcool, Cigarro..."
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Bebidas"
                  placeholderTextColor="#94A3B8"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Dias já limpo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={daysAgo}
                  onChangeText={setDaysAgo}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Gasto diário estimado (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25.00"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={dailyCost}
              onChangeText={setDailyCost}
            />

            <Text style={styles.inputLabel}>Motivo para parar</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Pela minha saúde e clareza..."
              placeholderTextColor="#94A3B8"
              value={reason}
              onChangeText={setReason}
              multiline
            />

            <Text style={styles.inputLabel}>Cor</Text>
            <View style={styles.colorRow}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorSelected]}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  form: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  presetScroll: {
    marginBottom: 14,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#E8F8F0',
    borderColor: '#27AE60',
  },
  presetText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  presetTextActive: {
    color: '#27AE60',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  saveBtn: {
    backgroundColor: '#27AE60',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Começar a Rastrear</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
